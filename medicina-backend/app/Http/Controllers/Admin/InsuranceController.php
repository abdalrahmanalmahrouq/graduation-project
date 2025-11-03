<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Insurance;
use Illuminate\Http\Request;

class InsuranceController extends Controller
{
   public function index()
   {
    try {
        $insurances=Insurance::orderBy('name')->paginate(10);
        return view ('admin.insurances.index',compact('insurances'));
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve insurances',
            'error' => $e->getMessage()
        ], 500);
    }
   }

   public function create()
   {
    try {
        return view ('admin.insurances.create');
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create insurance',
            'error' => $e->getMessage()
        ], 500);
    }
   }

   public function store(Request $request)
   {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        // Check if insurance with this name exists but is soft-deleted
        $existingInsurance = Insurance::withTrashed()->where('name', $request->name)->first();
        
        if ($existingInsurance) {
            if ($existingInsurance->trashed()) {
                // Restore the soft-deleted insurance
                $existingInsurance->restore();
                return redirect()->route('admin.insurances.index')
                    ->with('success', 'Insurance restored successfully');
            } else {
                // Insurance already exists and is active
                return redirect()->back()
                    ->withErrors(['name' => 'The insurance company already exists.'])
                    ->withInput();
            }
        }
        
        // Create new insurance
        Insurance::create(['name' => $request->name]);
        
        return redirect()->route('admin.insurances.index')
            ->with('success', 'Insurance created successfully');
   }

   public function edit($id)
   {
    try {
        $insurance=Insurance::findOrFail($id);
        return view ('admin.insurances.edit',compact('insurance'));
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to edit insurance',
            'error' => $e->getMessage()
        ], 500);
    }
   }

   public function update(Request $request, $id)
   {
    $insurance = Insurance::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
    ]);
    
    // Check if another insurance with this name exists (excluding current and soft-deleted)
    $existing = Insurance::where('name', $request->name)
        ->where('insurance_id', '!=', $insurance->insurance_id)
        ->first();
    
    if ($existing) {
        return redirect()->back()
            ->withErrors(['name' => 'The insurance company name is already taken.'])
            ->withInput();
    }
   
    $insurance->update(['name' => $request->name]);
    return redirect()->route('admin.insurances.index')
        ->with('success', 'Insurance updated successfully');
   }

   public function destroy($id)
   {
    $insurance = Insurance::findOrFail($id);
    // Soft delete - sets deleted_at timestamp
    $insurance->delete();
    return redirect()->route('admin.insurances.index')
        ->with('success', 'Insurance deleted successfully');
   }
}
