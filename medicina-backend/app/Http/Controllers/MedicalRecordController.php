<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\LabResult;
use App\Models\MedicalRecord;
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
        'lab_results' => $labResults,
    ], 200);
   }

   public function store(Request $request, $appointment_id)
   {

    $request->validate([
        'consultation' => 'required|string',
        'prescription' => 'nullable|string',
        'lab_result_id' => 'nullable|exists:lab_results,id',
    ]);

    $appointment = Appointment::findOrFail($appointment_id);

    $record = MedicalRecord::create([
        'appointment_id' => $appointment_id,
        'doctor_id' => $request->user()->id,
        'patient_id' => $appointment->patient_id,
        'lab_result_id' => $request->lab_result_id,
        'consultation' => $request->consultation,
        'prescription' => $request->prescription,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Medical record created successfully.',
        'data' => $record,
    ], 201);
   }

   // For completed appointments
   public function index(Request $request)
   {
       $doctor = $request->user();

       $records = MedicalRecord::with(['appointment', 'labResult'])
           ->where('doctor_id', $doctor->id)
           ->latest()
           ->paginate(10);

       return response()->json(['data' => $records]);
   }

   public function show($record_id)
   {
    $record = MedicalRecord::with(['appointment', 'labResult'])
    ->findOrFail($record_id);

    return response()->json(['data' => $record], 200);
   }
}
