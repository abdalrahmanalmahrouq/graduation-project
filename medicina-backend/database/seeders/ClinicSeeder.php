<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\User;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get clinic users and create matching clinic records
        $clinicUsers = User::where('role', 'clinic')->get();

        foreach ($clinicUsers as $user) {
            $clinicData = [];
            
            // Match clinic data based on email
            switch ($user->email) {
                case 'alzayed@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Alzayed Clinic',
                        'phone_number' => '+1555123456',
                        'address' => '100 Medical Plaza, Downtown, NY 10001',
                    ];
                    break;
                    
                case 'healthplus@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Health Plus Clinic',
                        'phone_number' => '+1555123457',
                        'address' => '250 Wellness Drive, Midtown, CA 90210',
                    ];
                    break;
                    
                case 'alnoor@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Al-Noor Clinic',
                        'phone_number' => '+1555123458',
                        'address' => '500 Healthcare Avenue, Uptown, IL 60601',
                    ];
                    break;
            }
            
            if (!empty($clinicData)) {
                Clinic::create($clinicData);
            }
        }

       
    }
}
