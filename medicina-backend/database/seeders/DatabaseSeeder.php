<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            InsuranceSeeder::class,
            PatientSeeder::class,
            SpecialtySeeder::class,
            DoctorSeeder::class,
            DoctorSpecialtySeeder::class,
            ClinicSeeder::class,
            ClinicDoctorSeeder::class,
            AppointmentSeeder::class,
            InsuranceClinicSeeder::class,
            LabSeeder::class,
            AdminSeeder::class,
        ]);
    }
}
