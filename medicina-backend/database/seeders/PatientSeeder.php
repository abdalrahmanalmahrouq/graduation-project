<?php

namespace Database\Seeders;

use App\Models\Insurance;
use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\User;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get patient users and create matching patient records
        $patientUsers = User::where('role', 'patient')->get();
        
        foreach ($patientUsers as $user) {
            $insurance= Insurance::inRandomOrder()->first();
           
            
            // Match patient data based on email
            switch ($user->email) {
                case 'khalid@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Khalid Al-ali',
                        'phone_number' => '0791122333',
                        'date_of_birth' => '1990-05-15',
                        'address' => 'Amman, swaileh',
                        'insurance_id'=>$insurance ? $insurance->insurance_id : null
                    ];
                    break;
                    
                case 'mohsen@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Mohsen Mansour',
                        'phone_number' => '0789988777',
                        'date_of_birth' => '1985-08-22',
                        'address' => 'Zarqa',
                        'insurance_id'=>$insurance ? $insurance->insurance_id : null 
                    ];
                    break;
                    
                case 'ahmed@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Ahmed Hassan',
                        'phone_number' => '0793322111',
                        'date_of_birth' => '1992-12-10',
                        'address' => 'Amman, 7th circle',
                        'insurance_id'=>$insurance ? $insurance->insurance_id : null 
                    ];
                    break;
            }
            
            if (!empty($patientData)) {
                Patient::create($patientData);
            }
        }
        

       

        
    }
    
}
