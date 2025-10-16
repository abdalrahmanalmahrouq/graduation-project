<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Clinic;
use App\Models\User;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all patients, doctors, and clinics
        $patients = Patient::all();
        $doctors = Doctor::all();
        $clinics = Clinic::all();

        // Create sample appointments
        $appointments = [
            // Past appointments (completed)
            [
                'patient_email' => 'john@example.com',
                'doctor_email' => 'omar@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'day' => Carbon::now()->subDays(5)->format('l'),
                'starting_time' => '09:00:00',
                'ending_time' => '10:00:00',
                'status' => 'completed'
            ],
            [
                'patient_email' => 'jane@example.com',
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->subDays(3)->format('l'),
                'starting_time' => '14:00:00',
                'ending_time' => '15:00:00',
                'status' => 'completed'
            ],
            [
                'patient_email' => 'ahmed@example.com',
                'doctor_email' => 'fatima@example.com',
                'clinic_email' => 'healthplus@example.com',
                'appointment_date' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'day' => Carbon::now()->subDays(1)->format('l'),
                'starting_time' => '10:30:00',
                'ending_time' => '11:30:00',
                'status' => 'completed'
            ],

            // Upcoming appointments (booked)
            [
                'patient_email' => 'john@example.com',
                'doctor_email' => 'omar@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(2)->format('l'),
                'starting_time' => '11:00:00',
                'ending_time' => '12:00:00',
                'status' => 'booked'
            ],
            [
                'patient_email' => 'jane@example.com',
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(4)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(4)->format('l'),
                'starting_time' => '15:30:00',
                'ending_time' => '16:30:00',
                'status' => 'booked'
            ],
            [
                'patient_email' => 'ahmed@example.com',
                'doctor_email' => 'fatima@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->addDays(6)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(6)->format('l'),
                'starting_time' => '09:30:00',
                'ending_time' => '10:30:00',
                'status' => 'booked'
            ],

            // Available appointments (not booked yet)
            [
                'patient_email' => null,
                'doctor_email' => 'omar@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->addDays(1)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(1)->format('l'),
                'starting_time' => '08:00:00',
                'ending_time' => '09:00:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '9:00:00',
                'ending_time' => '9:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '10:00:00',
                'ending_time' => '10:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '11:00:00',
                'ending_time' => '11:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '12:00:00',
                'ending_time' => '12:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '13:00:00',
                'ending_time' => '13:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '14:00:00',
                'ending_time' => '14:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '15:00:00',
                'ending_time' => '15:45:00',
                'status' => 'available'
            ],
            [
                'patient_email' => null,
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'day' => Carbon::now()->addDays(3)->format('l'),
                'starting_time' => '16:00:00',
                'ending_time' => '16:45:00',
                'status' => 'available'
            ],
            

            // Cancelled appointment
            [
                'patient_email' => 'john@example.com',
                'doctor_email' => 'omar@example.com',
                'clinic_email' => 'alzayed@example.com',
                'appointment_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'day' => Carbon::now()->subDays(2)->format('l'),
                'starting_time' => '10:00:00',
                'ending_time' => '11:00:00',
                'status' => 'cancelled'
            ],

            // No show appointment
            [
                'patient_email' => 'jane@example.com',
                'doctor_email' => 'ali@example.com',
                'clinic_email' => 'alnoor@example.com',
                'appointment_date' => Carbon::now()->subDays(4)->format('Y-m-d'),
                'day' => Carbon::now()->subDays(4)->format('l'),
                'starting_time' => '14:30:00',
                'ending_time' => '15:30:00',
                'status' => 'no_show'
            ],
        ];

        foreach ($appointments as $appointmentData) {
            // Find the doctor and clinic by user email
            $doctorUser = User::where('email', $appointmentData['doctor_email'])->first();
            $clinicUser = User::where('email', $appointmentData['clinic_email'])->first();
            
            if ($doctorUser && $clinicUser) {
                $doctor = $doctors->where('user_id', $doctorUser->id)->first();
                $clinic = $clinics->where('user_id', $clinicUser->id)->first();
                
                if ($doctor && $clinic) {
                    $appointment = [
                        'patient_id' => null,
                        'doctor_id' => $doctor->user_id,
                        'clinic_id' => $clinic->user_id,
                        'appointment_date' => $appointmentData['appointment_date'],
                        'day' => $appointmentData['day'],
                        'starting_time' => $appointmentData['starting_time'],
                        'ending_time' => $appointmentData['ending_time'],
                        'status' => $appointmentData['status'],
                    ];

                    // If patient email is provided, find the patient
                    if ($appointmentData['patient_email']) {
                        $patientUser = User::where('email', $appointmentData['patient_email'])->first();
                        if ($patientUser) {
                            $patient = $patients->where('user_id', $patientUser->id)->first();
                            if ($patient) {
                                $appointment['patient_id'] = $patient->user_id;
                            }
                        }
                    }

                    Appointment::create($appointment);
                }
            }
        }
    }
}
