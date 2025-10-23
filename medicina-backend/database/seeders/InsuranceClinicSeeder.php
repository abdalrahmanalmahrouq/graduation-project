<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceClinicSeeder extends Seeder
{
    public function run(): void
    {
        // Get all insurance IDs and clinic IDs
        $insuranceIds = DB::table('insurances')->pluck('insurance_id');
        $clinicIds = DB::table('clinics')->pluck('user_id');

        // Simple loop to create random associations
        foreach ($insuranceIds as $insuranceId) {
            // randomly pick 1–3 clinics for each insurance
            $randomClinics = $clinicIds->random(rand(1, min(3, $clinicIds->count())));

            foreach ($randomClinics as $clinicId) {
                DB::table('insurances_clinics')->insert([
                    'insurance_id' => $insuranceId,
                    'clinic_id' => $clinicId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
