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
            ['patient_email' => 'khalid@example.com',     'date' => Carbon::now()->addDays(3)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'mohsen@example.com',     'date' => Carbon::now()->addDays(5)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',      'date' => Carbon::now()->addDays(7)->format('Y-m-d'),  'status' => 'cancelled'],
            ['patient_email' => 'sara81@example.com',    'date' => Carbon::now()->addDays(2)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'yousef44@example.com',  'date' => Carbon::now()->addDays(6)->format('Y-m-d'),  'status' => 'booked'],

            ['patient_email' => 'nada33@example.com',    'date' => Carbon::now()->addDays(1)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'majdi27@example.com',   'date' => Carbon::now()->addDays(4)->format('Y-m-d'),  'status' => 'no-show'],
            ['patient_email' => 'farida66@example.com',  'date' => Carbon::now()->addDays(8)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'ammar95@example.com',   'date' => Carbon::now()->addDays(9)->format('Y-m-d'),  'status' => 'booked'],
            ['patient_email' => 'reem58@example.com',    'date' => Carbon::now()->addDays(11)->format('Y-m-d'), 'status' => 'cancelled'],

            ['patient_email' => 'tareq71@example.com',   'date' => Carbon::now()->addDays(12)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'hala54@example.com',    'date' => Carbon::now()->addDays(10)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'mohammed42@example.com','date' => Carbon::now()->addDays(14)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'jasmine22@example.com', 'date' => Carbon::now()->addDays(15)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'bilal69@example.com',   'date' => Carbon::now()->addDays(13)->format('Y-m-d'), 'status' => 'no-show'],

            ['patient_email' => 'khalid@example.com',     'date' => Carbon::now()->addDays(16)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'mohsen@example.com',     'date' => Carbon::now()->addDays(17)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',      'date' => Carbon::now()->addDays(18)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'sara81@example.com',    'date' => Carbon::now()->addDays(19)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'yousef44@example.com',  'date' => Carbon::now()->addDays(20)->format('Y-m-d'), 'status' => 'booked'],

            ['patient_email' => 'nada33@example.com',    'date' => Carbon::now()->addDays(21)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'majdi27@example.com',   'date' => Carbon::now()->addDays(22)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'farida66@example.com',  'date' => Carbon::now()->addDays(23)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ammar95@example.com',   'date' => Carbon::now()->addDays(24)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'reem58@example.com',    'date' => Carbon::now()->addDays(25)->format('Y-m-d'), 'status' => 'cancelled'],

            ['patient_email' => 'tareq71@example.com',   'date' => Carbon::now()->addDays(26)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'hala54@example.com',    'date' => Carbon::now()->addDays(27)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'mohammed42@example.com','date' => Carbon::now()->addDays(28)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'jasmine22@example.com', 'date' => Carbon::now()->addDays(29)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'bilal69@example.com',   'date' => Carbon::now()->addDays(30)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'khalid@example.com',     'date' => Carbon::now()->addDays(31)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'mohsen@example.com',     'date' => Carbon::now()->addDays(32)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',      'date' => Carbon::now()->addDays(33)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',    'date' => Carbon::now()->addDays(34)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(35)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',    'date' => Carbon::now()->addDays(36)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',   'date' => Carbon::now()->addDays(37)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(38)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(39)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(40)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(41)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(42)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(43)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(44)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(45)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(46)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(47)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(48)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(49)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(50)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(51)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(52)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(53)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(54)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(55)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(56)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(57)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(58)->format('Y-m-d'), 'status' => 'cancelled'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(59)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(60)->format('Y-m-d'), 'status' => 'booked'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(61)->format('Y-m-d'), 'status' => 'no-show'],
            ['patient_email' => 'ahmed@example.com',  'date' => Carbon::now()->addDays(62)->format('Y-m-d'), 'status' => 'booked'],
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