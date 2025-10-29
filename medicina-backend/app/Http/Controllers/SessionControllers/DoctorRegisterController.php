<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class DoctorRegisterController extends Controller
{
    public function register(Request $request){
        $validated=$request->validate([
            'email'=>'required|email|unique:users,email,NULL,id,role,doctor',
            'password'=>'required|min:6|confirmed',
            'full_name'=>'required|string',
            'phone_number'=>'required|string|unique:doctors,phone_number',
            'specialization'=>'required|string',
            'consultation_duration'=>'required|integer|min:10|max:60',
        ]);

        $user=User::create([
            'email'=>$validated['email'],
            'password'=>Hash::make($validated['password']),
            'role'=>'doctor'
        ]);

        Doctor::create([
            'user_id' => $user->id,
            'full_name'=>$validated['full_name'],
            'phone_number'=>$validated['phone_number'],
            'specialization'=>$validated['specialization'],
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

        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'role' => $user->role,
            'message' => $message,
            'email_verification_sent' => $emailVerificationSent,
        ]);
        
    }
}
