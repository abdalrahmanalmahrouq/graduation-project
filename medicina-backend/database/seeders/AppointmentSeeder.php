<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use App\Models\AvailableAppointment;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get Patients Lookup
        // We map emails to IDs so we don't have to query DB inside the loop
        $patients = Patient::all(); 

        // 2. Define simplistic scenarios
        // Notice: NO Doctor, NO Clinic, NO Times, NO Day Names. Just Date + Patient.
        $bookings = [
            [
                'patient_email' => 'khalid@example.com',
                'date' => Carbon::now()->addDays(7)->next('Wednesday')->format('Y-m-d'), 
                'status' => 'booked'
            ],
            [
                'patient_email' => 'mohsen@example.com',
                'date' => Carbon::now()->addDays(7)->next('Thursday')->format('Y-m-d'),
                'status' => 'booked'
            ],
            [
                'patient_email' => 'ahmed@example.com',
                'date' => Carbon::now()->subDays(7)->next('Wednesday')->format('Y-m-d'),
                'status' => 'completed'
            ]
        ];

        foreach ($bookings as $booking) {
            // A. Get the Patient
            $patientUser = User::where('email', $booking['patient_email'])->first();
            if (!$patientUser) continue;
            
            $patient = $patients->where('user_id', $patientUser->id)->first();
            if (!$patient) continue;

            // B. Determine the Weekday from the Date (e.g., "2025-12-03" -> "wednesday")
            $dayName = strtolower(Carbon::parse($booking['date'])->format('l'));

            // C. Find a REAL Template (Slot) that matches this weekday
            // We pick one at random to simulate a patient choosing a specific time
            // NOTE: This assumes you ran ClinicDoctorSeeder first so templates exist!
            $template = AvailableAppointment::where('day', $dayName)
                ->inRandomOrder() // Pick any valid time (9:00, 10:30, etc.)
                ->first();

            if (!$template) {
                // dump("Skipping: No doctor works on $dayName to create a booking.");
                continue;
            }

            // D. Check if this specific date/slot is already booked to avoid duplicates in seeder
            $exists = Appointment::where('appointment_id', $template->id)
                ->where('appointment_date', $booking['date'])
                ->exists();

            if ($exists) {
                continue;
            }

            // E. Create the Appointment
            Appointment::create([
                'appointment_id' => $template->id, // Linking to real ID (e.g., cpd31q8)
                'patient_id' => $patient->user_id,
                'appointment_date' => $booking['date'],
                'status' => $booking['status']
            ]);
        }
    }
}