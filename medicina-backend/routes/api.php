<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionControllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionControllers\PatientRegisterController;
use App\Http\Controllers\SessionControllers\ClinicRegisterController;
use App\Http\Controllers\SessionControllers\DoctorRegisterController;

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
Route::middleware(['auth:sanctum', 'throttle:60,1'])->get('/profile', [ProfileController::class, 'show']);


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