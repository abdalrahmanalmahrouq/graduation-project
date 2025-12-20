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

                case 'patient@example.com':
                    $patientData = [
                        'user_id' => $user->id,
                        'full_name' => 'Example Patient',
                        'phone_number' => '0790002222',
                        'date_of_birth' => '1995-03-25',
                        'address' => 'Irbid, Jordan',
                        'insurance_id'=>$insurance ? $insurance->insurance_id : null 
                    ];
                    break;

                    // ====================================
                    //            PATIENT DATA
                    // ====================================

                    case 'sara81@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Sara Al-Mansour',
                            'phone_number' => '0796811122',
                            'date_of_birth' => '1998-04-10',
                            'address' => 'Amman, Khalda',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'yousef44@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Yousef Al-Qudah',
                            'phone_number' => '0789442211',
                            'date_of_birth' => '1988-11-20',
                            'address' => 'Zarqa, New Zarqa',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'nada33@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Nada Al-Rawashdeh',
                            'phone_number' => '0797334411',
                            'date_of_birth' => '1995-03-12',
                            'address' => 'Amman, Jubeiha',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'majdi27@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Majdi Al-Dabbas',
                            'phone_number' => '0796275544',
                            'date_of_birth' => '1982-09-05',
                            'address' => 'Irbid, City Center',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'farida66@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Farida Al-Atrash',
                            'phone_number' => '0786664522',
                            'date_of_birth' => '1999-07-25',
                            'address' => 'Amman, Dahyet Al-Rasheed',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'ammar95@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Ammar Al-Zoubi',
                            'phone_number' => '0796958844',
                            'date_of_birth' => '1987-01-18',
                            'address' => 'Salt, Al-Tuwal',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'reem58@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Reem Al-Hassan',
                            'phone_number' => '0787589901',
                            'date_of_birth' => '1993-10-03',
                            'address' => 'Amman, Shmeisani',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'tareq71@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Tareq Al-Salem',
                            'phone_number' => '0797713202',
                            'date_of_birth' => '2000-06-14',
                            'address' => 'Jerash, Downtown',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'hala54@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Hala Al-Hayari',
                            'phone_number' => '0798544411',
                            'date_of_birth' => '1984-02-28',
                            'address' => 'Zarqa, Prince Hassan Street',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'mohammed42@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Mohammed Abu Zaid',
                            'phone_number' => '0789421133',
                            'date_of_birth' => '1979-12-30',
                            'address' => 'Amman, Marka',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'jasmine22@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Jasmine Al-Fayez',
                            'phone_number' => '0797228811',
                            'date_of_birth' => '2001-07-19',
                            'address' => 'Amman, Abu Nsair',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

                    case 'bilal69@example.com':
                        $patientData = [
                            'user_id' => $user->id,
                            'full_name' => 'Bilal Al-Hammouri',
                            'phone_number' => '0787693302',
                            'date_of_birth' => '1991-05-09',
                            'address' => 'Madaba, Al-Fiha',
                            'insurance_id' => $insurance ? $insurance->insurance_id : null
                        ];
                        break;

            }
            
            if (!empty($patientData)) {
                Patient::create($patientData);
            }
        }
        

       

        
    }
    
}
