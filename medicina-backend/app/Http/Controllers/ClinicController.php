<?php

namespace App\Http\Controllers;
use App\Http\Resources\ClinicDoctorResource;
use App\Services\ClinicService;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    protected ClinicService $clinicService;
    public function __construct(ClinicService $clinicService)
    {
        $this->clinicService = $clinicService;
    }

    public function getDoctors()
    {
        $clinicId = auth()->user()->id;
        $doctors = $this->clinicService->getClinicDoctors($clinicId);

        return ClinicDoctorResource::collection($doctors);
    }

    public function getDoctorSchedule($doctorId) 
    {
        $clinicId = auth()->user()->clinic->user_id;
        $schedule = $this->clinicService->getDoctorSchedule($doctorId, $clinicId);

        return response()->json([
            'success' => true,
            'schedule' => $schedule
        ], 200);
    }

    public function checkDoctor(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|string|exists:doctors,user_id',
        ]);

        $clinicId = auth()->user()->clinic->user_id;
        $status = $this->clinicService->checkDoctorStatus($clinicId, $request->doctor_id);

        return response()->json([
            'success' => true,
            'status' => $status,
            'message' => $status === 'active' 
                ? 'Doctor is already active in this clinic.'
                : ($status === 'trashed' ? 'Doctor was previously deleted.' : null),
            'data' => [
                'doctor_id' => $request->doctor_id
            ]
        ]);
    }

    public function rescheduleDoctorWeeklySchedule(Request $request)
    {
            $validated = $request->validate([
                'doctor_id' => 'required|exists:doctors,user_id',
                'weekly_schedule' => 'required|array',
            ]);

            $clinicId = auth()->user()->clinic->user_id;
            $this->clinicService->rescheduleDoctor(
                $clinicId,
                $validated['doctor_id'],
                $validated['weekly_schedule']
            );

            return response()->json([
                'success' => true,
                'message' => 'Doctor weekly schedule re-scheduled successfully.'
            ], 200);
    }

    public function addDoctor(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,user_id',
            'weekly_schedule' => 'required|array',
        ]);

        $clinicId = auth()->user()->id;
        $clinicDoctor = $this->clinicService->addDoctor(
            $clinicId,
            $validated['doctor_id'],
            $validated['weekly_schedule']
        );

        return response()->json([
            'success' => true,
            'message' => 'Doctor added to clinic successfully',
            'data' => $clinicDoctor
        ], 201);
    }

    public function deleteDoctor(Request $request)
    {
        try {
            $request->validate([
                'doctor_id' => 'required|exists:doctors,user_id',
            ]);

            $clinicId = auth()->user()->clinic->user_id;
            $this->clinicService->removeDoctor($clinicId, $request->doctor_id);

            return response()->json([
                'success' => true,
                'message' => 'Doctor removed from clinic successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }
}
