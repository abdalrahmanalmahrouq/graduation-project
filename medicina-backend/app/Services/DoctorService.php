<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;

class DoctorService
{
    /**
     * Filter doctors by category and specialty
     */
    public function filterDoctors(?string $category = null, ?string $specialty = null)
    {
        $query = Doctor::with('user:id,profile_image')
            ->whereHas('clinics');

        if ($category) {
            $query->whereHas('specialties', function ($query) use ($category) {
                $query->where('category', $category);
            });
        }

        if ($specialty) {
            $query->whereHas('specialties', function ($query) use ($specialty) {
                $query->where('slug', $specialty);
            });
        }

        return $query->get();
    }

    /**
     * Get doctor details by IDs
     */
    public function getDoctorById(string $doctorId): Doctor
    {
        return User::with('doctor')->findOrFail($doctorId)->doctor;
    }

    /**
     * Get doctor profile with clinics and insurance information
     */
    public function getDoctorProfile(string $doctorId)
    {
        return Doctor::where('user_id', $doctorId)
            ->with([
                'user:id,profile_image',
                'specialties:id,name_en,name_ar,slug',
                'clinics:id,clinic_name,address,user_id',
                'clinics.insurances:insurance_id,name'
            ])
            ->firstOrFail();
    }

    /**
     * Get clinics associated with the doctor
     */
    public function getDoctorClinics(string $doctorId)
    {
        return Doctor::where('user_id', $doctorId)
            ->with([
                'clinics:id,clinic_name,address,user_id,phone_number',
                'clinics.user:id,profile_image'
            ])
            ->firstOrFail();
    }

    /**
     * Update bio for doctor
     */
    public function updateDoctorBio(string $doctorId, string $bio)
    {
        return Doctor::where('user_id', $doctorId)->firstOrFail()
            ->update(['bio' => $bio]);
    }

    /**
     * Get all patients appointments with medical records for a doctor
     */
    public function getAllPatientsAppointmentsWithMedicalRecord(string $doctorId)
    {
        // 1. Start from Appointment Model (easier than defining complex joins on Doctor)
        $appointments = Appointment::query()

            // FILTER: Only appointments belonging to THIS Doctor
            // Chain: Appointment -> Slot -> Contract -> Doctor
            ->whereHas('availableAppointment.clinicDoctor', function ($q) use ($doctorId) {
                $q->where('doctor_id', $doctorId);
            })

            // FILTER: Active Patients only (Soft Delete Check)
            ->whereHas('patient.user', fn($u) => $u->whereNull('deleted_at'))

            // FILTER: Active Clinics only (Deep Soft Delete Check)
            // Chain: Slot -> Contract -> Clinic -> User
            ->whereHas('availableAppointment.clinicDoctor.clinic.user', fn($u) => $u->whereNull('deleted_at'))

            // EAGER LOAD: Get all the data
            ->with([
                'patient:user_id,full_name',
                'patient.user:id,profile_image',
                'medicalRecord',
                'medicalRecord.labResults',

                // Deep Load the Clinic Info so we can show "Clinic Name"
                'availableAppointment:id,clinic_doctor_id,day,starting_time,ending_time',
                'availableAppointment.clinicDoctor.clinic:user_id,clinic_name'
            ])
            ->orderBy('appointment_date', 'desc')
            ->get();

        // 2. Transform Data for Frontend
        // We need to move the deep 'clinic' data back to the top level
        // so your Frontend can still access `appointment.clinic.clinic_name`
        $appointments->transform(function ($appt) {
            // Shortcut to the deep data
            $slot = $appt->availableAppointment;
            $clinic = $slot?->clinicDoctor?->clinic;

            // A. Inject Time & Day directly into the Appointment object
            // This makes it compatible with your old Frontend code
            if ($slot) {
                $appt->day = $slot->day;
                $appt->starting_time = $slot->starting_time;
                $appt->ending_time = $slot->ending_time;
            }

            // B. Inject Clinic directly
            if ($clinic) {
                $appt->setRelation('clinic', $clinic);
            }

            // C. Cleanup: Remove the helper object to keep JSON clean
            unset($appt->availableAppointment);

            return $appt;
        });

        return $appointments;
    }
    // TODO: Review the above function
}
