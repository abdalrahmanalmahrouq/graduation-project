<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lab extends Model
{
    use HasFactory;

    protected $guarded=[];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'string',
    ];

    // Relationship with User
    // each lab has one user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
