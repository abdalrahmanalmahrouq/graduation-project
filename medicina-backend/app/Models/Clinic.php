<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'string',
    ];

    // Relationship with User
    // each clinic has one user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    //Each clinic can have multiple doctors
    public function doctors()
    {
        return $this->belongsToMany(Doctor::class, 'clinic_doctor', 'clinic_id', 'doctor_id', 'user_id', 'user_id')
            ->using(ClinicDoctor::class)
            ->withPivot(['weekly_schedule', 'created_at', 'updated_at', 'deleted_at'])
            ->withTimestamps();
    }

    public function insurances()
    {                   //first atribute insurances_clinics //second     //clinics table //insurances table
        return $this->belongsToMany(Insurance::class, 'insurances_clinics', 'clinic_id', 'insurance_id', 'user_id', 'insurance_id')
            ->withTimestamps()
            ->withPivot(['created_at', 'updated_at', 'deleted_at']);
    }


    //Each clinic can have multiple patients
    public function patients()
    {

        // here we use join query because we will jump throw 4 tables so we can't use hasManyThrough
        return Patient::query()
            ->join('appointments', 'patients.user_id', '=', 'appointments.patient_id')
            ->join('available_appointments', 'appointments.appointment_id', '=', 'available_appointments.id')
            ->join('clinic_doctor', 'available_appointments.clinic_doctor_id', '=', 'clinic_doctor.id')
            ->where('clinic_doctor.clinic_id', $this->user_id)
            ->select('patients.*')
            ->distinct();
    }





    public function appointments()
    {
        // here we use join query because we will jump throw 4 tables so we can't use hasManyThrough
        return Appointment::query()
            ->join('available_appointments', 'appointments.appointment_id', '=', 'available_appointments.id')
            ->join('clinic_doctor', 'available_appointments.clinic_doctor_id', '=', 'clinic_doctor.id')
            ->where('clinic_doctor.clinic_id', $this->user_id)
            ->select('appointments.*');
    }

    //Each clinic can have multiple available appointments
    public function availableAppointments()
    {
        return $this->hasManyThrough(AvailableAppointment::class, ClinicDoctor::class, 'clinic_id', 'clinic_doctor_id', 'user_id', 'id');
    }
}
