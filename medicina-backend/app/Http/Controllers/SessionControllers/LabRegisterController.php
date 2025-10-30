<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LabRegisterController extends Controller
{
   public function register(Request $request){

    $validate=$request->validate([
        'email'=>'required|email|unique:users,email,NULL,id,role,lab',
        'password'=>'required|min:6|confirmed',
        'lab_name'=>'required|string',
        'phone_number'=>'required|string|unique:labs,phone_number',
        'address'=>'nullable|string',
    ]);

    $user=User::create([
        'email'=>$validate['email'],
        'password'=>Hash::make($validate['password']),
        'role'=>'lab'
    ]);

    // FIX: use create instead of created
    $lab = Lab::create([
        'user_id'=>$user->id,
        'lab_name'=>$validate['lab_name'],
        'phone_number'=>$validate['phone_number'],
        'address'=>$validate['address'],
    ]);

    // Send email verification notification (will fail silently if no mail config)
    try {
        $user->sendEmailVerificationNotification();
        $emailVerificationSent = true;
        $message = 'Registration successful! Please check your email to verify your account.';
    } catch (\Exception $e) {
        // Email sending failed (no credentials), continue without email verification
        $emailVerificationSent = false;
        $message = 'Registration successful! (Email verification disabled for development)';
    }

    $token = $user->createToken('auth_token', ['*'], now()->addMinutes(config('sanctum.expiration', 480)))->plainTextToken;

    // Include the joined profile like /profile endpoint for consistency
    return response()->json([
        'access_token' => $token,
        'user' => $user,
        'role' => $user->role,
        'profile' => $lab, // Consistent API for frontend
        'message' => $message,
        'email_verification_sent' => $emailVerificationSent,
    ]);
}
}