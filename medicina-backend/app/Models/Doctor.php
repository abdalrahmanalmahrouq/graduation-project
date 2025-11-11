<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
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
    // each doctor has one user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    //Each doctor can belong to multiple clinics
    public function clinics(){
        return $this->belongsToMany(Clinic::class,'clinic_doctor', 'doctor_id', 'clinic_id', 'user_id', 'user_id');
    }

    // Each doctor can have many appointments
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id', 'user_id');
    }
   
}
