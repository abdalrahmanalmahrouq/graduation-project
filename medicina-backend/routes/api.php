<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClinicDoctorController;
use App\Http\Controllers\DoctorBioController;
use App\Http\Controllers\DoctorClinicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionControllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionControllers\PatientRegisterController;
use App\Http\Controllers\SessionControllers\ClinicRegisterController;
use App\Http\Controllers\SessionControllers\DoctorRegisterController;
use App\Http\Controllers\SessionControllers\PasswordResetController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test endpoint with basic rate limiting (30 requests per minute)
Route::middleware('throttle:30,1')->get('/test', function () {
    return response()->json(['message' => 'API is working successfully']);
});


// Profile endpoint with rate limiting (60 requests per minute for authenticated users)
Route::middleware(['auth:sanctum'])->get('/profile', [ProfileController::class, 'show']);


// Registration endpoints with custom rate limiting (3 attempts per minute)
Route::middleware('auth.rate.limit:3,1')->group(function () {
    Route::post('/register/patient',[PatientRegisterController::class,'register']);
    Route::post('/register/clinic',[ClinicRegisterController::class,'register']);
    Route::post('/register/doctor',[DoctorRegisterController::class,'register']);
});

// Login endpoint with strict rate limiting (5 attempts per minute)
Route::middleware('auth.rate.limit:5,1')->post('/login',[AuthController::class,'login']);

// Logout endpoint (less restrictive since user is already authenticated)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Delete Account endpoint
Route::middleware('auth:sanctum')->post('/delete-account', [AuthController::class, 'deleteAccount']);


// Email Verification Routes
Route::middleware(['auth:sanctum', 'throttle:6,1'])->group(function () {
    // Resend verification email
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email sent successfully']);
    })->name('verification.send');
    
    // Check verification status
    Route::get('/email/verify-status', function (Request $request) {
        return response()->json([
            'verified' => $request->user()->hasVerifiedEmail(),
            'email' => $request->user()->email
        ]);
    })->name('verification.status');
});

// Password Reset Routes
Route::middleware('throttle:5,1')->group(function () {
    
    // Request password reset
    Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLinkEmail']);
    
    // Verify reset token
    Route::post('/password/verify-token', [PasswordResetController::class, 'verifyResetToken']);
    
    // Reset password
    Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
});
Route::middleware(['auth:sanctum'])->post('/profile', [ProfileController::class, 'update']);
Route::middleware(['auth:sanctum'])->post('/change-password', [ProfileController::class, 'changePassword']);


Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('clinics/add-doctor', [ClinicDoctorController::class, 'addDoctor']);
    Route::get('clinics/available-doctors', [ClinicDoctorController::class, 'getAvailableDoctors']);
    Route::get('clinics/doctors', [ClinicDoctorController::class, 'getClinicDoctors']);
});

Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('doctors/add-bio',[DoctorBioController::class,'addBio']);
    Route::get('doctors/get-bio',[DoctorBioController::class,'getBio']);    
    Route::post('doctors/update-bio',[DoctorBioController::class,'updateBio']);
});


Route::get('doctors/by-specialization/{specialization}',[DoctorClinicController::class,'getDoctorsBySpecialization']);
Route::get('doctors/profile/{id}',[DoctorClinicController::class,'getDoctorProfile']);

Route::post('appointments/create',[AppointmentController::class,'createAppointment']);
Route::get('appointments/available/{doctor_id}/{clinic_id}',[AppointmentController::class,'getAvailableDoctorClinicAppointments']);
Route::put('appointments/{appointment_id}',[AppointmentController::class,'updateAppointment']);
Route::delete('appointments/{appointment_id}',[AppointmentController::class,'deleteAppointment']);