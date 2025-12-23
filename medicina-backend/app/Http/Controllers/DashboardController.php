<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
   public function clinicDashboard()
   {
    try{
    $clinic = auth()->user()->clinic;
    $clinicImage = auth()->user()->profile_image;
    $doctorsCount = $clinic->doctors()->whereHas('clinics')->whereHas('user', fn($q) => $q->whereNull('deleted_at'))->count();
    $patientsCount = $clinic->patients()->whereHas('user', fn($q) => $q->whereNull('deleted_at'))
    ->distinct('patients.user_id')->count('patients.user_id');
    $appointmentsCount = $clinic->appointments()->count();
    $insurancesCount = $clinic->insurances()->wherePivot('deleted_at', null)->count();

    return response()->json([
        'success' => true,
        'data' => [
            'clinicImage' => $clinicImage,
            'doctorsCount' => $doctorsCount,
            'patientsCount' => $patientsCount,
            'insurancesCount' => $insurancesCount,
            'appointmentsCount' => $appointmentsCount
            ]
        ], 200);
    }catch(\Exception $e){
        return response()->json([
            'success' => false,
            'message' => 'فشل في تحميل البيانات',
            'error' => $e->getMessage()
        ], 500);
    }
   }

   public function getFiveInsurancesCompanies()
   {
    try {
        $clinic = auth()->user()->clinic;
        $insurances = $clinic->insurances()
        ->wherePivot('deleted_at',null)
        ->orderBy('name')->take(5)->get();
        
        return response()->json([
            'success' => true,
            'data' => $insurances
        ], 200);
    }catch(\Exception $e){
        return response()->json([
            'success' => false,
            'message' => 'فشل في تحميل البيانات',
            'error' => $e->getMessage()
        ], 500);
    }
   }

   public function getFivePatients()
   {
    try {
        $clinic = auth()->user()->clinic;
        $patients = $clinic->patients()->whereHas('user', fn($q) => $q->whereNull('deleted_at'))
        ->with('user:id,profile_image')
        ->take(5)
        ->get();
        return response()->json([
            'success' => true,
            'data' => $patients
        ], 200);
    }catch(\Exception $e){
        return response()->json([
            'success' => false,
            'message' => 'فشل في تحميل البيانات',
        ], 500);
    }
   }

   public function getCountStatusAppointments(){

    try{
        $clinic = auth()->user()->clinic;
        $statusCounts = $clinic->appointments()
            ->select('appointments.status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('appointments.status')
            ->pluck('count', 'status')
            ->toArray();

        // Initialize all statuses with 0 to ensure all statuses are present in response
        $allStatuses = ['booked', 'completed', 'cancelled', 'no-show', 'pending', 'rejected'];
        $result = [];
        foreach ($allStatuses as $status) {
            $result[$status] = $statusCounts[$status] ?? 0;
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ], 200);
        
    }catch(\Exception $e){
        return response()->json([
            'success' => false,
            'message' => 'Failed to load data',
            'error' => $e->getMessage()
        ], 500);
    }
   }
}
