<?php

namespace Database\Seeders;

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
            $patientData = [];
            
            // Match patient data based on email
            switch ($user->email) {
                case 'john@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'John Doe',
                        'phone_number' => '+1234567890',
                        'date_of_birth' => '1990-05-15',
                        'address' => '123 Main Street, New York, NY 10001',
                    ];
                    break;
                    
                case 'jane@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Jane Smith',
                        'phone_number' => '+1234567891',
                        'date_of_birth' => '1985-08-22',
                        'address' => '456 Oak Avenue, Los Angeles, CA 90210',
                    ];
                    break;
                    
                case 'ahmed@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Ahmed Hassan',
                        'phone_number' => '+1234567892',
                        'date_of_birth' => '1992-12-10',
                        'address' => '789 Pine Road, Chicago, IL 60601',
                    ];
                    break;
            }
            
            if (!empty($patientData)) {
                Patient::create($patientData);
            }
        }
        

       

        
    }
    
}
