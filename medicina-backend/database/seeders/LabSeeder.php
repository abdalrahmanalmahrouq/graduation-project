<?php

namespace Database\Seeders;

use App\Models\Lab;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get lab users and create matching lab records
        $labUsers = User::where('role', 'lab')->get();

        foreach ($labUsers as $user) {
            $labData = [];
            
            // Match lab data based on email
            switch ($user->email) {
                case 'medlab@example.com':
                    $labData = [
                        'user_id' => $user->id,
                        'lab_name' => 'MedLab',
                        'phone_number' => '0791234567',
                        'address' => 'Amman, Jordan',
                    ];
                    break;
                case 'biolab@example.com':
                    $labData = [
                        'user_id' => $user->id,
                        'lab_name' => 'BioLab',
                        'phone_number' => '0797654321',
                        'address' => 'Amman, Jordan',
                    ];
                    break;
                }

            if (!empty($labData)) {
                Lab::create($labData);
            }
        }
    }
}
