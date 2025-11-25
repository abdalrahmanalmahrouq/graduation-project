<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ClinicDoctor;
use App\Services\AvailableAppointmentService;


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
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
            'weekly_schedule' => 'required|array',
        ]);

        $clinic = auth()->user()->id;

        $assignedDoctor = ClinicDoctor::withTrashed()->where('clinic_id', $clinic)
        ->where('doctor_id', $request->doctor_id)
        ->first();

        if($assignedDoctor) {
            // Doctor exists in clinic
            if($assignedDoctor->deleted_at) {
                // Doctor was soft deleted, restore them
                $assignedDoctor->restore();
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
            $clinicDoctor = ClinicDoctor::create([
                'clinic_id' => $clinic,
                'doctor_id' => $validated['doctor_id'],
                'weekly_schedule' => $validated['weekly_schedule']
            ]);
            return response()->json(['message' => 'Doctor added to clinic successfully', 'data' => $clinicDoctor], 201);
        }

        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);

        return response()->json(['message' => 'Doctor added to clinic successfully', 'data' => $clinicDoctor], 201);
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

