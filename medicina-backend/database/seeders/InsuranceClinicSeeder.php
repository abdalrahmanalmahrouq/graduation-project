<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceClinicSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Retrieve all Clinic IDs and Insurance IDs
        $clinicIds = DB::table('clinics')->pluck('user_id');
        $insuranceIds = DB::table('insurances')->pluck('insurance_id');

        // Safety Check: If no clinics or insurances exist, stop.
        if ($clinicIds->isEmpty() || $insuranceIds->isEmpty()) {
            $this->command->warn('No clinics or insurances found. Skipping seeder.');
            return;
        }

        // 2. Loop through EVERY clinic
        foreach ($clinicIds as $clinicId) {
            
            // 3. Pick 5 random insurances
            // (Use min() to handle cases where you have fewer than 5 insurances total)
            $countToPick = min(5, $insuranceIds->count());
            $randomInsurances = $insuranceIds->random($countToPick);

            // 4. Prepare the data array for this clinic
            $insertData = [];
            foreach ($randomInsurances as $insuranceId) {
                $insertData[] = [
                    'clinic_id'    => $clinicId,
                    'insurance_id' => $insuranceId,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ];
            }

            // 5. Bulk insert for this specific clinic
            // insertOrIgnore prevents crashing if a duplicate pair accidentally exists
            DB::table('insurances_clinics')->insertOrIgnore($insertData);

        // only for testing purposes
        // DB::table('insurances_clinics')->insert([
        //     'insurance_id' => 'ins1',
        //     'clinic_id' => 'cli1',
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
    }
}
}