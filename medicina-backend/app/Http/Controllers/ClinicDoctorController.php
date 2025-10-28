<?php

namespace App\Http\Controllers;
use App\Models\Doctor;
use App\Models\Clinic;
use Illuminate\Http\Request;


class ClinicDoctorController extends Controller

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


     // Get all doctors who are associated with the clinic
     public function getClinicDoctors(Request $request)
     {
         $user = auth()->user();
         $clinic = $user->clinic;
         
         // Check if user has a clinic (i.e., is a clinic user)
         if(!$clinic){    
             return response()->json([
                 'success' => false,
                 'message' => 'Access denied. Only clinic users can access this resource.'
             ], 403); // Changed from 404 to 403 (Forbidden)
         }
         
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

        // Check if user has a clinic (i.e., is a clinic user)
        if(!$clinic){    
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only clinic users can access this resource.'
            ], 403);
        }

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
    public function deleteDoctorFromClinic(Request $request){
        try{
            $request->validate([
                'doctor_id' => 'required|exists:doctors,user_id',
            ]);

            $user=auth()->user();
            $clinic=$user->clinic;

            if(!$clinic){
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Only clinic users can access this resource.'
                ], 403);
            }

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
