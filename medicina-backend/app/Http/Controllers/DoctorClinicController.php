<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorClinicController extends Controller
{
    public function getDoctorsBySpecialization(Request $request, $specialization){
        // Map frontend clinic types to database specializations (English)
        $specializationMapping = [
            'Pediatrics' => 'Pediatrics',
            'Ophthalmology' => 'Ophthalmology', 
            'Dentistry' => 'Dentistry',
            'Gynecology' => 'Gynecology',
            'Cardiology' => 'Cardiology',
            'Dermatology' => 'Dermatology',
            'neurology' => 'Neurology',
            'orthopedic' => 'Orthopedics',
            'ENT' => 'ENT',
            'Gastroenterology' => 'Gastroenterology',
            'Pulmonology' => 'Pulmonology',
            'digestive' => 'Gastroenterology'
        ];

        // Get the database specialization from the mapping
        $dbSpecialization = $specializationMapping[$specialization] ?? $specialization;

        // Get doctors with their user data and associated clinics
        $doctors = Doctor::where('specialization', $dbSpecialization)
            ->with([
                'user:id,profile_image', // Get user profile image
                'clinics:id,clinic_name,address,user_id' // Get associated clinics with address
            ])
            ->get();

        // Transform the data to include profile image URL and clinic names
        $doctorsData = $doctors->map(function ($doctor) {
            return [
                'id' => $doctor->user_id,
                'name' => $doctor->full_name,
                'specialization' => $doctor->specialization,
                'profile_image_url' => $doctor->user->profile_image_url ?? null,
                'clinics' => $doctor->clinics->map(function ($clinic) {
                    return [
                        'id' => $clinic->user_id,
                        'name' => $clinic->clinic_name,
                        'address' => $clinic->address
                    ];
                })
            ];
        });

        return response()->json([
            'success' => true,
            'doctors' => $doctorsData,
        ]);
    }

    public function getDoctorProfile(Request $request, $id){
        // Get doctor with their user data and associated clinics
        $doctor = Doctor::where('user_id', $id)
            ->with([
                'user:id,profile_image', // Get user profile image
                'clinics:id,clinic_name,address,user_id' // Get associated clinics with address
            ])
            ->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        // Transform the data to include profile image URL and clinic names
        $doctorData = [
            'id' => $doctor->user_id,
            'name' => $doctor->full_name,
            'specialization' => $doctor->specialization,
            'bio' => $doctor->bio,
            'profile_image_url' => $doctor->user->profile_image_url ?? null,
            'clinics' => $doctor->clinics->map(function ($clinic) {
                return [
                    'id' => $clinic->user_id,
                    'name' => $clinic->clinic_name,
                    'address' => $clinic->address
                ];
            })
        ];

        return response()->json([
            'success' => true,
            'doctor' => $doctorData
        ]);
    }
}
