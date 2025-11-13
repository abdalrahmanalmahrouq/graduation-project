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

    $doctorsCount = $clinic->doctors()->whereHas('user', fn($q) => $q->whereNull('deleted_at'))->count();
    $patientsCount = $clinic->patients()->whereHas('user', fn($q) => $q->whereNull('deleted_at'))
    ->distinct('patients.user_id')->count('patients.user_id');
    $appointmentsCount = $clinic->appointments()->count();
    $insurancesCount = $clinic->insurances()->where('insurances.deleted_at', null)->count();

    return response()->json([
        'success' => true,
        'data' => [
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
        $insurances = Insurance::orderBy('name')->take(5)->get();
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
}
