<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class ClinicDoctorController extends Controller
{
    public function addDoctor(Request $request){

        $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
        ]);

        $clinic=auth()->user()->clinic;

        // Prevent duplicates
    if ($clinic->doctors()->where('user_id', $request->doctor_id)->exists()) {
        return response()->json(['message' => 'Doctor already added.'], 409);
    }

    $clinic->doctors()->attach($request->doctor_id);

    return response()->json(['message' => 'Doctor added successfully.'], 200);
    }

    public function getAvailableDoctors(Request $request)
    {
        $clinic = auth()->user()->clinic;
        
        // Get all doctors except those already added to this clinic
        $addedDoctorIds = $clinic->doctors()->pluck('user_id')->toArray();
        
        $availableDoctors = Doctor::whereNotIn('user_id', $addedDoctorIds)
            ->with('user:id,email,profile_image') // Load user data including profile image
            ->get(['id', 'user_id', 'full_name', 'specialization', 'phone_number']);

        // Add profile image URL to each doctor
        $availableDoctors->each(function ($doctor) {
            if ($doctor->user && $doctor->user->profile_image) {
                $doctor->profile_image_url = $doctor->user->profile_image_url;
            } else {
                $doctor->profile_image_url = null;
            }
        });

        return response()->json([
            'doctors' => $availableDoctors
        ]);
    }

    public function getClinicDoctors(Request $request)
    {
        $clinic = auth()->user()->clinic;
        
        // Get all doctors added to this clinic
        $clinicDoctors = $clinic->doctors()
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
            'doctors' => $clinicDoctors
        ]);
    }
}
