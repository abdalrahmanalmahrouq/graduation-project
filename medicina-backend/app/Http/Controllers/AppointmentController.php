<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailableAppointment;
use App\Models\Patient;
use App\Models\ClinicDoctor;
use Illuminate\Http\Request;
use Carbon\Carbon;

use function PHPUnit\Framework\isEmpty;

class AppointmentController extends Controller
{
    // check if there's existing appointment at specific date for appointment_id
    public function existingAppointment($appointment_id, $appointment_date){
        $existingAppointment = Appointment::where('appointment_id', $appointment_id)
            ->where('appointment_date', $appointment_date)
            ->where('status', 'booked')
            ->exists();

        return $existingAppointment;
    }

    public function createAppointment(Request $request){
        $validated = $request->validate([
            'appointment_id' => 'required|exists:available_appointments,id',
            'patient_id' => 'required|exists:patients,user_id',
            'appointment_date' => 'required|date|date_format:Y-m-d|after_or_equal:today()',
        ]);

        // convert appointment_date to day of the week format
        $dayOfWeek = date('l', strtotime($validated['appointment_date']));
        if (AvailableAppointment::where('id', $validated['appointment_id'])->value('day') !== strtolower($dayOfWeek)) {
            return response()->json(['message' => 'The selected appointment is not available on the chosen date'], 400);
        }

        // Load the available appointment and related clinic/doctor
        $available = AvailableAppointment::with('clinicDoctor.doctor', 'clinicDoctor.clinic')
            ->findOrFail($validated['appointment_id']);

        $doctor = optional($available->clinicDoctor)->doctor;
        $clinic = optional($available->clinicDoctor)->clinic;

        $appointmentInfo = [
            'doctor_name' => $doctor?->full_name ?? null,
            'clinic_name' => $clinic?->clinic_name ?? null,
            'appointment_date' => $validated['appointment_date'],
            'starting_time' => $available->starting_time,
        ];

        // Check for duplicate appointments
        if ($this->existingAppointment($validated['appointment_id'], $validated['appointment_date'])) {
            return response()->json([
                'message' => 'Appointment time conflict detected',
                'error' => 'Doctor already has an appointment at this time slot',
                'conflicting_appointment' => $appointmentInfo
            ], 409);
        }

        // Get patient name (patients table stores full_name)
        $patient = Patient::where('user_id', $validated['patient_id'])->first();
        $patient_name = $patient?->full_name ?? null;

        // Create appointment record
        $appointment = Appointment::create([
            'appointment_id' => $validated['appointment_id'],
            'patient_id' => $validated['patient_id'],
            'appointment_date' => $validated['appointment_date'],
            'status' => 'booked',
        ]);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => array_merge($appointmentInfo, ['status' => 'booked', 'patient' => $patient_name]),
            'id' => $appointment->id
        ], 201);
    }

    // cancel appointment (should send the appointment id to validate)
    public function cancelAppointment(Request $request){
        $validated = $request->validate([
            'id' => 'required|exists:appointments,id',
            // 'appointment_date' => 'required|date|after_or_equal:today()',
            // 'starting_time' => 'required|after_or_equal:now()',
        ]);
        $appointment = Appointment::findOrFail($validated['id']);
        $currentTime = Carbon::now()->addHours(3)->format('H:i:s');
        $appointment_date = $appointment->appointment_date;
        $starting_time = $appointment->starting_time;

        if ($appointment->status !== 'booked') {
            return response()->json(['message' => 'Only booked appointments can be cancelled'], 400);
        }
        // Check if the appointment is in the past
        if ($appointment_date < date('Y-m-d') OR ($appointment_date === date('Y-m-d') AND $starting_time < $currentTime)) {
            return response()->json(['message' => 'Cannot cancel past appointments'], 400);
        }

        $appointment->status = 'cancelled';
        $appointment->save();
        return response()->json(['message' => 'Appointment cancelled successfully'], 200);
    }

    // complete or no_show appointment (should send the appointment id, date, starting time, status to validate)
    public function passedAppointment(Request $request){
        $validated = $request->validate([
            'id' => 'required|exists:appointments,id',
            'status' => 'required|in:completed,no_show',
        ]);
        $appointment = Appointment::findOrFail($validated['id']);
        $starting_time = $appointment->availableAppointment?->starting_time;
        $appointment_date = $appointment->appointment_date;
        $currentTime = Carbon::now()->addHours(3)->format('H:i:s');
        if ($appointment->status !== 'booked') {
            return response()->json(['message' => 'Only booked appointments can be marked as completed or no_show'], 400);
        }
        if ($appointment_date > date('Y-m-d') OR ($appointment_date === date('Y-m-d') AND $starting_time > $currentTime)) {
            return response()->json(['message' => 'Cannot mark future appointments as completed or no_show'], 400);
        }
        $appointment->status = $validated['status'];
        $appointment->save();
        return response()->json(['message' => 'Appointment status changed to ' . $validated['status'] . ' successfully'], 200);
    }


    // reschedule appointment
    public function rescheduleAppointment(Request $request){
        $validated = $request->validate([
            'id' => 'required|exists:appointments,id',
            'appointment_date' => 'sometimes|date|date_format:Y-m-d|after_or_equal:today()',
            'appointment_id' => 'sometimes|exists:available_appointments,id',
        ]);
        $validated['appointment_id'] = $validated['appointment_id'] ?? Appointment::find($validated['id'])->appointment_id;
        $validated['appointment_date'] = $validated['appointment_date'] ?? Appointment::find($validated['id'])->appointment_date;
        // Check for duplicate appointments (excluding current appointment)
        if ($this->existingAppointment($validated['appointment_id'], $validated['appointment_date'])) {
            return response()->json(['message' => 'The selected appointment time is already booked'], 400);
        }
        // convert appointment_date to day of the week format
        $dayOfWeek = date('l', strtotime($validated['appointment_date']));
        if (AvailableAppointment::where('id', $validated['appointment_id'])->value('day') !== strtolower($dayOfWeek)) {
            return response()->json(['message' => 'The selected appointment is not available on the chosen date'], 400);
        }
        $appointment = Appointment::findOrFail($validated['id']);
        if ($appointment->status !== 'booked') {
            return response()->json(['message' => 'Only booked appointments can be rescheduled'], 400);
        }
        $appointment->appointment_date = $validated['appointment_date'];
        $appointment->appointment_id = $validated['appointment_id'];
        $appointment->save();
        return response()->json(['message' => 'Appointment rescheduled successfully'], 200);
    }

    // get booked appointment
    public function getBookedAppointment(Request $request) {
        return $this->getAppointmentsByStatus($request, 'booked');
    }
    
    // delete booked appointment
    public function deleteBookedAppointment($appointment_id){
        $appointment = Appointment::findOrFail($appointment_id);
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully'], 200);
    }

    // get completed doctor appointment interval in specific(one) clinic appointments
    public function getCompletedAppointment(Request $request)
    {
        return $this->getAppointmentsByStatus($request, 'completed');
    }

    // get cancelled doctor appointment interval in specific(one) clinic appointments
    public function getCancelledAppointment(Request $request)
    {
       return $this->getAppointmentsByStatus($request, 'cancelled');
    }

    public function getNoShowAppointment(Request $request)
    {
       return $this->getAppointmentsByStatus($request, 'no_show');
    }


    // get available appointments (templates/slots) for a doctor in a specific clinic
    public function getAvailableAppointment(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|exists:doctors,user_id',
            'clinic_id' => 'sometimes|exists:clinics,user_id',
            'starting_time' => 'sometimes|date_format:H:i:s',
            'ending_time' => 'sometimes|date_format:H:i:s',
            'tolerance' => 'sometimes|integer|min:0',
            'from_date' => 'sometimes|date_format:Y-m-d',
            'to_date' => 'sometimes|date_format:Y-m-d',
        ]);

        if (!isset($validated['doctor_id']) && !isset($validated['clinic_id'])) {
            return response()->json(['message' => 'At least doctor_id or clinic_id must be provided'], 400);
        }

        $clinicDoctorIds = ClinicDoctor::idsFor( $validated['doctor_id'] ?? null, $validated['clinic_id'] ?? null);
        $startingTime = $validated['starting_time'] ?? null;
        $endingTime = $validated['ending_time'] ?? null;
        $tolerance = $validated['tolerance'] ?? 15;
        $fromDate = $validated['from_date'] ?? null;
        $toDate = $validated['to_date'] ?? null;

        if (empty($clinicDoctorIds)) {
            return response()->json(['message' => 'The specified doctor and clinic combination does not exist'], 400);
        }
        // return $clinicDoctorIds;

        $validAppointments = AvailableAppointment::idsFor($startingTime, $endingTime, $tolerance, $clinicDoctorIds);

        // return [$validAppointments, 'clinicDoctorIds' => $clinicDoctorIds];

        if (empty($validAppointments)) {
            return response()->json(['message' => 'No available appointments found'], 200);
        }

        // If a date interval is provided, return per-day available occurrences
        if (!empty($fromDate) || !empty($toDate)) {
            $startDate = $fromDate ?? $toDate;
            $endDate = $toDate ?? $fromDate;
            if ($startDate && $endDate && $startDate > $endDate) {
                [$startDate, $endDate] = [$endDate, $startDate];
            }

            // build list of dates in interval (inclusive)
            $period = [];
            $current = strtotime($startDate);
            $end = strtotime($endDate);
            while ($current <= $end) {
                $period[] = date('Y-m-d', $current);
                $current = strtotime('+1 day', $current);
            }

            // load templates once
            $templates = AvailableAppointment::whereIn('id', $validAppointments)
            ->orderBy('starting_time', 'asc') // <--- Add this sorting
            ->get()
            ->keyBy('id'); // now the results are ordered by starting_time

            $results = [];
            foreach ($period as $date) {
                $dayKey = strtolower(date('l', strtotime($date)));
                foreach ($templates as $template) {
                    // appointment template only applies to matching weekdays
                    if ($template->day && strtolower($template->day) !== $dayKey) {
                        continue;
                    }

                    // check if there exists a booked or completed appointment for this template on that date
                    $blocked = Appointment::where('appointment_id', $template->id)
                        ->where('appointment_date', $date)
                        ->whereIn('status', ['booked', 'completed'])
                        ->exists();

                    if (! $blocked) {
                        $results[] = [
                            'appointment_id' => $template->id,
                            'appointment_date' => $date,
                            'starting_time' => $template->starting_time,
                            'ending_time' => $template->ending_time ?? $template->getEndingTimeAttribute(),
                        ];
                    }
                }
            }

            return response()->json(['available' => $results], 200);
        }

        // No date interval provided — return unique template ids excluding any booked occurrences (existing behavior)
        $query = Appointment::whereIn('appointment_id', $validAppointments)->where('status', 'booked');
        $bookedIds = $query->pluck('appointment_id')->unique()->toArray();
        $ids = !empty($bookedIds) ? array_values(array_diff($validAppointments, $bookedIds)) : $validAppointments;

        return response()->json(['available' => $ids], 200);
    }

    /**
     * Helper to fetch appointments filtered by doctor, clinic and optional status.
     * Centralizes query logic and eager-loads patient relation.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function fetchAppointmentsByStatus($doctor_id, $clinic_id, $status = null)
    {
        $query = Appointment::where('doctor_id', $doctor_id)
            ->where('clinic_id', $clinic_id)
            ->with(['patient']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    public function getAppointmentsByStatus(Request $request, $status = null)
    {
        // 1. Validate inputs (Same as your Booked logic)
        $validated = $request->validate([
            'doctor_id' => 'sometimes|exists:doctors,user_id',
            'clinic_id' => 'sometimes|exists:clinics,user_id',
            'starting_date' => 'sometimes|date|date_format:Y-m-d',
            'ending_date' => 'sometimes|date|date_format:Y-m-d',
            'status' => 'sometimes|string',
        ]);

        $targetStatus = $status ?? $request->status ?? 'all';

        $doctor_id = $validated['doctor_id'] ?? null;
        $clinic_id = $validated['clinic_id'] ?? null;

        // 2. Resolve ClinicDoctor Pivot IDs (Reuse your complex logic)
        $clinic_doctor_ids = [];

        if ($doctor_id && $clinic_id) {
            $clinic_doctor_ids = ClinicDoctor::where('doctor_id', $doctor_id)
                ->where('clinic_id', $clinic_id)
                ->pluck('id')->toArray();
        } else if ($doctor_id) {
            $clinic_doctor_ids = ClinicDoctor::where('doctor_id', $doctor_id)
                ->pluck('id')->toArray();
        } else if ($clinic_id) {
            $clinic_doctor_ids = ClinicDoctor::where('clinic_id', $clinic_id)
                ->pluck('id')->toArray();
        } else {
            return response()->json(['message' => 'At least doctor_id or clinic_id must be provided'], 400);
        }

        if (empty($clinic_doctor_ids)) {
            return response()->json(['appointments' => []], 200);
        }

        // 3. Get AvailableAppointment IDs
        $available_appointments_ids = AvailableAppointment::whereIn('clinic_doctor_id', $clinic_doctor_ids)
            ->pluck('id')
            ->toArray();

        // 4. Build Query using the Status passed to the function
        $query = Appointment::whereIn('appointment_id', $available_appointments_ids);
         
        if ($targetStatus !== 'all') {
        $query->where('status', $targetStatus);
        }

        // 5. Apply Date Filters (Reuse your logic)
        if (!empty($validated['starting_date']) || !empty($validated['ending_date'])) {
            $startDate = $validated['starting_date'] ?? null;
            $endDate = $validated['ending_date'] ?? null;

            if ($startDate && $endDate) {
                if ($startDate > $endDate) [$startDate, $endDate] = [$endDate, $startDate];
                $query->whereBetween('appointment_date', [$startDate, $endDate]);
            } elseif ($startDate) {
                $query->where('appointment_date', '>=', $startDate);
            } else {
                $query->where('appointment_date', '<=', $endDate);
            }
        }

        // 6. Eager Load & Get
        $appointments = $query->with([
            'patient:user_id,full_name',
            'availableAppointment.clinicDoctor.doctor:user_id,full_name',
            'availableAppointment.clinicDoctor.clinic:user_id,clinic_name',
        ])->get();

        // 7. Format Response (Reuse your clean mapping)
        $formatted = $appointments->map(function ($appt) {
            $available = $appt->availableAppointment;
            $clinicDoctor = $available?->clinicDoctor;
            
            return [
                'id' => $appt->id,
                'appointment_date' => $appt->appointment_date,
                'status' => $appt->status,
                'starting_time' => $available?->starting_time, // Shortcut
                'ending_time' => $available?->ending_time,     // Shortcut
                'patient' => [
                    'full_name' => $appt->patient->full_name ?? null,
                    'user_id' => $appt->patient->user_id ?? null,
                ],
                'doctor' => [
                    'full_name' => $clinicDoctor?->doctor?->full_name ?? null,
                    'user_id' => $clinicDoctor?->doctor?->user_id ?? null,
                ],
                'clinic' => [
                    'clinic_name' => $clinicDoctor?->clinic?->clinic_name ?? null,
                    'user_id' => $clinicDoctor?->clinic?->user_id ?? null,
                ]
            ];
        });

        return response()->json(['appointments' => $formatted], 200);
    }

    // get all clinic appointments for all doctors in specific(one) clinic with optional status filter
    public function getAllClinicAppointments(Request $request, $clinic_id){
        $query = Appointment::where('clinic_id', $clinic_id)
            ->with(['patient:user_id,full_name', 'doctor:user_id,full_name','clinic:user_id,clinic_name']);
        
        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filter by doctor if provided
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }
        
        // Filter by date range if provided
        if ($request->has('date_from')) {
            $query->where('appointment_date', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->where('appointment_date', '<=', $request->date_to);
        }
        
        // Order by date and time
        $appointments = $query->orderBy('appointment_date', 'asc')
            ->orderBy('starting_time', 'asc')
            ->get();
            
        return response()->json(['appointments' => $appointments], 200);
    }
}
