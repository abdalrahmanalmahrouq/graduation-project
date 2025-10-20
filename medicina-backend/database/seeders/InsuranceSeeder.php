<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Insurance;

class InsuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $insurancesData = [
            ['insurance_id' => 1, 'name' => 'GIG Insurance'],
            ['insurance_id' => 2, 'name' => 'Al-nisr Al-Arabi Insurance'],
            ['insurance_id' => 3, 'name' => 'Metlife Insurance'],
        ];
        // DB::table('insurances')->insert([
        //     ['insurance_id' => 1, 'name' => 'GIG Insurance'],
        //     ['insurance_id' => 2, 'name' => 'Al-nisr Al-Arabi Insurance'],
        //     ['insurance_id' => 3, 'name' => 'Metlife Insurance'],
        // ];
        foreach ($insurancesData as $data) {
            Insurance::create($data);
        }
}
}