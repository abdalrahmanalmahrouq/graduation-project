<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\User;
use App\Models\ClinicDoctor;
use Illuminate\Support\Facades\DB;

class ClinicDoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all clinics and doctors
        $clinics = Clinic::all();
        $doctors = Doctor::all();

        // Create clinic-doctor relationships
        $relationships = [
            // Alzayed Clinic - All doctors
            // ['clinic_email' => 'alzayed@example.com', 'doctor_emails' => ['omar@example.com', 'ali@example.com', 'fatima@example.com']],
            ['clinic_email' => 'alzayed@example.com', 'doctor_emails' => ['fatima@example.com']],
            
            // Health Plus Clinic - Cardiology and Pediatrics
            // ['clinic_email' => 'healthplus@example.com', 'doctor_emails' => ['omar@example.com', 'fatima@example.com']],
            ['clinic_email' => 'healthplus@example.com', 'doctor_emails' => ['omar@example.com']],
            
            // Al-Noor Clinic - Neurology and Pediatrics
            // ['clinic_email' => 'alnoor@example.com', 'doctor_emails' => ['ali@example.com', 'fatima@example.com']],
            ['clinic_email' => 'alnoor@example.com', 'doctor_emails' => ['ali@example.com']],

        ];

        foreach ($relationships as $relationship) {
            // Find clinic by user email
            $clinicUser = User::where('email', $relationship['clinic_email'])->first();
            $clinic = $clinics->where('user_id', $clinicUser->id)->first();
            
            if ($clinic) {
                foreach ($relationship['doctor_emails'] as $doctorEmail) {
                    // Find doctor by user email
                    $doctorUser = User::where('email', $doctorEmail)->first();
                    $doctor = Doctor::where('user_id', $doctorUser->id)->first();
                    
                    // Define a default weekly schedule (empty for seeding)
                    $schedule = [
                        'sunday' => [],
                        'monday' => [],
                        'tuesday' => NULL,
                        'wednesday' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                        ],
                        'thursday' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                            ],
                        'friday' => NULL,
                        'saturday' => [],
                    ];
                    if ($doctor) {
                        ClinicDoctor::create([
                            'clinic_id' => $clinic->user_id,
                            'doctor_id' => $doctor->user_id,
                            'weekly_schedule' => $schedule,
                        ]);
                    }
                }
            }
        }
    }
}