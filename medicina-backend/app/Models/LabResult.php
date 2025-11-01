<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    use HasFactory;

    protected $table = 'lab_results';
    protected $fillable=[
        'lab_id',
        'patient_id',
        'status',
        'examination_title',
        'notes',
        'file_path',
        'approved_at',
        'rejected_at',
    ];
    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function lab(){
        return $this->belongsto(Lab::class, 'lab_id', 'user_id');
    }

    public function patient(){
        return $this->belongsto(Patient::class, 'patient_id', 'user_id');
    }
}
