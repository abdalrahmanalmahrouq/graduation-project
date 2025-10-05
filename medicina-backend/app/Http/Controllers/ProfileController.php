<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    
    public function show(Request $request){
        $user = $request->user();

        switch ($user->role) {
        case 'patient':
            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->patient,
            ]);
        case 'doctor':
            return response()->json([   
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->doctor,
            ]);
        case 'clinic':
            return response()->json([
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile_image_url' => $user->profile_image_url,
                'profile' => $user->clinic,
            ]);
        default:
            return response()->json(['error' => 'Invalid role'], 400);
        }
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        // Log the request data for debugging
        \Log::info('Profile update request:', [
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
        
        switch ($user->role) {
            case 'patient':
                $validationRules = [
                    'full_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:patients,phone_number,' . $user->patient->id,
                    'date_of_birth' => 'nullable|date',
                    'address' => 'nullable|string|max:500',
                ];
                break;
            case 'doctor':
                $validationRules = [
                    'full_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:doctors,phone_number,' . $user->doctor->id,
                    'specialization' => 'nullable|string|max:255',
                ];
                break;
            case 'clinic':
                $validationRules = [
                    'clinic_name' => 'nullable|string|max:255',
                    'phone_number' => 'nullable|string|max:20|regex:/^[+]?[0-9\s\-\(\)]{7,20}$/|unique:clinics,phone_number,' . $user->clinic->id,
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
            \Log::info('Validation passed:', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', $e->errors());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        // Handle profile image upload - use $_FILES directly for simplicity
        $imageProcessed = false;
        
        // Check if image file is uploaded
        
        // Use $_FILES directly - this is the most reliable method
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            \Log::info('Processing profile image upload');
            
            // Use move_uploaded_file directly to avoid Laravel parsing issues
            $uploadedFile = $_FILES['profile_image'];
            
            // Delete old profile image if exists
            if ($user->profile_image) {
                \Log::info('Deleting old profile image:', ['old_path' => $user->profile_image]);
                if (Storage::disk('public')->exists($user->profile_image)) {
                    Storage::disk('public')->delete($user->profile_image);
                }
                // Also delete from public directory
                $oldPublicPath = public_path('profile-images/' . basename($user->profile_image));
                if (file_exists($oldPublicPath)) {
                    unlink($oldPublicPath);
                }
            }

            // Generate new filename
            $originalName = $uploadedFile['name'];
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $fileName = uniqid() . '_' . time() . '.' . $extension;
            $imagePath = 'profile-images/' . $fileName;
            
            // Create directories if they don't exist
            if (!is_dir(public_path('profile-images'))) {
                mkdir(public_path('profile-images'), 0755, true);
            }
            
            // Copy file directly using move_uploaded_file for storage
            $storagePath = storage_path('app/public/' . $imagePath);
            $storageDir = dirname($storagePath);
            if (!is_dir($storageDir)) {
                mkdir($storageDir, 0755, true);
            }
            
            // Copy to storage
            copy($uploadedFile['tmp_name'], $storagePath);
            \Log::info('New image stored at:', ['storage_path' => $storagePath]);
            
            // Copy to public directory for direct access
            $publicPath = public_path('profile-images/' . $fileName);
            copy($uploadedFile['tmp_name'], $publicPath);
            \Log::info('Image also copied to public directory:', ['public_path' => $publicPath]);
            
            $user->profile_image = $imagePath;
            $user->save();
            
            \Log::info('Profile image updated in database');
            $imageProcessed = true;
        } else {
            \Log::info('No valid image file found in $_FILES');
        }

        // Update profile based on role
        $updateData = [];
        switch ($user->role) {
            case 'patient':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['full_name', 'phone_number', 'date_of_birth', 'address']);
                }, ARRAY_FILTER_USE_KEY);
                \Log::info('Updating patient profile:', $updateData);
                if (!empty($updateData)) {
                    $user->patient->update($updateData);
                }
                break;
            case 'doctor':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['full_name', 'phone_number', 'specialization']);
                }, ARRAY_FILTER_USE_KEY);
                \Log::info('Updating doctor profile:', $updateData);
                if (!empty($updateData)) {
                    $user->doctor->update($updateData);
                }
                break;
            case 'clinic':
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['clinic_name', 'phone_number', 'address']);
                }, ARRAY_FILTER_USE_KEY);
                \Log::info('Updating clinic profile:', $updateData);
                if (!empty($updateData)) {
                    $user->clinic->update($updateData);
                }
                break;
        }

        \Log::info('Profile update completed successfully');

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $this->show($request)->getData(),
            'image_processed' => $imageProcessed
        ]);
    }
}
