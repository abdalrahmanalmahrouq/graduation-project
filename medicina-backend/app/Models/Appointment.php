<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $guarded = [];
 
    
    public function patient(){
        return $this->belongsTo(Patient::class);

    }

    public function doctor(){
        return $this->belongsTo(Doctor::class);
    }

    public function clinic(){
        return $this->belongsTo(Clinic::class);
    }
}
