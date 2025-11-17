<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
    ];

    // notification belongs to user
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
