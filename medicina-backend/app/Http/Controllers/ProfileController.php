<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    
    public function show(Request $request){
        $user = $request->user();

        switch ($user->role) {
        case 'patient':
            $patient= Patient::with('insurances')->where('user_id',$user->id)->first();
            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $patient,
            ]);
        case 'doctor':
            return response()->json([   
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->doctor,
                'consultation_duration' => $user->doctor->consultation_duration,
            ]);
        case 'clinic':
            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->clinic,
            ]);
        case 'lab':
            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->lab,
            ]);
        default:
            return response()->json(['error' => 'Invalid role'], 400);
        }
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        // Log the request data for debugging
        Log::info('Profile update request:', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'request_data' => $request->all(),
            'has_file' => $request->hasFile('profile_image'),
            'content_type' => $request->header('Content-Type'),
            'method' => $request->method(),
            'files' => $request->allFiles(),
            'input' => $request->input(),
            'raw_content' => $request->getContent()
        ]);
        
        // Validate the request based on user role - make validation more flexible
        $validationRules = [];
        
        if ($request->has('insurance_id') && $request->input('insurance_id') === '') {
            $request->merge(['insurance_id' => null]);
        }

        switch ($user->role) {
            case 'patient':
                $validationRules = [
                    'full_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:patients,phone_number,' . $user->patient->id,
                    'date_of_birth' => 'nullable|date',
                    'address' => 'nullable|string|max:500',
                    'insurance_id' => 'nullable|string|exists:insurances,insurance_id',
                ];
                break;
            case 'doctor':
                $validationRules = [
                    'full_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:doctors,phone_number,' . $user->doctor->id,
                    'specialization' => 'nullable|string|max:255',
                    'consultation_duration' => 'nullable|integer|min:10|max:60',
                ];
                break;
            case 'clinic':
                $validationRules = [
                    'clinic_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:clinics,phone_number,' . $user->clinic->id,
                    'address' => 'nullable|string|max:500',
                ];
                break;
            case 'lab':
                $validationRules = [
                    'lab_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:labs,phone_number,' . $user->lab->id,
                    'address' => 'nullable|string|max:500',
                ];
                break;
        }

        // Add profile image validation
        $validationRules['profile_image'] = 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048';

        // Custom validation messages
        $messages = [
            'phone_number.regex' => 'Phone number must contain only numbers, spaces, hyphens, parentheses, and optional + prefix.',
            'phone_number.unique' => 'This phone number is already registered by another user.',
            'phone_number.max' => 'Phone number cannot exceed 20 characters.',
            'full_name.max' => 'Full name cannot exceed 255 characters.',
            'clinic_name.max' => 'Clinic name cannot exceed 255 characters.',
            'specialization.max' => 'Specialization cannot exceed 255 characters.',
            'address.max' => 'Address cannot exceed 500 characters.',
            'date_of_birth.date' => 'Date of birth must be a valid date.',
            'profile_image.image' => 'Profile image must be a valid image file.',
            'profile_image.mimes' => 'Profile image must be a JPEG, PNG, JPG, or GIF file.',
            'profile_image.max' => 'Profile image cannot exceed 2MB.',
        ];

        try {
            $validated = $request->validate($validationRules, $messages);
            Log::info('Validation passed:', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        // Handle profile image upload using Laravel Storage
        $imageProcessed = false;
        
        if ($request->hasFile('profile_image') && $request->file('profile_image')->isValid()) {
            Log::info('Processing profile image upload');
            
            // Delete old profile image if exists
            if ($user->profile_image) {
                Log::info('Deleting old profile image:', ['old_path' => $user->profile_image]);
                if (Storage::disk('public')->exists($user->profile_image)) {
                    Storage::disk('public')->delete($user->profile_image);
                }
                // Also clean up old public directory if exists
                $oldPublicPath = public_path('profile-images/' . basename($user->profile_image));
                if (file_exists($oldPublicPath)) {
                    unlink($oldPublicPath);
                }
            }

            // Store file using Laravel Storage
            $uploadedFile = $request->file('profile_image');
            $fileName = uniqid() . '_' . time() . '.' . $uploadedFile->getClientOriginalExtension();
            $imagePath = $uploadedFile->storeAs('profile-images', $fileName, 'public');
            
            Log::info('New image stored at:', ['storage_path' => $imagePath]);
            
            $user->profile_image = $imagePath;
            $user->save();
            
            Log::info('Profile image updated in database');
            $imageProcessed = true;
        } else {
            Log::info('No valid image file found in request');
        }

        // Update profile based on role
        $updateData = [];
        switch ($user->role) {
            case 'patient':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['full_name', 'phone_number', 'date_of_birth', 'address', 'insurance_id']);
                }, ARRAY_FILTER_USE_KEY);
                Log::info('Updating patient profile:', $updateData);
                if (!empty($updateData)) {
                    $user->patient->update($updateData);
                }
                break;
            case 'doctor':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['full_name', 'phone_number', 'specialization', 'consultation_duration']);
                }, ARRAY_FILTER_USE_KEY);
                Log::info('Updating doctor profile:', $updateData);
                if (!empty($updateData)) {
                    $user->doctor->update($updateData);
                }
                break;
            case 'clinic':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['clinic_name', 'phone_number', 'address']);
                }, ARRAY_FILTER_USE_KEY);
                Log::info('Updating clinic profile:', $updateData);
                if (!empty($updateData)) {
                    $user->clinic->update($updateData);
                }
                break;
            case 'lab':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['lab_name', 'phone_number', 'address']);
                }, ARRAY_FILTER_USE_KEY);
                Log::info('Updating lab profile:', $updateData);
                if (!empty($updateData)) {
                    $user->lab->update($updateData);
                }
                break;
        }

        Log::info('Profile update completed successfully');

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $this->show($request)->getData(),
            'image_processed' => $imageProcessed
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
            'confirm_password' => 'required|same:new_password'
        ]);

        $user = $request->user();

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
