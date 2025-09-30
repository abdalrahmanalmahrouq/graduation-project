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
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6|confirmed',
            'full_name'=>'required|string',
            'phone_number'=>'required|string|unique:doctors'
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
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'role' => $user->role,
        ]);
        
    }
}
