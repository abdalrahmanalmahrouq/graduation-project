<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Insurance extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'insurance_id';

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
        } while (static::where('insurance_id', $id)->exists());

        return $id;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->insurance_id)) {
                $model->insurance_id = $model->newUniqueId();
            }
        });
    }

    // one insurance company has many patients 
    public function patients()
    {
        return $this->hasMany(Patient::class);
    }
    // one insurance company has many clinics 
    public function clinics()
    {
        return $this->belongsToMany(Clinic::class ,'insurances_clinics','insurance_id','clinic_id');
    }
}
