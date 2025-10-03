<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\User;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get doctor users
        $doctorUsers = User::where('role', 'doctor')->get();

        $doctorData = [
            [
                'user_id' => $doctorUsers[0]->id,
                'full_name' => 'Dr. Omar',
                'phone_number' => '+1987654321',
                'specialization' => 'Cardiology',
            ],
            [
                'user_id' => $doctorUsers[1]->id,
                'full_name' => 'Dr. Ali',
                'phone_number' => '+1987654322',
                'specialization' => 'Neurology',
            ],
            [
                'user_id' => $doctorUsers[2]->id,
                'full_name' => 'Dr. Fatima Al-Zahra',
                'phone_number' => '+1987654323',
                'specialization' => 'Pediatrics',
            ],
        ];

        foreach ($doctorData as $doctor) {
            Doctor::create($doctor);
        }

     
       
    }
}
