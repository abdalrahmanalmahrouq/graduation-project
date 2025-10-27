<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class InsuranceClinic extends Pivot
{
    use HasFactory, SoftDeletes;

    protected $table = 'insurances_clinics';
    
    protected $fillable = [
        'insurance_id',
        'clinic_id',
    ];

    protected $dates = ['deleted_at'];
}
