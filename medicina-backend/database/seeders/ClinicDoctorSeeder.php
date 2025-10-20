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
                    
                    if ($doctor) {
                        DB::table('clinic_doctor')->insert([
                            'clinic_id' => $clinic->user_id,
                            'doctor_id' => $doctor->user_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                            'sunday_schedule' => '0900-1700',
                            'monday_schedule' => '0900-1700',
                            'tuesday_schedule' => '0900-1700',
                            'wednesday_schedule' => '0900-1700',
                            'thursday_schedule' => '0900-1700',
                            'friday_schedule' => '0900-1300',
                            'saturday_schedule' => '0000-0000',
                        ]);
                    }
                }
            }
        }
    }
}
