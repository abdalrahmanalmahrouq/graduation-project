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
        // If a soft-deleted clinic user exists with this email, restore instead of creating a new one
        $trashedUser = User::onlyTrashed()
            ->where('email', $request->input('email'))
            ->where('role', 'clinic')
            ->first();

        if ($trashedUser) {
            $existingClinic = Clinic::where('user_id', $trashedUser->id)->first();

            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:6|confirmed',
                'clinic_name' => 'required|string',
                'phone_number' => 'required|string' . ($existingClinic ? ('|unique:clinics,phone_number,' . $existingClinic->id) : '|unique:clinics,phone_number'),
                'address' => 'nullable|string',
            ]);

            $trashedUser->restore();
            $trashedUser->password = Hash::make($validated['password']);
            $trashedUser->save();

            if ($existingClinic) {
                $existingClinic->clinic_name = $validated['clinic_name'];
                $existingClinic->phone_number = $validated['phone_number'];
                $existingClinic->address = $validated['address'] ?? $existingClinic->address;
                $existingClinic->save();
            } else {
                Clinic::create([
                    'user_id' => $trashedUser->id,
                    'clinic_name' => $validated['clinic_name'],
                    'phone_number' => $validated['phone_number'],
                    'address' => $validated['address'] ?? null,
                ]);
            }

            // proceed to token and response section below using $user = $trashedUser
            $user = $trashedUser;
        } else {
            $validated=$request->validate([
                // ignore soft-deleted users for unique check
                'email' => 'required|email|unique:users,email,NULL,id,role,clinic,deleted_at,NULL',
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
        }

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
