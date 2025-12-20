<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $guarded = [];

    
    public function appointment() {
        return $this->belongsTo(Appointment::class);
    }
    
    public function labResults() {
        return $this->belongsToMany(LabResult::class, 'medical_record_lab_result');
    }
    
    public function doctor() {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'user_id');
    }
    
    public function patient() {
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }
}
