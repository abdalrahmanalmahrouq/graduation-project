<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\Insurance;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;

class PatientRegisterController extends Controller
{
    public function register(Request $request)
    {
        // Handle restore if soft-deleted
        $trashedUser = User::onlyTrashed()
            ->where('email', $request->input('email'))
            ->where('role', 'patient')
            ->first();

        if ($trashedUser) {
            $existingPatient = Patient::where('user_id', $trashedUser->id)->first();

            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:6|confirmed',
                'full_name' => 'required|string',
                'date_of_birth' => 'required|date',
                'phone_number' => 'required|string' . ($existingPatient ? ('|unique:patients,phone_number,' . $existingPatient->id) : '|unique:patients,phone_number'),
                'address' => 'nullable|string',
                'insurance'=>'nullable|exists:insurances,name'
            ]);

            $trashedUser->restore();
            $trashedUser->password = Hash::make($validated['password']);
            $trashedUser->save();

            $insurance=Insurance::where('name',$request->insurance)->first();

            if ($existingPatient) {
                $existingPatient->full_name = $validated['full_name'];
                $existingPatient->date_of_birth = $validated['date_of_birth'];
                $existingPatient->phone_number = $validated['phone_number'];
                $existingPatient->address = $validated['address'] ?? $existingPatient->address;
                $existingPatient->insurance_id = $insurance ? $insurance->insurance_id : null;
                $existingPatient->save();
            } else {
                Patient::create([
                    'user_id' => $trashedUser->id,
                    'full_name' => $validated['full_name'],
                    'date_of_birth' => $validated['date_of_birth'],
                    'phone_number' => $validated['phone_number'],
                    'address' => $validated['address'] ?? null,
                    'insurance_id'=>$insurance ? $insurance->insurance_id : null,
                ]);
            }

            $user = $trashedUser;
        } else {
            $validated = $request->validate([
                'email' => 'required|email|unique:users,email,NULL,id,role,patient,deleted_at,NULL',
                'password' => 'required|min:6|confirmed',
                'full_name' => 'required|string',
                'date_of_birth' => 'required|date',
                'phone_number' => 'required|string|unique:patients,phone_number',
                'address' => 'nullable|string',
                'insurance'=>'nullable|exists:insurances,name'
            ]);

            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'patient',
            ]);

            $insurance=Insurance::where('name',$request->insurance)->first();
            Patient::create([
                'user_id' => $user->id,
                'full_name' => $validated['full_name'],
                'date_of_birth' => $validated['date_of_birth'],
                'phone_number' => $validated['phone_number'],
                'address' => $validated['address'],
                'insurance_id'=>$insurance ? $insurance->insurance_id : null,
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
