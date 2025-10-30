<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'email'=>'required|email',
            'password'=>'required',
            'role'=>'required|in:patient,doctor,clinic,admin,lab'
        ]);

        // First check if user exists with this email
        $userWithEmail = User::where('email', $request->email)->first();
        
        if (!$userWithEmail) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check if user exists with this email and role
        $user = User::where('email', $request->email)
                   ->where('role', $request->role)
                   ->first();

        if (!$user) {
            // User exists with this email but not with this role
            $availableRoles = User::where('email', $request->email)
                                 ->pluck('role')
                                 ->toArray();
            $availableRoleNames = [];
           foreach($availableRoles as $role){
            if($role =="patient"){
                $availableRoleNames[] = 'المريض';
            }elseif($role =="clinic"){
                $availableRoleNames[] = 'العيادة';
            }elseif($role =="doctor"){
                $availableRoleNames[] = 'الطبيب';
            }elseif($role =="admin"){
                $availableRoleNames[] = 'المدير';
            }elseif($role =="lab"){
                $availableRoleNames[] = 'المختبر';
            }
           }
            
            $message = 'يجب تسجيل الدخول من صفحة ' . implode(' أو ', $availableRoleNames);
            return response()->json(['message' => $message], 401);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token=$user->createToken('auth_token', ['*'], now()->addMinutes(config('sanctum.expiration', 480)))->plainTextToken;

        return response()->json([
            'access_token'=>$token,
            'user'=>$user
        ]);
        
    }

    public function logout(Request $request){
        
        $request->user()->tokens()->delete();
        return response()->json(['message'=>'Logged out']);

    }

    public function deleteAccount(Request $request){
        $request->user()->delete();
        return response()->json(['message'=>'Account deleted']);
    }
}
