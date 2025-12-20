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
               // ================================
                //          CLINIC DATA
                // ================================

                case 'alzayed@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Alzayed Clinic',
                        'phone_number' => '0785515555',
                        'address' => 'Amman, Tla`a Al-ali',
                    ];
                    break;

                case 'alnoor@example.com':
                $clinicData = [
                    'user_id' => $user->id,
                    'clinic_name' => 'Alnoor Clinic',
                    'phone_number' => '0785515500',
                    'address' => 'Amman, Khalda',
                ];
                break;

                case 'healthplus@example.com':
                $clinicData = [
                    'user_id' => $user->id,
                    'clinic_name' => 'HealthPlus Clinic',
                    'phone_number' => '0785515599',
                    'address' => 'Amman, Sweileh',
                ];
                break;

                case 'shifa92@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Shifa Medical Center',
                        'phone_number' => '0795920011',
                        'address' => 'Amman, Khalda',
                    ];
                    break;

                case 'careplus18@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'CarePlus Clinic',
                        'phone_number' => '0795118822',
                        'address' => 'Amman, Sweifieh',
                    ];
                    break;

                case 'healthline44@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'HealthLine Clinic',
                        'phone_number' => '0787445566',
                        'address' => 'Amman, Abdoun',
                    ];
                    break;

                case 'amanamed22@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Amana Medical Clinic',
                        'phone_number' => '0795523311',
                        'address' => 'Amman, University Street',
                    ];
                    break;

                case 'nourcare37@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'NourCare Clinic',
                        'phone_number' => '0796372211',
                        'address' => 'Amman, Jubeiha',
                    ];
                    break;

                case 'eliteclinic86@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Elite Clinic',
                        'phone_number' => '0786864411',
                        'address' => 'Amman, Rabieh',
                    ];
                    break;

                case 'familymed09@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'FamilyMed Center',
                        'phone_number' => '0796092215',
                        'address' => 'Amman, Hashimi Al-Janoubi',
                    ];
                    break;

                case 'harmony55@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Harmony Clinic',
                        'phone_number' => '0795559921',
                        'address' => 'Amman, Dabouq',
                    ];
                    break;

                case 'cityhealth13@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'CityHealth Clinic',
                        'phone_number' => '0797134488',
                        'address' => 'Amman, Mecca Street',
                    ];
                    break;

                case 'royalmed88@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'RoyalMed Clinic',
                        'phone_number' => '0797880023',
                        'address' => 'Amman, Seventh Circle',
                    ];
                    break;

                case 'primecare62@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'PrimeCare Clinic',
                        'phone_number' => '0786623344',
                        'address' => 'Amman, Khalda – Wasfi Street',
                    ];
                    break;

                case 'safaclinic70@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Al-Safa Clinic',
                        'phone_number' => '0797701125',
                        'address' => 'Amman, Al-Bayader',
                    ];
                    break;

                case 'trustmed29@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'TrustMed Clinic',
                        'phone_number' => '0787293301',
                        'address' => 'Amman, Marka',
                    ];
                    break;

                case 'greenlife47@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'GreenLife Clinic',
                        'phone_number' => '0798474499',
                        'address' => 'Amman, Abu Nsair',
                    ];
                    break;


                case 'zarqamed71@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'ZarqaMed Clinic',
                        'phone_number' => '0787711122',
                        'address' => 'Zarqa, New Zarqa',
                    ];
                    break;

                case 'blossomcare34@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'BlossomCare Clinic',
                        'phone_number' => '0797342211',
                        'address' => 'Zarqa, Russeifa',
                    ];
                    break;

                case 'eastpoint57@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'EastPoint Medical Center',
                        'phone_number' => '0787573302',
                        'address' => 'Zarqa, Al-Ghweirieh',
                    ];
                    break;

                case 'bluehorizon62@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'BlueHorizon Clinic',
                        'phone_number' => '0797624488',
                        'address' => 'Zarqa, Al-Dahiya',
                    ];
                    break;

                case 'familytouch93@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'FamilyTouch Clinic',
                        'phone_number' => '0787935501',
                        'address' => 'Zarqa, Prince Mohammad Street',
                    ];
                    break;

                case 'clinic@example.com':
                    $clinicData = [
                        'user_id' => $user->id,
                        'clinic_name' => 'Example Clinic',
                        'phone_number' => '0791231234',
                        'address' => 'Irbid, Jordan',
                    ];
                    break;
            }
            
            if (!empty($clinicData)) {
                Clinic::create($clinicData);
            }
        }

       
    }
}
