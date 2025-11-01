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

    public function getInsurancesForClinic(){
        try {
            $user = auth()->user();
            $clinic = $user->clinic;
            
            // Get only non-soft-deleted insurances
            $insurances = $clinic->insurances()
                ->wherePivotNull('deleted_at')
                ->get(['insurances.insurance_id','insurances.name']);
                
            return response()->json([
                'success' => true,
                'data' => $insurances,
                'message' => 'Insurances retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve insurances',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addInsurancesForClinic(Request $request){

        $request->validate([
            'insurance_id' => 'required|exists:insurances,insurance_id',
        ]);

            $user = auth()->user();
            $clinic = $user->clinic;

            // prevent duplicates (including soft deleted ones)
            $existingInsurance = $clinic->insurances()
            ->wherepivot('insurance_id', $request->insurance_id)
            ->first();
                
            if($existingInsurance){
                // If it's soft deleted, restore it instead of creating a new one
                if($existingInsurance->pivot->deleted_at){
                    $clinic->insurances()->updateExistingPivot($request->insurance_id, [
                        'deleted_at' => null,
                        'updated_at' => now()
                    ]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Insurance restored successfully'
                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Insurance already added.'
                    ], 409);
                }
            }

        $clinic->insurances()->attach($request->insurance_id,['created_at'=>now(),'updated_at'=>now()]);
        return response()->json([
            'success' => true,
            'message' => 'Insurance added successfully'
        ], 200);
        }

        public function deleteInsuranceForClinic(Request $request){
            try {
                $request->validate([
                    'insurance_id' => 'required|exists:insurances,insurance_id',
                ]);
                
                $user = auth()->user();
                $clinic = $user->clinic;
                
                // Check if the insurance is associated with this clinic
                $insuranceClinic = $clinic->insurances()
                    ->wherePivot('insurance_id', $request->insurance_id)
                    ->first();
                
                if(!$insuranceClinic){
                    return response()->json([
                        'success' => false,
                        'message' => 'Insurance not found or not associated with this clinic.'
                    ], 404);
                }
                
                // Soft delete the relationship
                $clinic->insurances()->updateExistingPivot($request->insurance_id, [
                    'deleted_at' => now()
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Insurance removed successfully'
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to remove insurance',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

    

}
