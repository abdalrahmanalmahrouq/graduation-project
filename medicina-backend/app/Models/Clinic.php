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

    //Each clinic can have multiple doctors
    public function doctors(){
        return $this->belongsToMany(Doctor::class,'clinic_doctor', 'clinic_id', 'doctor_id', 'user_id', 'user_id');
    }
}
