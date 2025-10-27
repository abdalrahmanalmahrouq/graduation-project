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
    public function doctors(){
        return $this->belongsToMany(Doctor::class,'clinic_doctor', 'clinic_id', 'doctor_id', 'user_id', 'user_id');
    }

    public function insurances(){                   //first atribute insurances_clinics //second     //clinics table //insurances table
        return $this->belongsToMany(Insurance::class,'insurances_clinics','clinic_id','insurance_id','user_id','insurance_id')
            ->withTimestamps()
            ->withPivot(['created_at', 'updated_at', 'deleted_at']);
    }
}
