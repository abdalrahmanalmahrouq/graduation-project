<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\User;
use App\Models\ClinicDoctor;
use Illuminate\Support\Facades\DB;

class ClinicDoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all clinics and doctors
        $clinics = Clinic::all();
        $doctors = Doctor::all();

        // Create clinic-doctor relationships
      $relationships = [

                ['clinic_email' => 'alzayed@example.com', 'doctor_emails' => [
                    'fatima@example.com', 'ali@example.com', 'omar@example.com'
                ]],

                ['clinic_email' => 'alnoor@example.com', 'doctor_emails' => [
                    'ali@example.com', 'omar@example.com'
                ]],

                ['clinic_email' => 'healthplus@example.com', 'doctor_emails' => [
                    'ali@example.com', 'omar@example.com', 'fatima@example.com'
                ]],

                ['clinic_email' => 'healthline44@example.com', 'doctor_emails' => [
                    'ahmad58@example.com', 'tasneem41@example.com', 'khaled05@example.com'
                ]],

                // ['clinic_email' => 'amanamed22@example.com', 'doctor_emails' => [
                //     'hala16@example.com', 'mustafa74@example.com'
                // ]],

                // ['clinic_email' => 'nourcare37@example.com', 'doctor_emails' => [
                //     'maria66@example.com', 'dina53@example.com', 'yousef29@example.com'
                // ]],

                // ['clinic_email' => 'eliteclinic86@example.com', 'doctor_emails' => [
                //     'salma81@example.com', 'ibrahim15@example.com'
                // ]],

                // ['clinic_email' => 'familymed09@example.com', 'doctor_emails' => [
                //     'hassan60@example.com', 'ward99@example.com', 'reem42@example.com'
                // ]],

                // ['clinic_email' => 'harmony55@example.com', 'doctor_emails' => [
                //     'saif33@example.com', 'hanan25@example.com'
                // ]],

                // ['clinic_email' => 'cityhealth13@example.com', 'doctor_emails' => [
                //     'adel49@example.com', 'maya93@example.com', 'rabia12@example.com'
                // ]],

                // ['clinic_email' => 'royalmed88@example.com', 'doctor_emails' => [
                //     'tareq67@example.com', 'issam21@example.com'
                // ]],

                // ['clinic_email' => 'primecare62@example.com', 'doctor_emails' => [
                //     'kareem19@example.com', 'farah01@example.com', 'majid39@example.com'
                // ]],

                // ['clinic_email' => 'safaclinic70@example.com', 'doctor_emails' => [
                //     'tamara84@example.com', 'ayman52@example.com'
                // ]],

                // ['clinic_email' => 'trustmed29@example.com', 'doctor_emails' => [
                //     'ali91@example.com', 'ziad46@example.com'
                // ]],

                // ['clinic_email' => 'trustmed29@example.com', 'doctor_emails' => [
                //     'najwa70@example.com'
                // ]], 

        ];




        $schedules = [

            // Schedule #1
            [
                'sunday' => ['start_time' => '09:00', 'end_time' => '15:00', 'break_start' => '12:00', 'break_end' => '12:30'],
                'monday' => ['start_time' => '10:00', 'end_time' => '18:00', 'break_start' => '13:00', 'break_end' => '14:00'],
                'tuesday' => [],
                'wednesday' => ['start_time' => '08:00', 'end_time' => '14:00', 'break_start' => '11:00', 'break_end' => '11:30'],
                'thursday' => ['start_time' => '12:00', 'end_time' => '20:00', 'break_start' => '16:00', 'break_end' => '16:30'],
                'friday' => [],
                'saturday' => [],
            ],

            // Schedule #2
            [
                'sunday' => [],
                'monday' => ['start_time' => '09:00', 'end_time' => '17:00', 'break_start' => '12:00', 'break_end' => '13:00'],
                'tuesday' => ['start_time' => '11:00', 'end_time' => '19:00', 'break_start' => '15:00', 'break_end' => '15:30'],
                'wednesday' => [],
                'thursday' => ['start_time' => '08:00', 'end_time' => '16:00', 'break_start' => '12:00', 'break_end' => '12:30'],
                'friday' => [],
                'saturday' => ['start_time' => '09:00', 'end_time' => '13:00', 'break_start' => '11:00', 'break_end' => '11:15'],
            ],

            // Schedule #3
            [
                'sunday' => ['start_time' => '10:00', 'end_time' => '16:00', 'break_start' => '13:00', 'break_end' => '13:30'],
                'monday' => [],
                'tuesday' => ['start_time' => '09:00', 'end_time' => '17:00', 'break_start' => '12:30', 'break_end' => '13:00'],
                'wednesday' => [],
                'thursday' => ['start_time' => '14:00', 'end_time' => '20:00', 'break_start' => '17:00', 'break_end' => '17:15'],
                'friday' => [],
                'saturday' => [],
            ],

            // Schedule #4
            [
                'sunday' => ['start_time' => '08:00', 'end_time' => '14:00', 'break_start' => '11:00', 'break_end' => '11:30'],
                'monday' => ['start_time' => '12:00', 'end_time' => '18:00', 'break_start' => '15:00', 'break_end' => '15:30'],
                'tuesday' => [],
                'wednesday' => ['start_time' => '09:00', 'end_time' => '13:00', 'break_start' => '11:00', 'break_end' => '11:15'],
                'thursday' => [],
                'friday' => [],
                'saturday' => ['start_time' => '13:00', 'end_time' => '17:00', 'break_start' => '15:00', 'break_end' => '15:15'],
            ],

            // Schedule #5
            [
                'sunday' => [],
                'monday' => [],
                'tuesday' => ['start_time' => '10:00', 'end_time' => '18:00', 'break_start' => '14:00', 'break_end' => '14:45'],
                'wednesday' => ['start_time' => '09:00', 'end_time' => '15:00', 'break_start' => '12:00', 'break_end' => '12:20'],
                'thursday' => [],
                'friday' => ['start_time' => '09:00', 'end_time' => '12:00', 'break_start' => '10:30', 'break_end' => '10:40'],
                'saturday' => [],
            ],

            // Schedule #6
            [
                'sunday' => ['start_time' => '11:00', 'end_time' => '19:00', 'break_start' => '15:00', 'break_end' => '16:00'],
                'monday' => [],
                'tuesday' => [],
                'wednesday' => ['start_time' => '10:00', 'end_time' => '16:00', 'break_start' => '13:00', 'break_end' => '13:20'],
                'thursday' => ['start_time' => '09:00', 'end_time' => '17:00', 'break_start' => '12:30', 'break_end' => '13:00'],
                'friday' => [],
                'saturday' => ['start_time' => '09:00', 'end_time' => '14:00', 'break_start' => '11:30', 'break_end' => '11:45'],
            ],

            // Schedule #7
            [
                'sunday' => ['start_time' => '09:00', 'end_time' => '13:00', 'break_start' => '11:00', 'break_end' => '11:10'],
                'monday' => ['start_time' => '14:00', 'end_time' => '20:00', 'break_start' => '17:00', 'break_end' => '17:20'],
                'tuesday' => [],
                'wednesday' => [],
                'thursday' => ['start_time' => '10:00', 'end_time' => '18:00', 'break_start' => '14:00', 'break_end' => '14:30'],
                'friday' => [],
                'saturday' => [],
            ],

            // Schedule #8
            [
                'sunday' => [],
                'monday' => ['start_time' => '08:00', 'end_time' => '14:00', 'break_start' => '11:00', 'break_end' => '11:20'],
                'tuesday' => ['start_time' => '13:00', 'end_time' => '19:00', 'break_start' => '16:00', 'break_end' => '16:20'],
                'wednesday' => ['start_time' => '09:00', 'end_time' => '17:00', 'break_start' => '12:30', 'break_end' => '13:10'],
                'thursday' => [],
                'friday' => [],
                'saturday' => ['start_time' => '10:00', 'end_time' => '16:00', 'break_start' => '13:00', 'break_end' => '13:15'],
            ],

            // Schedule #9
            [
                'sunday' => ['start_time' => '10:00', 'end_time' => '14:00', 'break_start' => '12:00', 'break_end' => '12:15'],
                'monday' => [],
                'tuesday' => [],
                'wednesday' => ['start_time' => '11:00', 'end_time' => '19:00', 'break_start' => '15:00', 'break_end' => '15:30'],
                'thursday' => ['start_time' => '08:00', 'end_time' => '16:00', 'break_start' => '12:00', 'break_end' => '12:15'],
                'friday' => [],
                'saturday' => [],
            ],

            // Schedule #10
            [
                'sunday' => ['start_time' => '12:00', 'end_time' => '20:00', 'break_start' => '16:00', 'break_end' => '16:40'],
                'monday' => ['start_time' => '09:00', 'end_time' => '13:00', 'break_start' => '11:00', 'break_end' => '11:10'],
                'tuesday' => [],
                'wednesday' => [],
                'thursday' => ['start_time' => '11:00', 'end_time' => '17:00', 'break_start' => '14:00', 'break_end' => '14:20'],
                'friday' => [],
                'saturday' => ['start_time' => '09:00', 'end_time' => '12:00', 'break_start' => '10:30', 'break_end' => '10:40'],
            ],

        ];

        $schedule = $schedules[array_rand($schedules)];


        foreach ($relationships as $relationship) {

            $clinicUser = User::where('email', $relationship['clinic_email'])->first();
            $clinic = $clinics->where('user_id', $clinicUser->id)->first();

            if ($clinic) {
                foreach ($relationship['doctor_emails'] as $doctorEmail) {

                    $doctorUser = User::where('email', $doctorEmail)->first();
                    $doctor = Doctor::where('user_id', $doctorUser->id)->first();

                    if ($doctor) {

                        // Assign random schedule
                        $schedule = $schedules[array_rand($schedules)];

                        ClinicDoctor::create([
                            'clinic_id' => $clinic->user_id,
                            'doctor_id' => $doctor->user_id,
                            'weekly_schedule' => $schedule,
                        ]);
            }
        }
    }
}


        // only for testing purposes
        // ClinicDoctor::create([
        //     'clinic_id' => 'cli1',
        //     'doctor_id' => 'doc1',
        //     'weekly_schedule' => [
        //         'sunday' => [],
        //         'monday' => [],
        //         'tuesday' => [],
        //         'wednesday' => [
        //             'start_time' => '09:00',
        //             'end_time' => '17:00',
        //             'break_start' => '12:00',
        //             'break_end' => '13:00',
        //         ],
        //         'thursday' => [
        //             'start_time' => '09:00',
        //             'end_time' => '17:00',
        //             'break_start' => '12:00',
        //             'break_end' => '13:00',
        //         ],
        //         'friday' => [],
        //         'saturday' => [],
        //     ],
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
    }
}