<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DoctorSpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds the doctor_specialty pivot table with predefined doctor-specialty relationships
     */
    public function run(): void
    {
        // Map doctor emails to specialty name (English)
        $doctorSpecialties = [
            'adel49@example.com' => 'General Dentistry',
            'ahmad58@example.com' => 'Ophthalmology',
            'ali91@example.com' => 'Neurology',
            'ali@example.com' => 'Neurology',
            'ayman52@example.com' => 'Otolaryngology (ENT)',
            'dina53@example.com' => 'Dermatology',
            'farah01@example.com' => 'Gastroenterology',
            'fatima@example.com' => 'Pediatrics',
            'firas88@example.com' => 'Orthopedic Surgery',
            'hala16@example.com' => 'Cardiology',
            'hanan25@example.com' => 'General Dentistry',
            'hassan60@example.com' => 'Obstetrics & Gynecology',
            'ibrahim15@example.com' => 'General Internal Medicine',
            'issam21@example.com' => 'Gastroenterology',
            'kareem19@example.com' => 'Gastroenterology',
            'khaled05@example.com' => 'Orthopedic Surgery',
            'lina82@example.com' => 'Pediatrics',
            'mahmoud11@example.com' => 'Ophthalmology',
            'majid39@example.com' => 'Otolaryngology (ENT)',
            'maria66@example.com' => 'Dermatology',
            'maya93@example.com' => 'Pulmonology',
            'mustafa74@example.com' => 'Dermatology',
            'najwa70@example.com' => 'Neurology',
            'nour92@example.com' => 'Cardiology',
            'omar@example.com' => 'Cardiology',
            'omar07@example.com' => 'Cardiology',
            'rabia12@example.com' => 'Pulmonology',
            'rana37@example.com' => 'Ophthalmology',
            'reem42@example.com' => 'Obstetrics & Gynecology',
            'saif33@example.com' => 'General Dentistry',
            'salma81@example.com' => 'General Internal Medicine',
            'sami44@example.com' => 'Pediatrics',
            'tamara84@example.com' => 'Otolaryngology (ENT)',
            'tareq67@example.com' => 'Pulmonology',
            'tasneem41@example.com' => 'Orthopedic Surgery',
            'ward99@example.com' => 'Obstetrics & Gynecology',
            'yousef29@example.com' => 'General Internal Medicine',
            'ziad46@example.com' => 'Neurology',
        ];

        foreach ($doctorSpecialties as $email => $specialtyName) {
            // Find user by email
            $user = User::where('email', $email)->first();

            if (!$user) {
                $this->command->warn("User not found for email: {$email}");
                continue;
            }

            // Find doctor by user_id
            $doctor = Doctor::where('user_id', $user->id)->first();

            if (!$doctor) {
                $this->command->warn("Doctor not found for user: {$email}");
                continue;
            }

            // Find specialty by name_en
            $specialty = Specialty::where('name_en', $specialtyName)->first();

            if (!$specialty) {
                $this->command->error("Specialty not found: {$specialtyName}");
                continue;
            }

            // Insert or update the relationship
            DB::table('doctor_specialty')->updateOrInsert(
                [
                    'doctor_id' => $doctor->user_id,
                    'specialty_id' => $specialty->id,
                ],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Doctor specialties seeded successfully!');
    }
}
