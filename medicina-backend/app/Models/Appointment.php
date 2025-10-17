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

    // Each appointment has one doctor
    public function doctor(){
        return $this->belongsTo(Doctor::class, 'doctor_id','user_id');
    }

    // Each appointment has one clinic
    public function clinic(){
        return $this->belongsTo(Clinic::class, 'clinic_id','user_id');
    }
}
