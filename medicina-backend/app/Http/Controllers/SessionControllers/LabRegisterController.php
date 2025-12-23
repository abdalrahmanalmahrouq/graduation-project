<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Helpers\ValidationRules;
class LabRegisterController extends Controller
{
   public function register(Request $request){

    $trashedUser = User::onlyTrashed()
        ->where('email', $request->input('email'))
        ->where('role', 'lab')
        ->first();

    $messages = array_merge(
        ValidationRules::passwordMessages(),
        [
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
            'phone_number.required' => 'رقم الهاتف مطلوب',
            'phone_number.unique' => 'رقم الهاتف مستخدم بالفعل',
            'phone_number.regex' => 'رقم الهاتف غير صحيح يجب أن يكون 10 أرقام تبدأ بـ 07',
        ]);

    if ($trashedUser) {
        $existingLab = Lab::where('user_id', $trashedUser->id)->first();

        $validate=$request->validate([
            'email'=>'required|email',
            'password'=>ValidationRules::password(),
            'lab_name'=>'required|string',
            'phone_number'=>array_merge(
                ValidationRules::phoneNumber(),
                ['unique:labs,phone_number,' . ($existingLab ? $existingLab->id : 'NULL')]
            ),
            'address'=>'nullable|string',
        ],$messages);

        $trashedUser->restore();
        $trashedUser->password = Hash::make($validate['password']);
        $trashedUser->save();

        if ($existingLab) {
            $existingLab->lab_name = $validate['lab_name'];
            $existingLab->phone_number = $validate['phone_number'];
            $existingLab->address = $validate['address'] ?? $existingLab->address;
            $existingLab->save();
            $lab = $existingLab;
        } else {
            $lab = Lab::create([
                'user_id'=>$trashedUser->id,
                'lab_name'=>$validate['lab_name'],
                'phone_number'=>$validate['phone_number'],
                'address'=>$validate['address'] ?? null,
            ]);
        }

        $user = $trashedUser;
    } else {
        $validate=$request->validate([
            'email'=>'required|email|unique:users,email,NULL,id,role,lab,deleted_at,NULL',
            'password'=>ValidationRules::password(),
            'lab_name'=>'required|string',
            'phone_number'=>array_merge(
                ValidationRules::phoneNumber(),
                ['unique:labs,phone_number']
            ),
            'address'=>'nullable|string',
        ],$messages);

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