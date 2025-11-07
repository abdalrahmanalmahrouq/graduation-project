<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure these folders exist:
        // public/images/users-data  → your source images
        // public/profile-images     → destination

          // 🧹 Clean the old profile-images before seeding new ones
          Storage::disk('public')->deleteDirectory('profile-images');
          Storage::disk('public')->makeDirectory('profile-images');
          
        $users = [
            // Patients
            ['email' => 'khalid@example.com',     'role' => 'patient', 'image' => 'khalid.jpg'],
            ['email' => 'mohsen@example.com',     'role' => 'patient', 'image' => 'mohsen.jpg'],
            ['email' => 'ahmed@example.com',      'role' => 'patient', 'image' => 'ahmed.jpg'],

            // Doctors
            ['email' => 'omar@example.com',       'role' => 'doctor',  'image' => 'omar.jpg'],
            ['email' => 'ali@example.com',        'role' => 'doctor',  'image' => 'ali.png'],
            ['email' => 'fatima@example.com',     'role' => 'doctor',  'image' => 'fatima.png'],

            // Clinics
            ['email' => 'alzayed@example.com',    'role' => 'clinic',  'image' => 'alzayed.jpg'],
            ['email' => 'healthplus@example.com', 'role' => 'clinic',  'image' => 'health.jpg'],
            ['email' => 'alnoor@example.com',     'role' => 'clinic',  'image' => 'alnoor.jpg'],

            // Labs
            ['email' => 'medlab@example.com',     'role' => 'lab',     'image' => 'medlab.png'],
            ['email' => 'biolab@example.com',     'role' => 'lab',     'image' => 'biolab.png'],
        ];

        foreach ($users as $data) {
            $source = public_path('images/users-data/' . $data['image']);
            $uniqueName = uniqid() . '_' . time() . '.jpg';
            $destination = 'profile-images/' . $uniqueName;

            // Use Laravel storage to save in storage/app/public/profile-images
            if (file_exists($source)) {
                Storage::disk('public')->putFileAs('profile-images', new File($source), $uniqueName);
            }

            User::create([
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => $data['role'],
                'email_verified_at' => now(),
                'profile_image' =>$destination, // store relative path
            ]);
        }
    }
}
