<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AvailableAppointment;
use App\Models\ClinicDoctor;
use Carbon\Carbon;

class AvailableAppointmentController extends Controller
{
    public function index(Request $request)
    {
        $clinicDoctorId = $request->query('clinic_doctor_id');
        $date = $request->query('date');

        if (!$clinicDoctorId || !$date) {
            return response()->json(['error' => 'clinic_doctor_id and date are required'], 400);
        }

        $clinicDoctor = ClinicDoctor::find($clinicDoctorId);
        if (!$clinicDoctor) {
            return response()->json(['error' => 'ClinicDoctor not found'], 404);
        }

        $dayOfWeek = strtolower(Carbon::parse($date)->format('D')); // e.g., 'Mon', 'Tue'
        
        $availableAppointments = AvailableAppointment::where('clinic_doctor_id', $clinicDoctorId)
            ->where('day', $dayOfWeek)
            ->get();

        return response()->json($availableAppointments);
    }

    public function show(Request $request, $id)
    {
        $availableAppointment = AvailableAppointment::findOrFail($id);
        return response()->json($availableAppointment);
    }

    public function destroy(Request $request, $id)
    {
        $availableAppointment = AvailableAppointment::findOrFail($id);
        $availableAppointment->delete();
        return response()->json(['message' => 'Available appointment deleted successfully']);
    }

    /**
     * Find available appointment IDs that overlap or are close to a requested interval.
     *
     * Request params:
     * - starting_time: required (H:i:s)
     * - ending_time: optional (H:i:s)
     * - tolerance: optional minutes integer (default 15)
     * - doctor_id / clinic_id: optional to narrow scope (at least one recommended)
     *
     * Returns: JSON { ids: ["id1","id2",...] }
     */
    public function findAvailableAppointmentIdsNearInterval(Request $request, $response = "json")
    {
        $validated = $request->validate([
            'starting_time' => 'required|date_format:H:i:s',
            'ending_time' => 'sometimes|date_format:H:i:s',
            'tolerance' => 'sometimes|integer|min:0',
            'doctor_id' => 'sometimes|exists:doctors,user_id',
            'clinic_id' => 'sometimes|exists:clinics,user_id',
        ]);

        $startTime = $validated['starting_time'];
        $endTime = $validated['ending_time'] ?? null;
        $tolerance = $validated['tolerance'] ?? 15;
        $doctorId = $validated['doctor_id'] ?? null;
        $clinicId = $validated['clinic_id'] ?? null;


        $query = AvailableAppointment::query();

        $clinicDoctorIds = ClinicDoctor::idsFor($doctorId, $clinicId);
        if ($clinicDoctorIds) {
            $query->whereIn('clinic_doctor_id', $clinicDoctorIds);
        } else {
            return response()->json(['message' => 'No valid available appointments found for the given criteria'], 200);
        }

        // compute tolerance window around requested times
        $st = Carbon::createFromFormat('H:i:s', $startTime);
        $stMinus = $st->copy()->subMinutes($tolerance)->format('H:i:s');
        $stPlus = $st->copy()->addMinutes($tolerance)->format('H:i:s');

        if ($endTime) {
            $et = Carbon::createFromFormat('H:i:s', $endTime);
            $etMinus = $et->copy()->subMinutes($tolerance)->format('H:i:s');
            $etPlus = $et->copy()->addMinutes($tolerance)->format('H:i:s');

            // select slots where starting or ending time falls within the expanded window
            // or slots that fully contain the requested expanded window
            $query->where(function ($q) use ($stMinus, $etPlus) {
                $q->whereBetween('starting_time', [$stMinus, $etPlus])
                  ->orWhereBetween('ending_time', [$stMinus, $etPlus])
                  ->orWhere(function ($qq) use ($stMinus, $etPlus) {
                      $qq->where('starting_time', '<=', $stMinus)
                         ->where('ending_time', '>=', $etPlus);
                  });
            });
        } else {
            // only start time provided: accept slots that start within tolerance, or end after (or at) start-minus
            $query->where(function ($q) use ($stMinus, $stPlus) {
                $q->whereBetween('starting_time', [$stMinus, $stPlus])
                  ->orWhere('ending_time', '>=', $stMinus);
            });
        }

        $ids = $query->pluck('id')->toArray();

        if ($response !== 'json') {
            return $ids;
        }
        return response()->json(['valid_appointment_ids' => $ids], 200);
    }

    public function getValidAppointmentForEndpoint(Request $request)
    {
        $clinicDoctorId = $request->input('clinic_doctor_id');
        $day = $request->input('day');
        $startingTime = $request->input('starting_time');

        $query = AvailableAppointment::query()
            ->where('clinic_doctor_id', $clinicDoctorId)
            ->when($day, function ($q) use ($day) {
                $q->where('day', $day)->orderBy('starting_time', 'asc');
            })
            ->when("starting_time", function ($q) use ($request) {
                $q->where('starting_time', '>=', $request->input('starting_time'))
                  ->orderBy('day', 'asc');
            })
            ->when("ending_time", function ($q) use ($request) {
                $q->where('ending_time', '<=', $request->input('ending_time'))
                  ->orderBy('day', 'asc');
            })
            ->get();

        return $query;
    }

    
}
