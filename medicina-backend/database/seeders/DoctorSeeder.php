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
        // Get doctor users and create matching doctor records
        $doctorUsers = User::where('role', 'doctor')->get();

        foreach ($doctorUsers as $user) {
            $doctorData = [];
            
            // Match doctor data based on email
            switch ($user->email) {
                case 'omar@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Omar',
                        'phone_number' => '+1987654321',
                        'specialization' => 'Cardiology',
                    ];
                    break;
                    
                case 'ali@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Ali',
                        'phone_number' => '+1987654322',
                        'specialization' => 'Neurology',
                    ];
                    break;
                    
                case 'fatima@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Fatima Al-Zahra',
                        'phone_number' => '+1987654323',
                        'specialization' => 'Pediatrics',
                    ];
                    break;
            }
            
            if (!empty($doctorData)) {
                Doctor::create($doctorData);
            }
        }

     
       
    }
}
