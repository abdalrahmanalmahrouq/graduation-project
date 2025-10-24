<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Insurance;
use App\Models\Clinic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class InsuranceController extends Controller
{
   
    //  Get all insurance companies
    public function index()
    {
        try {
            $insurances = Insurance::select('insurance_id', 'name')
                ->orderBy('name')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $insurances,
                'message' => 'Insurance companies retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve insurance companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
