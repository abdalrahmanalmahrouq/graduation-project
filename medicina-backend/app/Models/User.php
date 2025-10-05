<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Clinic;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The primary key type.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Generate a unique 7-character ID with lowercase letters and numbers.
     *
     * @return string
     */
    public function newUniqueId()
    {
        do {
            // Generate 7 characters with more numbers (50% numbers, 50% letters)
            $id = '';
            for ($i = 0; $i < 7; $i++) {
                if (rand(1, 10) <= 5) {
                    // 50% chance for numbers
                    $id .= rand(0, 9);
                } else {
                    // 50% chance for lowercase letters
                    $id .= chr(rand(97, 122)); // a-z
                }
            }
        } while (static::where('id', $id)->exists());

        return $id;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = $model->newUniqueId();
            }
        });
    }


    public function patient(){
        return $this->hasOne(Patient::class);
    }

    public function doctor(){
        return $this->hasOne(Doctor::class);
    }

    public function clinic(){
        return $this->hasOne(Clinic::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'password_reset_token',
    ];

    /**
     * Get the profile image URL or default image.
     *
     * @return string
     */
    public function getProfileImageUrlAttribute()
    {
        if ($this->profile_image) {
            // Extract filename from the storage path
            $filename = basename($this->profile_image);
            // Use direct public URL - hardcode localhost:8000 to avoid proxy issues
            return 'http://localhost:8000/profile-images/' . $filename;
        }
        
        // Return null if no profile image (frontend will handle placeholder)
        return null;
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_reset_token_expires_at' => 'datetime',
        'password' => 'hashed',
    ];
}
