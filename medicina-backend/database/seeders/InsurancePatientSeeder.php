<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Insurance;
use App\Models\Patient;

class InsurancePatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all insurance IDs and patient user_ids from the database
        // Note: the pivot's foreign key references `patients.user_id` in your schema,
        // so we must insert matching `user_id` values here. Insurances use `id`.
        $insuranceIds = DB::table('insurances')->pluck('insurance_id')->toArray();
        $patientUserIds = DB::table('patients')->pluck('user_id')->toArray();

        // Build some random pivot rows (no hard-coded primary keys)
        $rows = [];
        for ($i = 0; $i < 7; $i++) {
            $rows[] = [
                'insurance_id' => $insuranceIds[array_rand($insuranceIds)],
                'patient_id' => $patientUserIds[array_rand($patientUserIds)],
            ];
        }

        DB::table('insurances_patients')->insert($rows);

    }
}
