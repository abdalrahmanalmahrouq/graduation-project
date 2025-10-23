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
            ['name' => 'GIG Insurance'],
            ['name' => 'Al-nisr Al-Arabi Insurance'],
            ['name' => 'Metlife Insurance'],
        ];
        foreach ($insurancesData as $data) {
            Insurance::create($data);
        }
    }
}
