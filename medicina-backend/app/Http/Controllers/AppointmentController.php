<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailableAppointment;
use App\Models\Patient;
use App\Models\ClinicDoctor;
use App\Models\Notifications;
use Illuminate\Http\Request;
use Carbon\Carbon;

use function PHPUnit\Framework\isEmpty;

class AppointmentController extends Controller
{
    // check if there's existing appointment at specific date for appointment_id
    // Excludes 'pending' appointments as they don't block the slot until confirmed
    public function existingAppointment($appointment_id, $appointment_date){
        $existingAppointment = Appointment::where('appointment_id', $appointment_id)
            ->where('appointment_date', $appointment_date)
            ->where('status', 'booked')
            ->exists();

        return $existingAppointment;
    }

    // check if patient has overlapping appointment at the same date and time
    // Excludes 'pending' appointments as they don't block the slot until confirmed
    public function hasPatientOverlappingAppointment($patient_id, $appointment_date, $new_starting_time, $new_ending_time, $exclude_appointment_id = null){
        // Get all booked appointments for this patient on the same date (excluding pending)
        $query = Appointment::where('patient_id', $patient_id)
            ->where('appointment_date', $appointment_date)
            ->where('status', 'booked')
            ->with('availableAppointment:id,starting_time,ending_time');

        // Exclude current appointment when rescheduling
        if ($exclude_appointment_id) {
            $query->where('id', '!=', $exclude_appointment_id);
        }

        $existingAppointments = $query->get();

        // Check for time overlaps
        foreach ($existingAppointments as $existingAppt) {
            $existingAvailable = $existingAppt->availableAppointment;
            if (!$existingAvailable) {
                continue;
            }

            $existingStart = $existingAvailable->starting_time;
            $existingEnd = $existingAvailable->ending_time;

            // Two appointments overlap if: new_start < existing_end AND new_end > existing_start
            if ($new_starting_time < $existingEnd && $new_ending_time > $existingStart) {
                return true;
            }
        }

        return false;
    }

    public function createAppointment(Request $request){
        $user = auth()->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($user->role === 'doctor') {
            return response()->json(['message' => 'Doctors are not allowed to book appointments'], 403);
        } elseif ($user->role === 'clinic') {
            if(!$request->has('appointment_id') || !$request->appointment_id) {
                return response()->json(['message' => 'Appointment ID is required'], 400);
            }
            $available_appointment = AvailableAppointment::find($request->appointment_id);
            if(!$available_appointment) {
                return response()->json(['message' => 'Appointment not found'], 404);
            }
            $requestedClinic = $available_appointment?->clinicDoctor()->first()?->clinic;
            if ($requestedClinic && $requestedClinic->user_id !== $user->id) {
                return response()->json(['message' => 'Clinics can only book appointments for their own available slots'], 403);
            }

            
        }
        $validated = $request->validate([
            'appointment_id' => 'required|exists:available_appointments,id',
            'patient_id' => 'required|exists:patients,user_id',
            'appointment_date' => 'required|date|date_format:Y-m-d|after_or_equal:today',
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

        // Check for duplicate appointments (doctor conflict)
        if ($this->existingAppointment($validated['appointment_id'], $validated['appointment_date'])) {
            return response()->json([
                'message' => 'Appointment time conflict detected',
                'error' => 'Doctor already has an appointment at this time slot',
                'conflicting_appointment' => $appointmentInfo
            ], 409);
        }

        // Check for patient overlapping appointments
        $newStartingTime = $available->starting_time;
        $newEndingTime = $available->ending_time;
        
        if ($this->hasPatientOverlappingAppointment(
            $validated['patient_id'],
            $validated['appointment_date'],
            $newStartingTime,
            $newEndingTime
        )) {
            return response()->json([
                'message' => 'لديك تعارض في الموعد المختار',
                'error' => 'لا يمكن للمريض أن يكون لديه تعارض في الموعد المختار',
                'conflicting_appointment' => $appointmentInfo
            ], 409);
        }

        // Get patient name (patients table stores full_name)
        $patient = Patient::where('user_id', $validated['patient_id'])->first();
        $patient_name = $patient?->full_name ?? null;

        // Determine status: 'pending' if clinic creates it, 'booked' if patient creates it
        $appointmentStatus = ($user->role === 'clinic') ? 'pending' : 'booked';

        // Create appointment record
        $appointment = Appointment::create([
            'appointment_id' => $validated['appointment_id'],
            'patient_id' => $validated['patient_id'],
            'appointment_date' => $validated['appointment_date'],
            'status' => $appointmentStatus,
        ]);

        // Note: No notification is created here. The appointment will appear in 
        // appointmentNotifications (pending) and move to appointmentNotificationsDone 
        // (booked/rejected) when patient responds, similar to lab results.

        return response()->json([
            'message' => $appointmentStatus === 'pending' 
                ? 'Appointment created successfully and waiting for patient confirmation'
                : 'Appointment created successfully',
            'appointment' => array_merge($appointmentInfo, ['status' => $appointmentStatus, 'patient' => $patient_name]),
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
            'appointment_date' => 'sometimes|date|date_format:Y-m-d|after_or_equal:today',
            'appointment_id' => 'sometimes|exists:available_appointments,id',
        ]);
        $validated['appointment_id'] = $validated['appointment_id'] ?? Appointment::find($validated['id'])->appointment_id;
        $validated['appointment_date'] = $validated['appointment_date'] ?? Appointment::find($validated['id'])->appointment_date;
        
        // Load the appointment to get patient_id
        $appointment = Appointment::findOrFail($validated['id']);
        if ($appointment->status !== 'booked') {
            return response()->json(['message' => 'Only booked appointments can be rescheduled'], 400);
        }

        // Load the available appointment to get time information
        $available = AvailableAppointment::findOrFail($validated['appointment_id']);

        // Check for duplicate appointments (doctor conflict, excluding current appointment)
        if ($this->existingAppointment($validated['appointment_id'], $validated['appointment_date'])) {
            return response()->json(['message' => 'The selected appointment time is already booked'], 400);
        }

        // Check for patient overlapping appointments (excluding current appointment)
        $newStartingTime = $available->starting_time;
        $newEndingTime = $available->ending_time;
        
        if ($this->hasPatientOverlappingAppointment(
            $appointment->patient_id,
            $validated['appointment_date'],
            $newStartingTime,
            $newEndingTime,
            $validated['id'] // Exclude current appointment
        )) {
            return response()->json([
                'message' => 'لديك تعارض في الموعد المختار',
                'error' => 'لا يمكن للمريض أن يكون لديه موعدان في نفس الوقت'
            ], 409);
        }

        // convert appointment_date to day of the week format
        $dayOfWeek = date('l', strtotime($validated['appointment_date']));
        if (AvailableAppointment::where('id', $validated['appointment_id'])->value('day') !== strtolower($dayOfWeek)) {
            return response()->json(['message' => 'The selected appointment is not available on the chosen date'], 400);
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
       return $this->getAppointmentsByStatus($request, 'no-show');
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

        $validAppointments = AvailableAppointment::idsFor($clinicDoctorIds, $startingTime, $endingTime, $tolerance);

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

        // 3. Get AvailableAppointment IDs (include soft-deleted slots so historical bookings are not lost)
        $available_appointments_ids = AvailableAppointment::withTrashed()
            ->whereIn('clinic_doctor_id', $clinic_doctor_ids)
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
            'patient.user:id,profile_image',
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
                'day' => $available?->day,
                'status' => $appt->status,
                'starting_time' => $available?->starting_time, // Shortcut
                'ending_time' => $available?->ending_time,     // Shortcut
                'patient' => [
                    'full_name' => $appt->patient->full_name ?? null,
                    'user_id' => $appt->patient->user_id ?? null,
                    'profile_image_url' => $appt->patient->user->profile_image_url ?? null,
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

    // get patient appointments with optional status filter
    public function getPatientAppointments(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'sometimes|exists:patients,user_id',
            'status' => 'sometimes|string|in:booked,completed,cancelled,no_show,pending,all',
            'starting_date' => 'sometimes|date|date_format:Y-m-d',
            'ending_date' => 'sometimes|date|date_format:Y-m-d',
        ]);

        // Get patient_id from request or authenticated user
        $patientId = $validated['patient_id'] ?? auth()->id();
        
        if (!$patientId) {
            return response()->json(['message' => 'Patient ID is required'], 400);
        }

        // Build query
        $query = Appointment::where('patient_id', $patientId);

        // Filter by status
        $status = $validated['status'] ?? 'all';
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by date range
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

        // Eager load relationships
        $appointments = $query->with([
            'availableAppointment:id,clinic_doctor_id,starting_time,ending_time',
            'availableAppointment.clinicDoctor.doctor:id,user_id,full_name',
            'availableAppointment.clinicDoctor.doctor.user:id,profile_image',
            'availableAppointment.clinicDoctor.clinic:user_id,clinic_name,address',
        ])
        ->orderBy('appointment_date', 'desc')
        ->get();

        // Format response
        $formatted = $appointments->map(function ($appt) {
            $available = $appt->availableAppointment;
            $clinicDoctor = $available?->clinicDoctor;
            
            return [
                'id' => $appt->id,
                'appointment_date' => $appt->appointment_date,
                'status' => $appt->status,
                'appointment_id' => $appt->appointment_id, // Available appointment slot ID
                'starting_time' => $available?->starting_time,
                'ending_time' => $available?->ending_time,
                'doctor' => [
                    'id' => $clinicDoctor?->doctor?->id ?? null,
                    'full_name' => $clinicDoctor?->doctor?->full_name ?? null,
                    'user_id' => $clinicDoctor?->doctor?->user_id ?? null,
                    'profile_image_url' => $clinicDoctor?->doctor?->user?->profile_image_url ?? null,
                ],
                'clinic' => [
                    'clinic_name' => $clinicDoctor?->clinic?->clinic_name ?? null,
                    'user_id' => $clinicDoctor?->clinic?->user_id ?? null,
                    'address' => $clinicDoctor?->clinic?->address ?? null,
                ]
            ];
        });

        return response()->json(['appointments' => $formatted], 200);
    }

     // mark a booked appointment as completed 
     // ok there is another function that is called "passedAppointment" that is used to mark a booked appointment as completed or no_show 
     // but this function will help up to test the api and the frontend for not now appointment because the passedAppointment depends on the starting time and the appointment date
     // so we will use this function to mark a booked appointment as completed for now
    public function finishBookedAppointment(Request $request, $appointment_id){
        $appointment = Appointment::findOrFail($appointment_id);
        if ($appointment->status !== 'booked') {
            return response()->json([
                'message' => 'Only booked appointments can be completed'
            ], 422);
        }
        $status = $request->input('status', 'completed');
        if(!in_array($status, ['completed', 'no-show'])) {
            return response()->json([
                'message' => 'Invalid status'
            ], 422);
        }
        $appointment->status = $status;
        $appointment->save();
        return response()->json(['message' => 'Appointment marked as ' . $status . ' successfully', 'appointment' => $appointment], 200);
    }

    // Patient accepts or rejects a pending appointment request
    public function respondToAppointmentRequest(Request $request, $appointment_id){
        $user = auth()->user();
        if (!$user || $user->role !== 'patient') {
            return response()->json(['message' => 'Unauthorized. Only patients can respond to appointment requests'], 403);
        }

        $validated = $request->validate([
            'decision' => 'required|in:accept,reject',
        ]);

        $appointment = Appointment::findOrFail($appointment_id);

        // Verify the appointment belongs to the authenticated patient
        if ($appointment->patient_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. This appointment does not belong to you'], 403);
        }

        // Verify the appointment is in pending status
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'This appointment is not pending. Only pending appointments can be accepted or rejected'
            ], 422);
        }

        if ($validated['decision'] === 'accept') {
            // Check for conflicts before accepting (doctor conflict)
            if ($this->existingAppointment($appointment->appointment_id, $appointment->appointment_date)) {
                // If there's a conflict now, mark as rejected and return error
                $appointment->status = 'rejected';
                $appointment->rejected_at = now();
                $appointment->save();
                return response()->json([
                    'message' => 'Appointment slot is no longer available. The appointment has been rejected.',
                    'error' => 'Another appointment was booked for this time slot'
                ], 409);
            }

            // Check for patient overlapping appointments
            $available = $appointment->availableAppointment;
            if ($available && $this->hasPatientOverlappingAppointment(
                $appointment->patient_id,
                $appointment->appointment_date,
                $available->starting_time,
                $available->ending_time,
                $appointment->id
            )) {
                $appointment->status = 'rejected';
                $appointment->rejected_at = now();
                $appointment->save();
                return response()->json([
                    'message' => 'You have a conflicting appointment. This appointment has been rejected.',
                    'error' => 'Patient has overlapping appointment'
                ], 409);
            }

            // Accept: Change status to 'booked' and set approved_at timestamp
            $appointment->status = 'booked';
            $appointment->approved_at = now();
            $appointment->save();

            return response()->json([
                'message' => 'Appointment accepted successfully',
                'appointment' => $appointment
            ], 200);
        } else {
            // Reject: Change status to 'rejected' and set rejected_at timestamp
            $appointment->status = 'rejected';
            $appointment->rejected_at = now();
            $appointment->save();

            return response()->json([
                'message' => 'Appointment request rejected successfully',
                'appointment' => $appointment
            ], 200);
        }
    }
}