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
    
    public function labResult() {
        return $this->belongsTo(LabResult::class, 'lab_result_id');
    }
    
    public function doctor() {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'user_id');
    }
    
    public function patient() {
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }
}
