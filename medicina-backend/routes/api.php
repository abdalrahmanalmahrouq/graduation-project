<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\LabResultController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionControllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionControllers\PatientRegisterController;
use App\Http\Controllers\SessionControllers\ClinicRegisterController;
use App\Http\Controllers\SessionControllers\DoctorRegisterController;
use App\Http\Controllers\SessionControllers\PasswordResetController;
use App\Http\Controllers\SessionControllers\LabRegisterController;


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
    Route::post('/register/lab',[LabRegisterController::class,'register']);
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


Route::middleware(['auth:sanctum', 'role:clinic'])->group(function(){
    Route::post('clinics/add-doctor', [ClinicController::class, 'addDoctor']);
    Route::get('clinics/get-doctors', [ClinicController::class, 'getDoctors']);
    Route::delete('clinics/delete-doctor-from-clinic', [ClinicController::class, 'deleteDoctor']);
});

Route::get('doctors/by-specialization/{specialization}',[DoctorController::class,'getDoctorsBySpecialization']);
Route::get('doctors/profile/{id}',[DoctorController::class,'getDoctorProfile']);

Route::middleware(['auth:sanctum', 'role:doctor'])->group(function(){
    Route::get('doctors/get-clinics',[DoctorController::class,'getClinics']);
    Route::post('doctors/add-bio',[DoctorController::class,'addBio']);
    Route::get('doctors/get-bio',[DoctorController::class,'getBio']);
    Route::post('doctors/update-bio',[DoctorController::class,'updateBio']);
    Route::get('doctors/get-all-patients-appointments-with-medical-record',[DoctorController::class,'getAllPatientsAppointmentsWithMedicalRecord']);
    Route::get('appointment/{appointment_id}/medical-record/create',[MedicalRecordController::class,'create']);
    Route::post('appointment/{appointment_id}/medical-record',[MedicalRecordController::class,'store']);
    Route::get('medical-records',[MedicalRecordController::class,'index']);
    Route::get('medical-records/{record_id}',[MedicalRecordController::class,'show']);
});




Route::middleware(['auth:sanctum'])->get('patients/by-user-id/{user_id}',[PatientController::class,'getPatientByUserId']);
Route::middleware(['auth:sanctum','role:patient'])->get('patients/lab-results',[PatientController::class,'getPatientLabResults']);
Route::middleware(['auth:sanctum','role:patient'])->get('patients/medical-records',[PatientController::class,'getPatientMedicalRecords']);

Route::post('appointments/create',[AppointmentController::class,'createAppointment']);
Route::get('appointments/available/{doctor_id}/{clinic_id}',[AppointmentController::class,'getAvailableDoctorClinicAppointment']);
Route::get('appointments/booked/{doctor_id}/{clinic_id}',[AppointmentController::class,'getBookedDoctorClinicAppointment']);
Route::get('appointments/completed/{doctor_id}/{clinic_id}',[AppointmentController::class,'getCompletedDoctorClinicAppointment']);
Route::get('appointments/cancelled/{doctor_id}/{clinic_id}',[AppointmentController::class,'getCancelledDoctorClinicAppointment']);
Route::put('appointments/{appointment_id}',[AppointmentController::class,'updateAvailableDoctorClinicAppointment']);

Route::delete('appointments/{appointment_id}',[AppointmentController::class,'deleteAvailableDoctorClinicAppointment']);
Route::delete('appointments/booked/{appointment_id}',[AppointmentController::class,'deleteBookedDoctorClinicAppointment']);

Route::get('appointments/all-appointments/{clinic_id}',[AppointmentController::class,'getAllClinicAppointments']);

// Doctor: finish a booked appointment
Route::middleware(['auth:sanctum','role:doctor'])->put('appointments/finish/{appointment_id}',[AppointmentController::class,'finishBookedAppointment']);


// Insurance Management Routes
Route::get('insurances', [InsuranceController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:clinic'])->group(function(){
    Route::get('clinic/get-insurances', [InsuranceController::class, 'getInsurancesForClinic']);//  this route will get all insurances company for specific clinic id
    Route::post('clinic/add-insurances',[InsuranceController::class,'addInsurancesForClinic']); // this route will add insurance company for each clinic
    Route::delete('clinic/delete-insurances',[InsuranceController::class,'deleteInsuranceForClinic']);// this route will soft delete an associated insurance company for the clinic
    Route::post('clinic/restore-insurances',[InsuranceController::class,'restoreInsuranceForClinic']);// this route will restore a soft deleted insurance company for the clinic
});



// Lab Result Routes
// PATIENT → get notifications (pending requests)
Route::middleware(['auth:sanctum', 'role:patient'])->get('/lab-results/notifications', [LabResultController::class, 'getPatientNotifications']);
// PATIENT → accept/reject
Route::middleware(['auth:sanctum', 'role:patient'])->patch('/lab-results/{labResult}/respond', [LabResultController::class, 'respond']);

Route::middleware(['auth:sanctum', 'role:lab'])->group(function(){
    Route::get('/lab-results/requests', [LabResultController::class, 'getLabRequests']);// LAB → get all their requests
    Route::post('/lab-results/request', [LabResultController::class, 'createRequest']);// LAB → create pending request
    Route::post('/lab-results/{labResult}/upload', [LabResultController::class, 'uploadDetails']);// LAB → upload details+file once approved
});



