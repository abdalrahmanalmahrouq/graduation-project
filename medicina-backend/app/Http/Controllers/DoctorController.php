<?php

namespace App\Http\Controllers;

use App\Services\DoctorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Nette\Schema\Elements\Type;

use function PHPSTORM_META\type;

class DoctorController extends Controller
{
    protected $doctorService;

    public function __construct(DoctorService $doctorService)
    {
        $this->doctorService = $doctorService;
    }

    // Get all doctors by specialty for the frontend directory page
    public function getDoctors(Request $request)
    {
        $category = $request->query('category');
        $specialty = $request->query('specialty');

        $doctors = $this->doctorService->filterDoctors($category, $specialty);

        return response()->json([
            'success' => true,
            'doctors' => $doctors->map(function ($doctor) {
                return [
                    'id' => $doctor->user_id,
                    'name' => $doctor->full_name,
                    'profile_image_url' => $doctor->user->profile_image_url ?? null,
                ];
            })
        ], 200);
    }

    // Get doctor profile for the frontend profile page so the patient can see the doctor's profile and clinics associated with the doctor
    public function getDoctorProfile(string $doctorId)
    {
        $doctor = $this->doctorService->getDoctorProfile($doctorId);

        // Transform the data to include profile image URL, clinic names, and insurances
        $clinics = $doctor->clinics;
        $specialties = $doctor->specialties;

        $doctorData = [
            'id' => $doctor->user_id,
            'name' => $doctor->full_name,
            'specialty' => $specialties->pluck('name')->join(' • '),
            'specialties' => $specialties->map(function ($specialty) {
                return [
                    'id' => $specialty->id,
                    'name' => $specialty->name,
                    'slug' => $specialty->slug
                ];
            }),
            'phone_number' => $doctor->phone_number,
            'bio' => $doctor->bio,
            'profile_image_url' => $doctor->user->profile_image_url ?? null,
            'clinics' => $clinics->map(function ($clinic) {
                return [
                    'id' => $clinic->user_id,
                    'name' => $clinic->clinic_name,
                    'address' => $clinic->address,
                    'profile_image_url' => $clinic->user->profile_image_url ?? null,
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

    public function getClinics(string $doctorId)
    {
        $clinics = $this->doctorService->getDoctorClinics($doctorId)['clinics'] ?? null;

        return response()->json([
            'success' => true,
            'clinics' => $clinics
        ], 200);
    }

    public function getBio(string $doctorId)
    {
        $bio = $this->doctorService->getDoctorById($doctorId)->bio;
        return response()->json(['bio' => $bio], 200);
    }

    public function updateBio(Request $request)
    {
        $request->validate(['bio' => 'required|string']);

        $doctor = auth()->user()->doctor;
        $this->authorize('update', $doctor);

        $this->doctorService->updateDoctorBio($doctor->user_id, $request->bio);

        return response()->json(['message' => 'Bio updated successfully.'], 200);
    }

    public function getAllPatientsAppointmentsWithMedicalRecord()
    {
        try {
            $appointments = $this->doctorService->getAllPatientsAppointmentsWithMedicalRecord(auth()->id());

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching all patients appointments with medical record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching all patients appointments with medical record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // TODO: Review the above function
}
