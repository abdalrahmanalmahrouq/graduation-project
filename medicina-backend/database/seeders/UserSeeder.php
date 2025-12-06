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

            // ['email' => 'sara81@example.com',    'role' => 'patient', 'image' => 'sara.jpg'],
            // ['email' => 'yousef44@example.com',  'role' => 'patient', 'image' => 'yousef.jpg'],
            // ['email' => 'nada33@example.com',    'role' => 'patient', 'image' => 'nada.jpg'],
            // ['email' => 'majdi27@example.com',   'role' => 'patient', 'image' => 'majdi.jpg'],
            // ['email' => 'farida66@example.com',  'role' => 'patient', 'image' => 'farida.jpg'],
            // ['email' => 'ammar95@example.com',   'role' => 'patient', 'image' => 'ammar.jpg'],
            // ['email' => 'reem58@example.com',    'role' => 'patient', 'image' => 'reem2.jpg'],
            // ['email' => 'tareq71@example.com',   'role' => 'patient', 'image' => 'tareq.jpg'],
            // ['email' => 'hala54@example.com',    'role' => 'patient', 'image' => 'hala2.jpg'],
            // ['email' => 'mohammed42@example.com','role' => 'patient', 'image' => 'mohammed.jpg'],
            // ['email' => 'jasmine22@example.com', 'role' => 'patient', 'image' => 'jasmine.jpg'],
            // ['email' => 'bilal69@example.com',   'role' => 'patient', 'image' => 'bilal.jpg'],

            // Doctors
            ['email' => 'fatima@example.com',    'role' => 'doctor', 'image' => 'fatima.png'],
            ['email' => 'omar@example.com',    'role' => 'doctor', 'image' => 'omar.jpg'],
            ['email' => 'ali@example.com',    'role' => 'doctor', 'image' => 'ali.png'],

            // ['email' => 'sami44@example.com',      'role' => 'doctor', 'image' => 'sami.jpg'],
            // ['email' => 'lina82@example.com',      'role' => 'doctor', 'image' => 'lina.jpg'],
            // ['email' => 'mahmoud11@example.com',   'role' => 'doctor', 'image' => 'mahmoud.jpg'],
            // ['email' => 'rana37@example.com',      'role' => 'doctor', 'image' => 'rana.jpg'],
            // ['email' => 'ahmad58@example.com',     'role' => 'doctor', 'image' => 'ahmad.jpg'],
            // ['email' => 'omar07@example.com',      'role' => 'doctor', 'image' => 'omar07.jpg'],
            // ['email' => 'nour92@example.com',      'role' => 'doctor', 'image' => 'nour.jpg'],
            // ['email' => 'hala16@example.com',      'role' => 'doctor', 'image' => 'hala.jpg'],
            // ['email' => 'firas88@example.com',     'role' => 'doctor', 'image' => 'firas.jpg'],
            // ['email' => 'tasneem41@example.com',   'role' => 'doctor', 'image' => 'tasneem.jpg'],
            // ['email' => 'khaled05@example.com',    'role' => 'doctor', 'image' => 'khaled.jpg'],
            // ['email' => 'mustafa74@example.com',   'role' => 'doctor', 'image' => 'mustafa.jpg'],
            // ['email' => 'maria66@example.com',     'role' => 'doctor', 'image' => 'maria.jpg'],
            // ['email' => 'dina53@example.com',      'role' => 'doctor', 'image' => 'dina.jpg'],
            // ['email' => 'yousef29@example.com',    'role' => 'doctor', 'image' => 'yousefdoc.jpg'],
            // ['email' => 'salma81@example.com',     'role' => 'doctor', 'image' => 'salma.jpg'],
            // ['email' => 'ibrahim15@example.com',   'role' => 'doctor', 'image' => 'ibrahim.jpg'],
            // ['email' => 'hassan60@example.com',    'role' => 'doctor', 'image' => 'hassan.jpg'],
            // ['email' => 'ward99@example.com',      'role' => 'doctor', 'image' => 'ward.jpg'],
            // ['email' => 'reem42@example.com',      'role' => 'doctor', 'image' => 'reem.jpg'],
            // ['email' => 'saif33@example.com',      'role' => 'doctor', 'image' => 'saif.jpg'],
            // ['email' => 'hanan25@example.com',     'role' => 'doctor', 'image' => 'hanan.jpg'],
            // ['email' => 'adel49@example.com',      'role' => 'doctor', 'image' => 'adel.jpg'],
            // ['email' => 'tareq67@example.com',     'role' => 'doctor', 'image' => 'tareq2.jpg'],
            // ['email' => 'maya93@example.com',      'role' => 'doctor', 'image' => 'maya.jpg'],
            // ['email' => 'rabia12@example.com',     'role' => 'doctor', 'image' => 'rabia.jpg'],
            // ['email' => 'issam21@example.com',     'role' => 'doctor', 'image' => 'issam.jpg'],
            // ['email' => 'kareem19@example.com',    'role' => 'doctor', 'image' => 'kareem.jpg'],
            // ['email' => 'farah01@example.com',     'role' => 'doctor', 'image' => 'farah.jpg'],
            // ['email' => 'majid39@example.com',     'role' => 'doctor', 'image' => 'majid.jpg'],
            // ['email' => 'tamara84@example.com',    'role' => 'doctor', 'image' => 'tamara.jpg'],
            // ['email' => 'ayman52@example.com',     'role' => 'doctor', 'image' => 'ayman.jpg'],
            // ['email' => 'ali91@example.com',       'role' => 'doctor', 'image' => 'alidoc.jpg'],   
            // ['email' => 'ziad46@example.com',      'role' => 'doctor', 'image' => 'ziad.jpg'],
            // ['email' => 'najwa70@example.com',     'role' => 'doctor', 'image' => 'najwa.jpg'],

            // Clinics
            ['email' => 'alzayed@example.com',    'role' => 'clinic', 'image' => 'alzayed.jpg'],
            ['email' => 'healthplus@example.com',    'role' => 'clinic', 'image' => 'health.jpg'],
            ['email' => 'alnoor@example.com',    'role' => 'clinic', 'image' => 'alnoor.jpg'],
            
            // ['email' => 'shifa92@example.com',      'role' => 'clinic', 'image' => 'shifa.jpg'],
            // ['email' => 'careplus18@example.com',   'role' => 'clinic', 'image' => 'careplus.jpg'],
            // ['email' => 'healthline44@example.com', 'role' => 'clinic', 'image' => 'healthline.jpg'],
            // ['email' => 'amanamed22@example.com',   'role' => 'clinic', 'image' => 'amanamed.jpg'],
            // ['email' => 'nourcare37@example.com',   'role' => 'clinic', 'image' => 'nourcare.jpg'],
            // ['email' => 'eliteclinic86@example.com','role' => 'clinic', 'image' => 'eliteclinic.jpg'],
            // ['email' => 'familymed09@example.com',  'role' => 'clinic', 'image' => 'familymed.jpg'],
            // ['email' => 'harmony55@example.com',    'role' => 'clinic', 'image' => 'harmony.jpg'],
            // ['email' => 'cityhealth13@example.com', 'role' => 'clinic', 'image' => 'cityhealth.jpg'],
            // ['email' => 'royalmed88@example.com',   'role' => 'clinic', 'image' => 'royalmed.jpg'],
            // ['email' => 'primecare62@example.com',  'role' => 'clinic', 'image' => 'primecare.jpg'],
            // ['email' => 'safaclinic70@example.com', 'role' => 'clinic', 'image' => 'safaclinic.jpg'],
            // ['email' => 'trustmed29@example.com',   'role' => 'clinic', 'image' => 'trustmed.jpg'],
            // ['email' => 'greenlife47@example.com',  'role' => 'clinic', 'image' => 'greenlife.jpg'],
            // ['email' => 'zarqamed71@example.com',   'role' => 'clinic', 'image' => 'zarqamed.jpg'],
            // ['email' => 'blossomcare34@example.com','role' => 'clinic', 'image' => 'blossomcare.jpg'],
            // ['email' => 'eastpoint57@example.com',  'role' => 'clinic', 'image' => 'eastpoint.jpg'],
            // ['email' => 'bluehorizon62@example.com','role' => 'clinic', 'image' => 'bluehorizon.jpg'],
            // ['email' => 'familytouch93@example.com','role' => 'clinic', 'image' => 'familytouch.jpg'],


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

        // Only for testing purposes
        User::create([
            'id' => "pat1",
            'email' => 'patient@example.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'email_verified_at' => now(),
            'profile_image' => null,
        ]);
        User::create([
            'id' => "doc1",
            'email' => 'doctor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'email_verified_at' => now(),
            'profile_image' => null,
        ]);
        User::create([
            'id' => "cli1",
            'email' => 'clinic@example.com',
            'password' => Hash::make('password123'),
            'role' => 'clinic',
            'email_verified_at' => now(),
            'profile_image' => null,
        ]);
        User::create([
            'id' => "lab1",
            'email' => 'lab@example.com',
            'password' => Hash::make('password123'),
            'role' => 'lab',
            'email_verified_at' => now(),
            'profile_image' => null,
        ]);
    }
}
