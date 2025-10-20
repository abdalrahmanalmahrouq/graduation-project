<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function clinics()
    {
        return $this->hasMany(Clinic::class);
    }
}
