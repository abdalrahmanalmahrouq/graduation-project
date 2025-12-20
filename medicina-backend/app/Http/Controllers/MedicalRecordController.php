<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\LabResult;
use App\Models\MedicalRecord;
use App\Models\Notifications;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
   public function create($appointment_id){

    $appointment = Appointment::with('patient')->findOrFail($appointment_id);

    $labResults = LabResult::where('appointment_id',$appointment_id)
    ->where('patient_id',$appointment->patient_id)
    ->where('status','approved')
    ->get();

    return response()->json([
        'appointment' => $appointment,
        'appointment.availableAppointment:starting_time,ending_time' => $appointment->availableAppointment,
        'lab_results' => $labResults,
    ], 200);
   }

   public function store(Request $request, $appointment_id)
   {

    $request->validate([
        'consultation' => 'required|string',
        'prescription' => 'nullable|string',
        'lab_result_ids' => 'nullable|array',
        'lab_result_ids.*' => 'exists:lab_results,id',
    ]);

    $user = $request->user();

    $appointment = Appointment::with('availableAppointment.clinicDoctor')
        ->findOrFail($appointment_id);

    $realDoctorId = $appointment->availableAppointment?->clinicDoctor?->doctor_id;

    if ($realDoctorId !== $user->id) {
        return response()->json([
            'success' => false,
            'message' => 'You are not authorized to create a medical record for this appointment.',
        ], 403);
    }

    
    $existingRecord = MedicalRecord::where('appointment_id',$appointment_id)->first();
    if ($existingRecord){
        return response()->json([
            'success' => false,
            'message' => 'Medical record already exists for this appointment.',
        ], 400);
    }   

    $record = MedicalRecord::create([
        'appointment_id' => $appointment_id,
        'doctor_id' => $request->user()->id,
        'patient_id' => $appointment->patient_id,
        'consultation' => $request->consultation,
        'prescription' => $request->prescription,
    ]);

    if($request->has('lab_result_ids') && is_array($request->lab_result_ids)){
        $validLabResults = LabResult::whereIn('id', $request->lab_result_ids)
        ->where('patient_id', $appointment->patient_id)
        ->where('status', 'approved')
        ->pluck('id')
        ->toArray();
    
        $record->labResults()->attach($validLabResults);

    }
        

    $notification = Notifications::create([
        'user_id' => $appointment->patient_id,
        'title' => 'تم إنشاء سجل طبي لموعدك',
        'message' => "{$request->user()->doctor->full_name} تم إنشاء سجل طبي لموعدك بنجاح من قبل الطبيب",
        'type' => 'medical_record_uploaded',
        'data' => [
            'medical_record_id' => $record->id,
            'doctor_name' => $request->user()->full_name,
        ],
        'is_read' => false,
    ]);

    // Reload the record with relationships
    $record->load('labResults');

    return response()->json([
        'success' => true,
        'message' => 'Medical record created successfully.',
        'data' => $record,
        'notification' => $notification,
    ], 201);
   }

   // For completed appointments
   public function index(Request $request)
   {
       $doctor = $request->user();

       $records = MedicalRecord::with(['appointment', 'labResults'])
           ->where('doctor_id', $doctor->id)
           ->latest()
           ->paginate(10);

       return response()->json(['data' => $records]);
   }

   public function show($record_id)
   {
    $record = MedicalRecord::with(['appointment', 'labResults'])
    ->findOrFail($record_id);

    return response()->json(['data' => $record], 200);
   }
}