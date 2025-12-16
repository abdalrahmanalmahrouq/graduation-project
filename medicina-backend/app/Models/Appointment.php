<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $guarded = [];

    
 
    // Each appointment has one patient
    public function patient(){
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }

    public function doctor()
    {
        return $this->hasOneThrough(
            Doctor::class,
            ClinicDoctor::class,
            'id', // Foreign key on clinic_doctor table
            'user_id', // Foreign key on doctors table
            'appointment_id', // Local key on appointments table
            'doctor_id' // Local key on clinic_doctor table
        );
      
    }

    // Each appointment has one clinic
    public function clinic(){
        return $this->belongsTo(Clinic::class, 'clinic_id','user_id');
    }

    // Each appointment has many lab results
    public function labResults(){
        return $this->hasMany(LabResult::class);
    }

    public function medicalRecord() {
        return $this->hasOne(MedicalRecord::class);
    }

    // Each appointment is linked to one available appointment slot
    public function availableAppointment(){
        // include soft-deleted slots so historical appointments still have their times/clinic
        return $this->belongsTo(AvailableAppointment::class, 'appointment_id', 'id')->withTrashed();
    }
}