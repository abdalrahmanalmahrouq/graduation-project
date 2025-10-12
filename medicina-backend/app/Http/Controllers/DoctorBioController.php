<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DoctorBioController extends Controller
{
    public function addBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio added successfully.'], 200);
    }
    public function getBio(Request $request){
        $doctor=auth()->user()->doctor;
        return response()->json(['bio' => $doctor->bio], 200);
    }
        public function updateBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio updated successfully.'], 200);
    }
}
