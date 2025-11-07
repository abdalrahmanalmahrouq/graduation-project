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
                        'phone_number' => '0785515555',
                        'address' => 'Amman, Tla`a Al-ali',
                    ];
                    break;
                    
                case 'healthplus@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Health Plus Clinic',
                        'phone_number' => '0790115555',
                        'address' => 'Amman, 8th circle',
                    ];
                    break;
                    
                case 'alnoor@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Al-Noor Clinic',
                        'phone_number' => '0775554444',
                        'address' => 'Zarqa',
                    ];
                    break;
            }
            
            if (!empty($clinicData)) {
                Clinic::create($clinicData);
            }
        }

       
    }
}
