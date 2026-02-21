<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpsertClinicDoctorRequest;
use App\Http\Resources\ClinicDoctorResource;
use App\Services\ClinicService;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    public function __construct(protected ClinicService $clinicService)
    {
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

    public function rescheduleDoctorWeeklySchedule(UpsertClinicDoctorRequest $request)
    {
        $clinicId = auth()->user()->clinic->user_id;
        $this->clinicService->rescheduleDoctor(
            $clinicId,
            $request->doctor_id,
            $request->weekly_schedule
        );

        return response()->json([
            'success' => true,
            'message' => 'Doctor weekly schedule re-scheduled successfully.'
        ], 200);
    }

    public function addDoctor(UpsertClinicDoctorRequest $request)
    {
        $clinicId = auth()->user()->id;
        $clinicDoctor = $this->clinicService->addDoctor(
            $clinicId,
            $request->doctor_id,
            $request->weekly_schedule
        );

        return response()->json([
            'success' => true,
            'message' => 'Doctor added to clinic successfully',
            'data' => $clinicDoctor
        ], 201);
    }

    public function deleteDoctor(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|string|exists:doctors,user_id',
        ]);

        $clinicId = auth()->user()->clinic->user_id;
        $this->clinicService->removeDoctor($clinicId, $request->doctor_id);

        return response()->json([
            'success' => true,
            'message' => 'Doctor removed from clinic successfully.'
        ], 200);
    }
}
