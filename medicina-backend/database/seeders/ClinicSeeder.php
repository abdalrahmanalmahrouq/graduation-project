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
        // Get clinic users
        $clinicUsers = User::where('role', 'clinic')->get();

        $clinicData = [
            [
                'user_id' => $clinicUsers[0]->id,
                'clinic_name' => 'Alzayed Clinic',
                'phone_number' => '+1555123456',
                'address' => '100 Medical Plaza, Downtown, NY 10001',
            ],
            [
                'user_id' => $clinicUsers[1]->id,
                'clinic_name' => 'Health Plus Clinic',
                'phone_number' => '+1555123457',
                'address' => '250 Wellness Drive, Midtown, CA 90210',
            ],
            [
                'user_id' => $clinicUsers[2]->id,
                'clinic_name' => 'Al-Noor Clinic',
                'phone_number' => '+1555123458',
                'address' => '500 Healthcare Avenue, Uptown, IL 60601',
            ],
        ];

        foreach ($clinicData as $clinic) {
            Clinic::create($clinic);
        }

       
    }
}
