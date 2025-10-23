<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
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

    // Each patient belongs to user 
    public function user(){                //->patient //->user
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    // insurance has one 
    public function insurances()
    {
        return $this->belongsTo(Insurance::class);
    }
}
