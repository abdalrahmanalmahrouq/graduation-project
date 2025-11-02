<?php

namespace App\Http\Controllers;

use App\Models\LabResult;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    /**
     * Get patient data by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPatientByUserId($user_id)
    {
        try {
            $patient = Patient::with('user')->where('user_id', $user_id)->first();

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found'
                ], 404);
            }

            // Format the patient data
            $patientData = [
                'id' => $patient->id,
                'user_id' => $patient->user_id,
                'full_name' => $patient->full_name,
                'phone_number' => $patient->phone_number,
                'date_of_birth' => $patient->date_of_birth,
                'address' => $patient->address,
                'user' => $patient->user ? [
                    'id' => $patient->user->id,
                    'email' => $patient->user->email,
                    'profile_image_url' => $patient->user->profile_image_url,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'patient' => $patientData
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching patient data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching patient data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPatientLabResults(){
        try{
        $userId=auth()->id();
        $labResults=LabResult::where('patient_id',$userId)
        ->where('status','approved')
        ->with('lab:user_id,lab_name')
        ->orderBy('created_at','desc')
        ->get();
            return response()->json([
                'success' => true,
                'labResults' => $labResults
            ], 200);
        }catch(\Exception $e){
            Log::error('Error fetching patient lab results: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching patient lab results',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

