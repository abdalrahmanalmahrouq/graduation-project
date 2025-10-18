<?php

namespace App\Http\Controllers;

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
}

