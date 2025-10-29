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
            ['name' => 'Jordan Insurance Company'],
            ['name' => 'MetLife Jordan'],
            ['name' => 'Middle East Insurance Company'],
            ['name' => 'Watania National Insurance Company'],
            ['name' => 'United Insurance Company PLC'],
            ['name' => 'Al Manara Insurance Company'],
            ['name' => 'Arabia Insurance Company – Jordan'],
            ['name' => 'Jerusalem Insurance Company'],
            ['name' => 'Al-Nisr Al-Arabi Insurance Company'],
            ['name' => 'Euro Arab Insurance Group'],
            ['name' => 'Arab Jordanian Insurance Group'],
            ['name' => 'Gulf Insurance Group – Jordan'],
            ['name' => 'Arab Assurers Insurance Company'],
            ['name' => 'Islamic Insurance Company'],
            ['name' => 'Jordan French Insurance Company'],
            ['name' => 'Delta Insurance Company'],
            ['name' => 'National Insurance Company'],
            ['name' => 'Mediterranean & Gulf Insurance Company'],
            ['name' => 'Solidarity First Insurance Company'],
            ['name' => 'Jordan International Insurance Company (Newton)'],
            ['name' => 'Arab Union International Insurance Company'],
            ['name' => 'Al Safwa Insurance Company'],
            ['name' => 'Holy Land Insurance Company'],
            ['name' => 'Philadelphia Insurance Company']
        ];
        foreach ($insurancesData as $data) {
            Insurance::create($data);
        }
    }
}
