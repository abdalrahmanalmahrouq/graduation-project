<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;


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
            ->with('user:id,email,profile_image') // Load user data including profile image
            ->get(['doctors.id', 'doctors.user_id', 'doctors.full_name', 'doctors.specialization', 'doctors.phone_number']);

        // Add profile image URL to each doctor
        $clinicDoctors->each(function ($doctor) {
            if ($doctor->user && $doctor->user->profile_image) {
                $doctor->profile_image_url = $doctor->user->profile_image_url;
            } else {
                $doctor->profile_image_url = null;
            }
        });

        return response()->json([
            'success' => true,
            'doctors' => $clinicDoctors
        ]);
    }

    // Add a doctor to a clinic
    public function addDoctor(Request $request){

        $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
        ]);

        $user = auth()->user();
        $clinic = $user->clinic;

        // Check if doctor exists in clinic (including soft-deleted ones)
        $existingDoctorPivot = $clinic->doctors()
        ->wherePivot('doctor_id', $request->doctor_id)
        ->first();

        if($existingDoctorPivot) {
            // Doctor exists in clinic
            if($existingDoctorPivot->pivot->deleted_at) {
                // Doctor was soft deleted, restore them
                $clinic->doctors()->updateExistingPivot($request->doctor_id, [
                    'deleted_at' => null,
                    'updated_at' => now()
                ]);
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
            $clinic->doctors()->attach($request->doctor_id, [
                'weekly_schedule' => json_encode([
                    "monday" => null,
                    "tuesday" => null,
                    "wednesday" => null,
                    "thursday" => null,
                    "friday" => null,
                    "saturday" => null,
                    "sunday" => null
                ]),
                'created_at' => now(), 
                'updated_at' => now()
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Doctor added successfully.'
            ], 200);
        }
    }

    // Delete a doctor from a clinic
    public function deleteDoctor(Request $request){
        try{
            $request->validate([
                'doctor_id' => 'required|exists:doctors,user_id',
            ]);

            $user=auth()->user();
            $clinic=$user->clinic;

            $doctorClinic=$clinic->doctors()
            ->wherepivot('doctor_id', $request->doctor_id)
            ->first();

            if(!$doctorClinic){
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
        } catch (\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove doctor from clinic.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

