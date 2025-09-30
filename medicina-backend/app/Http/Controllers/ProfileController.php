<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    
    public function show(Request $request){

        $user=$request->user();

        switch ($user->role) {
        case 'patient':
            return response()->json([
                'email'=>$user->email,
                'role'=>$user->role, 
                'profile' => $user->patient,
            ]);
        case 'doctor':
            return response()->json([   
                'email'=>$user->email,
                'role'=>$user->role, 
                'profile' => $user->doctor,
            ]);
        case 'clinic':
            return response()->json([
                'email'=>$user->email,
                'role'=>$user->role, 
                'profile' => $user->clinic,
            ]);
        default:
            return response()->json(['error' => 'Invalid role'], 400);
    }
    }
}
