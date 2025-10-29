<?php

namespace App\Http\Controllers;
use App\Models\Doctor;
use App\Models\Clinic;
use Illuminate\Http\Request;


class DoctorController extends Controller
{
    // Get all doctors by specialization for the frontend directory page
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

    // Get doctor profile for the frontend profile page so the patient can see the doctor's profile and clinics associated with the doctor
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

        // Get clinic IDs where the doctor works
        $clinicIds = $doctor->clinics->pluck('user_id');

        // Get clinics with their insurance information
        $clinics = Clinic::whereIn('user_id', $clinicIds)
            ->with(['insurances:insurance_id,name'])
            ->get(['id', 'clinic_name', 'address', 'user_id']);

        // Transform the data to include profile image URL, clinic names, and insurances
        $doctorData = [
            'id' => $doctor->user_id,
            'name' => $doctor->full_name,
            'specialization' => $doctor->specialization,
            'bio' => $doctor->bio,
            'profile_image_url' => $doctor->user->profile_image_url ?? null,
            'clinics' => $clinics->map(function ($clinic) {
                return [
                    'id' => $clinic->user_id,
                    'name' => $clinic->clinic_name,
                    'address' => $clinic->address,
                    'insurances' => $clinic->insurances->map(function ($insurance) {
                        return [
                            'id' => $insurance->insurance_id,
                            'name' => $insurance->name
                        ];
                    })
                ];
            })
        ];

        return response()->json([
            'success' => true,
            'doctor' => $doctorData
        ]);
    }

    public function getClinics(Request $request){
        $user=auth()->user();
        $doctor=$user->doctor;
        if(!$doctor){
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only doctor users can access this resource.'
            ], 403);
        }
        $clinics=$doctor->clinics()
        ->wherePivot('deleted_at', null)
        ->with('user:id,email,profile_image')
        ->get(['clinics.user_id', 'clinics.clinic_name', 'clinics.address', 'clinics.phone_number']);

        $clinics->each(function ($clinic) {
            if ($clinic->user && $clinic->user->profile_image) {
                $clinic->profile_image_url = $clinic->user->profile_image_url;
            } else {
                $clinic->profile_image_url = null;
            }
        });
        return response()->json([
            'success' => true,
            'clinics' => $clinics
        ], 200);
    }
    // Add bio for authenticated doctor
    public function addBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio added successfully.'], 200);
    }

    // Get bio for authenticated doctor
    public function getBio(Request $request){
        $doctor=auth()->user()->doctor;
        return response()->json(['bio' => $doctor->bio], 200);
    }

    // Update bio for authenticated doctor
    public function updateBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio updated successfully.'], 200);
    }
}

