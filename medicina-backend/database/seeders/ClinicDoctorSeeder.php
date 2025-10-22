<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\User;
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
            ['clinic_email' => 'alzayed@example.com', 'doctor_emails' => ['omar@example.com', 'ali@example.com', 'fatima@example.com']],
            
            // Health Plus Clinic - Cardiology and Pediatrics
            ['clinic_email' => 'healthplus@example.com', 'doctor_emails' => ['omar@example.com', 'fatima@example.com']],
            
            // Al-Noor Clinic - Neurology and Pediatrics
            ['clinic_email' => 'alnoor@example.com', 'doctor_emails' => ['ali@example.com', 'fatima@example.com']],
        ];

        foreach ($relationships as $relationship) {
            // Find clinic by user email
            $clinicUser = User::where('email', $relationship['clinic_email'])->first();
            $clinic = $clinics->where('user_id', $clinicUser->id)->first();
            
            if ($clinic) {
                foreach ($relationship['doctor_emails'] as $doctorEmail) {
                    // Find doctor by user email
                    $doctorUser = User::where('email', $doctorEmail)->first();
                    $doctor = $doctors->where('user_id', $doctorUser->id)->first();
                    
                    // Define a default weekly schedule (empty for seeding)
                    $schedule = [
                        'mon' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                        ],
                        'tue' => NULL,
                        'wed' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                        ],
                        'thu' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                            ],
                        'fri' => NULL,
                        'sat' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                            ],
                        'sun' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                        ],
                        'sat' => [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'break_start' => '12:00',
                            'break_end' => '13:00',
                            ],
                    ];
                    if ($doctor) {
                        DB::table('clinic_doctor')->insert([
                            'clinic_id' => $clinic->user_id,
                            'doctor_id' => $doctor->user_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                            'weekly_schedule' => json_encode($schedule), // Empty schedule for seeding
                        ]);
                    }
                }
            }
        }
    }
}
