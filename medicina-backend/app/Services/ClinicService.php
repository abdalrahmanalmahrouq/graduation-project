<?php

namespace App\Services;

use App\Models\AvailableAppointment;
use App\Models\Clinic;
use App\Models\ClinicDoctor;
use App\Models\Doctor;
use Illuminate\Support\Facades\DB;

class ClinicService
{
    /**
     * Get all doctors associated with a clinic
     */
    public function getClinicDoctors(string $clinicId)
    {
        $clinic = Clinic::where('user_id', $clinicId)->firstOrFail();

        return $clinic->doctors()
            ->wherePivot('deleted_at', null)
            ->with('user')
            ->get();
    }

    /**
     * Get doctor's schedule for a specific clinic
     */
    public function getDoctorSchedule(string $doctorId, string $clinicId): array
    {
        $status = $this->checkDoctorStatus($clinicId, $doctorId);
        if ($status !== 'active') {
            throw new \Exception('Doctor must exist and be active in this clinic.', 404);
        }

        $pivot = ClinicDoctor::where('clinic_id', $clinicId)
            ->where('doctor_id', $doctorId)
            ->firstOrFail();

        return $pivot->weekly_schedule;
    }

    /**
     * Check doctor status in clinic (active, trashed, or not_found)
     */
    public function checkDoctorStatus(string $clinicId, string $doctorId): string
    {
        $existingRelation = ClinicDoctor::withTrashed()
            ->where('clinic_id', $clinicId)
            ->where('doctor_id', $doctorId)
            ->first();

        if ($existingRelation) {
            if ($existingRelation->deleted_at) {
                return 'trashed';
            } else {
                return 'active';
            }
        }
        return 'not_found';
    }

    /**
     * Reschedule doctor's weekly schedule
     */
    public function rescheduleDoctor(string $clinicId, string $doctorId, array $weeklySchedule): bool
    {
        $status = $this->checkDoctorStatus($clinicId, $doctorId);
        if ($status !== 'active') {
            throw new \Exception('Doctor must exist and be active in this clinic.', 404);
        }

        // Check for schedule conflicts and validate break times        
        $weeklySchedule = $this->checkDoctorSchedule($doctorId, $clinicId, $weeklySchedule);

        return DB::transaction(function () use ($clinicId, $doctorId, $weeklySchedule) {
            $clinicDoctor = ClinicDoctor::where('doctor_id', $doctorId)
                ->where('clinic_id', $clinicId)
                ->firstOrFail();

            // Delete existing available appointments
            AvailableAppointment::where('clinic_doctor_id', $clinicDoctor->id)->delete();

            // Update schedule
            $clinicDoctor->update(['weekly_schedule' => $weeklySchedule]);

            // Generate new available appointment slots
            AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);

            return true;
        });
    }

    /**
     * Check for doctor schedule conflicts with other clinics and validate break times
     */
    public function checkDoctorSchedule(string $doctorId, string $clinicId, array $weeklySchedule): array
    {
        //  Check for schedule conflicts
        $incoming = is_array($weeklySchedule) ? $weeklySchedule : [];
        $days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        // Fetch other clinics where this doctor works (exclude current clinic)
        $otherAssignments = ClinicDoctor::where('doctor_id', $doctorId)->where('clinic_id', '!=', $clinicId)->get();

        $conflicts = [];
        foreach ($otherAssignments as $assignment) {
            $existing = (array) ($assignment->weekly_schedule ?? []);
            foreach ($days as $day) {
                $a = $incoming[$day] ?? [];
                $b = $existing[$day] ?? [];
                // Both have working intervals on the same day
                if (!empty($a) && !empty($b) && 
                    isset($a['start_time'], $a['end_time'], $b['start_time'], $b['end_time'])) {
                    if ($this->timesOverlap($a['start_time'], $a['end_time'], $b['start_time'], $b['end_time'])) {
                        $conflicts[] = [
                            'clinic_id' => $assignment->clinic_id,
                            'day' => $day,
                            'this' => ['start_time' => $a['start_time'], 'end_time' => $a['end_time']],
                            'other' => ['start_time' => $b['start_time'], 'end_time' => $b['end_time']],
                        ];
                    }
                }
            }
        }
        if (!empty($conflicts)) {
            $message = "Schedule conflicts detected with the following day(s):\n";
            foreach ($conflicts as $conflict) {
                $message .= "- {$conflict['day']}\n";
            }
            throw new \Exception($message, 409);
        }

        // Validate break times
        $invalidDays = [];
        foreach ($weeklySchedule as $day => &$times) {
            if (empty($times) || !isset($times['start_time'], $times['end_time'])) {
                continue;
            }
            if (isset($times['break_start'], $times['break_end'])) {
                $workStart = strtotime($times['start_time']);
                $workEnd = strtotime($times['end_time']);
                $breakStart = strtotime($times['break_start']);
                $breakEnd = strtotime($times['break_end']);
                // Ensure break start is within working hours
                if ($breakStart < $workStart || $breakStart >= $workEnd) {
                    $invalidDays[] = [
                        'day' => $day,
                        'field' => 'break_start',
                        'reason' => 'بداية الاستراحة يجب أن تكون ضمن أوقات العمل',
                        'work_hours' => $times['start_time'] . ' - ' . $times['end_time'],
                        'break_time' => $times['break_start'] . ' - ' . $times['break_end']
                    ];
                    continue;
                }
                // Ensure break end is after break start
                if ($breakEnd <= $breakStart) {
                    $invalidDays[] = [
                        'day' => $day,
                        'field' => 'break_end',
                        'reason' => 'نهاية الاستراحة يجب أن تكون بعد بدايتها',
                        'work_hours' => $times['start_time'] . ' - ' . $times['end_time'],
                        'break_time' => $times['break_start'] . ' - ' . $times['break_end']
                    ];
                    continue;
                }
                // Adjust break end if it exceeds working hours
                if ($breakEnd > $workEnd) {
                    $times['break_end'] = date('H:i', $workEnd);
                }
            }
        }
        if (!empty($invalidDays)) {
            $message = "Invalid break times detected in the following day(s):\n";
            foreach ($invalidDays as $invalid) {
                $message .= "- {$invalid['day']}: {$invalid['reason']}\n";
            }
            throw new \Exception($message, 400);
        }
        
        return $weeklySchedule;
    }
    
    /**
     * Check if two time intervals overlap
     */
    protected function timesOverlap(string $aStart, string $aEnd, string $bStart, string $bEnd): bool
    {
        $aStartTime = strtotime($aStart);
        $aEndTime = strtotime($aEnd);
        $bStartTime = strtotime($bStart);
        $bEndTime = strtotime($bEnd);
        
        return max($aStartTime, $bStartTime) < min($aEndTime, $bEndTime);
    }

    /**
     * Add a doctor to a clinic with schedule validation
     */
    public function addDoctor(string $clinicId, string $doctorId, array $weeklySchedule): array
    {
        // Check if doctor is already associated with clinic (active or trashed)
        $status = $this->checkDoctorStatus($clinicId, $doctorId);
        if ($status === 'active') {
            throw new \Exception('Doctor already added to clinic.', 409);
        }
        elseif ($status === 'trashed') {
            ClinicDoctor::withTrashed()->where('clinic_id', $clinicId)->where('doctor_id', $doctorId)->restore();
            return ['status' => 'restored', 'message' => 'Doctor restored to clinic successfully.'];
        }

        // Check for schedule conflicts and validate break times        
        $weeklySchedule = $this->checkDoctorSchedule($doctorId, $clinicId, $weeklySchedule);

        $clinicDoctor = ClinicDoctor::create([
            'clinic_id' => $clinicId,
            'doctor_id' => $doctorId,
            'weekly_schedule' => $weeklySchedule
        ]);

        // Generate available appointment slots
        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);

        return [
            'status' => 'created',
            'message' => 'Doctor added to clinic successfully',
            'doctor' => $clinicDoctor
        ];
    }

    /**
     * Remove (soft delete) a doctor from clinic
     */
    public function removeDoctor(string $clinicId, string $doctorId): bool
    {
        $clinicDoctor = ClinicDoctor::where('clinic_id', $clinicId)
        ->where('doctor_id', $doctorId)
        ->whereNull('deleted_at')
        ->update(['deleted_at' => now()]);

        if (!$clinicDoctor) {
            throw new \Exception('Doctor not found or already removed from clinic.', 404);
        }

        return true;
    }
}
