<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all insurance and clinic IDs from the database
        $insuranceIds = DB::table('insurances')->pluck('insurance_id')->toArray();
        $clinicIds = DB::table('clinics')->pluck('user_id')->toArray();

        // Insert random data into the pivot table
        DB::table('insurances_clinics')->insert([
            ['id' => 1,'insurance_id' => $insuranceIds[array_rand($insuranceIds)], 'clinic_id' => $clinicIds[array_rand($clinicIds)]],
            ['id' => 2,'insurance_id' => $insuranceIds[array_rand($insuranceIds)], 'clinic_id' => $clinicIds[array_rand($clinicIds)]],
            ['id' => 3,'insurance_id' => $insuranceIds[array_rand($insuranceIds)], 'clinic_id' => $clinicIds[array_rand($clinicIds)]],
            ['id' => 4,'insurance_id' => $insuranceIds[array_rand($insuranceIds)], 'clinic_id' => $clinicIds[array_rand($clinicIds)]],
            ['id' => 5,'insurance_id' => $insuranceIds[array_rand($insuranceIds)], 'clinic_id' => $clinicIds[array_rand($clinicIds)]],
        ]);
    }
}
