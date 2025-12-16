<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;

class AvailableAppointment extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'available_appointments';
    protected $guarded = [];
    /**
     * Primary key is a string (custom 7-char id).
     */
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'clinic_doctor_id' => 'string',
        // day is stored as weekday key (e.g., 'mon', 'tue', 'wednesday')
        'day' => 'string',
        // starting_time is stored as H:i:s string
        'starting_time' => 'string',
    ]; 

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

    public function getEndingTimeAttribute()
    {
        // If the record already has an ending_time column filled, prefer it:
        if (! empty($this->attributes['ending_time'])) {
            return $this->attributes['ending_time'];
        }

        // Otherwise compute from starting_time + doctor's consultation_duration
        $duration = optional($this->clinicDoctor?->doctor)->consultation_duration ?: 30;
        if (empty($this->starting_time)) {
            return null;
        }

        // Use Carbon to add minutes and return H:i:s (or a Carbon instance as needed)
        return Carbon::createFromFormat('H:i:s', $this->starting_time)
                    ->addMinutes((int) $duration)
                    ->format('H:i:s');
    }

    /**
     * Find available appointment IDs that overlap or are close to a requested interval.
     *
     * @param string|null $startingTime
     * @param string|null $endingTime
     * @param int|null $tolerance
     * @param array|null $clinicDoctorIds
     * @return array
     */
    public static function idsFor(
        ?string $startingTime = null,
        ?string $endingTime = null,
        ?int $tolerance = 15,
        array $clinicDoctorIds,
    ): array {
        $query = self::query();

        // if (!empty($clinicDoctorIds)) {
            $query->whereIn('clinic_doctor_id', $clinicDoctorIds);
        // }
       if ($startingTime && $endingTime) {
            // CASE A: Range Search (Both provided)
            // Logic: "Show me everything that starts AFTER 9:00 AND ends BEFORE 12:00"
            $query->where('starting_time', '>=', $startingTime)
                  ->where('ending_time', '<=', $endingTime);
                  
        } elseif ($startingTime) {
            // CASE B: Target Start Search (Only start provided)
            // Logic: "Show me slots starting AROUND 9:00 (+/- 15 mins)"
            $lower = Carbon::createFromFormat('H:i:s', $startingTime)->subMinutes($tolerance)->format('H:i:s');
            $upper = Carbon::createFromFormat('H:i:s', $startingTime)->addMinutes($tolerance)->format('H:i:s');
            $query->whereBetween('starting_time', [$lower, $upper]);
            
        } elseif ($endingTime) {
            // CASE C: Target End Search (Only end provided)
            // Logic: "Show me slots ending AROUND 12:00 (+/- 15 mins)"
            $lower = Carbon::createFromFormat('H:i:s', $endingTime)->subMinutes($tolerance)->format('H:i:s');
            $upper = Carbon::createFromFormat('H:i:s', $endingTime)->addMinutes($tolerance)->format('H:i:s');
            $query->whereBetween('ending_time', [$lower, $upper]);
        }


        return $query->pluck('id')->toArray();
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
    
    // Relationship with ClinicDoctor
    public function clinicDoctor(){
        return $this->belongsTo(ClinicDoctor::class, 'clinic_doctor_id', 'id');
    }

    // Relationship with Appointment
    public function appointment(){
        return $this->hasMany(Appointment::class, 'appointment_id', 'id');
    }
}
