<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Support\Facades\Hash;


class ClinicRegisterController extends Controller
{
    public function register(Request $request){
        $validated=$request->validate([
            'email' => 'required|email|unique:users,email,NULL,id,role,clinic',
            'password' => 'required|min:6|confirmed',
            'clinic_name' => 'required|string',
            'phone_number' => 'required|string|unique:clinics,phone_number',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'email'=>$validated['email'],
            'password' => Hash::make($validated['password']),
            'role'=>'clinic'
        ]);

        Clinic::create([
            'user_id' => $user->id,
            'clinic_name'=>$validated['clinic_name'],
            'phone_number'=>$validated['phone_number'],
            'address'=>$validated['address']
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
