<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
   

    public function createAppointment(Request $request){
       $validated = $request->validate([
            'patient_id' => 'nullable|exists:patients,user_id',
            'doctor_id' => 'required|exists:doctors,user_id',
            'clinic_id' => 'required|exists:clinics,user_id',
            'appointment_date' => 'required|date',
            'day' => 'nullable|string',
            'starting_time' => 'required',
            'ending_time' => 'required',
        ]);

        // Check for duplicate appointments
        $existingAppointment = Appointment::where('doctor_id', $validated['doctor_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->where(function($query) use ($validated) {
                $query->whereBetween('starting_time', [$validated['starting_time'], $validated['ending_time']])
                      ->orWhereBetween('ending_time', [$validated['starting_time'], $validated['ending_time']])
                      ->orWhere(function($q) use ($validated) {
                          $q->where('starting_time', '<=', $validated['starting_time'])
                            ->where('ending_time', '>=', $validated['ending_time']);
                      });
            })
            ->first();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'Appointment time conflict detected',
                'error' => 'Doctor already has an appointment at this time slot',
                'conflicting_appointment' => [
                    'id' => $existingAppointment->id,
                    'date' => $existingAppointment->appointment_date,
                    'time' => $existingAppointment->starting_time . ' - ' . $existingAppointment->ending_time,
                    'status' => $existingAppointment->status
                ]
            ], 409);
        }

        $validated['status'] = 'available';
        $appointment = Appointment::create($validated);
        return response()->json(['message' => 'Appointment created successfully', 'appointment' => $appointment], 201);
    }

    public function getAvailableDoctorClinicAppointments($doctor_id,$clinic_id){
        $appointments=Appointment::where('doctor_id', $doctor_id)
        ->where('clinic_id', $clinic_id)
        ->where('status', 'available')
        ->whereNull('patient_id') // Only show appointments that haven't been booked yet
        ->orderBy('appointment_date', 'asc')
        ->orderBy('starting_time', 'asc')
        ->get();
        return response()->json(['appointments' => $appointments], 200);
    }

    public function updateAppointment(Request $request, $appointment_id){
        $validated = $request->validate([
            'appointment_date' => 'required|date',
            'day' => 'nullable|string',
            'starting_time' => 'required',
            'ending_time' => 'required',
        ]);

        $appointment = Appointment::findOrFail($appointment_id);

        // Check for duplicate appointments (excluding current appointment)
        $existingAppointment = Appointment::where('doctor_id', $appointment->doctor_id)
            ->where('appointment_date', $validated['appointment_date'])
            ->where('id', '!=', $appointment_id)
            ->where(function($query) use ($validated) {
                $query->whereBetween('starting_time', [$validated['starting_time'], $validated['ending_time']])
                      ->orWhereBetween('ending_time', [$validated['starting_time'], $validated['ending_time']])
                      ->orWhere(function($q) use ($validated) {
                          $q->where('starting_time', '<=', $validated['starting_time'])
                            ->where('ending_time', '>=', $validated['ending_time']);
                      });
            })
            ->first();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'Appointment time conflict detected',
                'error' => 'Doctor already has an appointment at this time slot',
                'conflicting_appointment' => [
                    'id' => $existingAppointment->id,
                    'date' => $existingAppointment->appointment_date,
                    'time' => $existingAppointment->starting_time . ' - ' . $existingAppointment->ending_time,
                    'status' => $existingAppointment->status
                ]
            ], 409);
        }

        $appointment->update($validated);
        return response()->json(['message' => 'Appointment updated successfully', 'appointment' => $appointment], 200);
    }

    public function deleteAppointment($appointment_id){
        $appointment = Appointment::findOrFail($appointment_id);
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully'], 200);
    }

        
}
