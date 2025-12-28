<?php

namespace App\Http\Controllers;
use App\Http\Resources\ClinicDoctorResource;
use App\Models\AvailableAppointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use App\Models\ClinicDoctor;
use App\Services\AvailableAppointmentService;

class ClinicController extends Controller
{
    // Get all doctors who are associated with the clinic
    public function getDoctors(Request $request)
    {
        $user = auth()->user();
        $clinic = $user->clinic;

        // Get all active doctors added to this clinic (exclude soft-deleted ones)
        $clinicDoctors = $clinic->doctors()
            ->wherePivot('deleted_at', null) // Only get doctors that are not soft-deleted
            ->with('user')
            ->get();

        // Add profile image URL to each doctor
        $clinicDoctors->each(function ($doctor) {
            if ($doctor->user && $doctor->user->profile_image) {
                $doctor->profile_image_url = $doctor->user->profile_image_url;
            } else {
                $doctor->profile_image_url = null;
            }
        });

        return ClinicDoctorResource::collection($clinicDoctors);
    }

    public function getDoctorSchedule(Request $request, $doctorId) {

        $doctor = Doctor::where('user_id', $doctorId)
        ->orWhere('id', $doctorId)
        ->firstOrFail();
        $clinicId = auth()->user()->clinic->user_id;

        $pivot = ClinicDoctor::where('clinic_id', $clinicId)
        ->where('doctor_id', $doctor->user_id)
        ->firstOrFail();

        return response()->json([
        'success' => true,
        'schedule' => $pivot->weekly_schedule
    ], 200);
    }

    // Add a doctor to a clinic
    public function addDoctor(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
            'weekly_schedule' => 'required|array',
        ]);

        $clinic = auth()->user()->id;
        
        // Check for schedule conflicts FIRST before validating break times
        $conflicts = $this->checkDoctorScheduleConflicts($validated['doctor_id'], $clinic, $validated['weekly_schedule']);
        if (!empty($conflicts)) {
            // Format conflict errors by day
            $conflictsByDay = [];
            foreach ($conflicts as $conflict) {
                $day = $conflict['day'];
                if (!isset($conflictsByDay[$day])) {
                    $conflictsByDay[$day] = [
                        'day' => $day,
                        'field' => 'overlap',
                        'reason' => 'يتعارض جدول الطبيب مع جدول آخر في عيادة أخرى'
                    ];
                }
            }
            return response()->json([
                'success' => false,
                'message' => 'يوجد تعارض في جدول الطبيب مع عيادات أخرى',
                'invalid_days' => array_values($conflictsByDay),
                'conflicts' => $conflicts
            ], 400);
        }
        
        // Validate break times and get result
        $breakValidation = $this->validateBreakTime($validated['weekly_schedule']);
        if (isset($breakValidation['error'])) {
            return response()->json([
                'success' => false,
                'message' => $breakValidation['error'],
                'invalid_days' => $breakValidation['days'] ?? []
            ], 400);
        }
        $validated['weekly_schedule'] = $breakValidation['schedule'];

        $assignedDoctor = ClinicDoctor::withTrashed()->where('clinic_id', $clinic)
            ->where('doctor_id', $request->doctor_id)
            ->first();

        if ($assignedDoctor) {
            // Doctor exists in clinic
            if ($assignedDoctor->deleted_at) {
                // Doctor was soft deleted, restore them
                $assignedDoctor->restore();
                return response()->json([
                    'success' => true,
                    'message' => 'Doctor restored to clinic successfully.'
                ], 200);
            } else {
                // Doctor is already active in clinic
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor already added to clinic.'
                ], 409);
            }
        } else {
            // Doctor doesn't exist in clinic, add them
            $clinicDoctor = ClinicDoctor::create([
                'clinic_id' => $clinic,
                'doctor_id' => $validated['doctor_id'],
                'weekly_schedule' => $validated['weekly_schedule']
            ]);
        }

        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);

        return response()->json(['message' => 'Doctor added to clinic successfully', 'data' => $clinicDoctor], 201);
    }

    public function reScheduleDoctorWeeklySchedule(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
            'weekly_schedule' => 'required|array',
        ]);

        $clinicId = auth()->user()->clinic->user_id;
        
        // Check for schedule conflicts FIRST before validating break times
        $conflicts = $this->checkDoctorScheduleConflicts($validated['doctor_id'], $clinicId, $validated['weekly_schedule']);
        if (!empty($conflicts)) {
            // Format conflict errors by day
            $conflictsByDay = [];
            foreach ($conflicts as $conflict) {
                $day = $conflict['day'];
                if (!isset($conflictsByDay[$day])) {
                    $conflictsByDay[$day] = [
                        'day' => $day,
                        'field' => 'overlap',
                        'reason' => 'يتعارض جدول الطبيب مع جدول آخر في عيادة أخرى'
                    ];
                }
            }
            return response()->json([
                'success' => false,
                'message' => 'يوجد تعارض في جدول الطبيب مع عيادات أخرى',
                'invalid_days' => array_values($conflictsByDay),
                'conflicts' => $conflicts
            ], 400);
        }
        
        // Validate break times and get result
        $breakValidation = $this->validateBreakTime($validated['weekly_schedule']);
        if (isset($breakValidation['error'])) {
            return response()->json([
                'success' => false,
                'message' => $breakValidation['error'],
                'invalid_days' => $breakValidation['days'] ?? []
            ], 400);
        }
        $validated['weekly_schedule'] = $breakValidation['schedule'];

        $clinicDoctor = ClinicDoctor::where('doctor_id', $validated['doctor_id'])
        ->where('clinic_id', $clinicId)
        ->firstOrFail();

        $availableAppointments = AvailableAppointment::where('clinic_doctor_id', $clinicDoctor->id)
        ->get();

        foreach ($availableAppointments as $availableAppointment) {
            $availableAppointment->delete();
        }

        $clinicDoctor->weekly_schedule = $validated['weekly_schedule'];
        $clinicDoctor->save();

        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);

        return response()->json([
            'success' => true,
            'message' => 'Doctor weekly schedule re-scheduled successfully.'
        ], 200);
    }

    // when adding or updating a doctor's schedule, check if break time is within working hours, if break_end is after end time, make break_end equal to end time
    private function validateBreakTime(array $schedule): array
    {
        $invalidDays = [];
        
        foreach ($schedule as $day => &$times) {
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
            return [
                'error' => 'يوجد أخطاء في أوقات الاستراحة',
                'days' => $invalidDays
            ];
        }
        
        return ['schedule' => $schedule];
    }

    public function checkDoctor(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|string'
        ]);

        $doctor = Doctor::where('user_id', $request->doctor_id)
            ->select('id', 'user_id', 'full_name', 'specialization')
            ->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found.'
            ], 404);
        }
        ;

        $clinicId = auth()->user()->clinic->user_id;

        $existingRelation = ClinicDoctor::withTrashed()
            ->where('clinic_id', $clinicId)
            ->where('doctor_id', $doctor->user_id)
            ->first();

        if ($existingRelation) {
            if ($existingRelation->deleted_at) {
                return response()->json([
                    'success' => true,
                    'status' => 'trashed',
                    'message' => 'Doctor was previously deleted.',
                    'data' => $doctor
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'status' => 'active',
                    'message' => 'Doctor is already active in this clinic.',
                    'data' => $doctor
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'status' => 'new',
            'data' => $doctor
        ]);

    }

    // Delete a doctor from a clinic
    public function deleteDoctor(Request $request)
    {
        try {
            $request->validate([
                'doctor_id' => 'required|exists:doctors,user_id',
            ]);

            $user = auth()->user();
            $clinic = $user->clinic;

            $doctorClinic = $clinic->doctors()
                ->wherepivot('doctor_id', $request->doctor_id)
                ->first();

            if (!$doctorClinic) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor not found in clinic.'
                ], 404);
            }

            // Soft delete the relationship
            $clinic->doctors()->updateExistingPivot($request->doctor_id, [
                'deleted_at' => now()
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Doctor removed from clinic successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove doctor from clinic.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Internal helper: returns array of conflicts or empty array if no conflicts.
     */
    private function checkDoctorScheduleConflicts($doctorId, $clinicId, $weeklySchedule)
    {
        // Normalize incoming schedule
        $incoming = is_array($weeklySchedule) ? $weeklySchedule : [];
        $days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

        // Fetch other clinics where this doctor works (exclude current clinic, exclude soft-deleted)
        $otherAssignments = ClinicDoctor::where('doctor_id', $doctorId)
            ->where('clinic_id', '!=', $clinicId)
            ->get();

        $conflicts = [];
        foreach ($otherAssignments as $assignment) {
            $existing = (array) ($assignment->weekly_schedule ?? []);
            foreach ($days as $day) {
                $a = $incoming[$day] ?? [];
                $b = $existing[$day] ?? [];

                // Both have working intervals on the same day
                if (!empty($a) && !empty($b) && isset($a['start_time'],$a['end_time'],$b['start_time'],$b['end_time'])) {
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

        return $conflicts;
    }

    /**
     * Check if two time intervals overlap. Times are in 'H:i' format.
     */
    private function timesOverlap($aStart, $aEnd, $bStart, $bEnd)
    {
        // Convert times to comparable format (strtotime returns seconds)
        $aStartTime = strtotime($aStart);
        $aEndTime = strtotime($aEnd);
        $bStartTime = strtotime($bStart);
        $bEndTime = strtotime($bEnd);
        
        return max($aStartTime, $bStartTime) < min($aEndTime, $bEndTime);
    }
}

