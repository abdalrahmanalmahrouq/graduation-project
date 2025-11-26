<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class ClinicDoctor extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'clinic_doctor';
    protected $guarded = [];
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'weekly_schedule' => 'array',
    ];

    public static function idsFor(?string $doctorId, ?string $clinicId): array
    {
        return self::when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
                ->when($clinicId, fn($q) => $q->where('clinic_id', $clinicId))
                ->pluck('id')
                ->toArray();
    }

    public static function idsForEndPoint(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|string|exists:doctors,user_id',
            'clinic_id' => 'sometimes|string|exists:clinics,user_id',
        ]);
        $doctorId = $validated['doctor_id'] ?? null;
        $clinicId = $validated['clinic_id'] ?? null;
        return self::when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
                ->when($clinicId, fn($q) => $q->where('clinic_id', $clinicId))
                // ->get();
                ->pluck('id')
                ->toArray();
    }

    // Relationship with Clinic
    public function clinic(){
        // clinic_doctor.clinic_id stores the clinic's user_id (string), not the clinics.id PK
        return $this->belongsTo(Clinic::class, 'clinic_id', 'user_id');
    }

    // Relationship with Doctor
    public function doctor(){
        // clinic_doctor.doctor_id stores the doctor's user_id (string), so use user_id as owner key
        return $this->belongsTo(Doctor::class, 'doctor_id', 'user_id');
    }

    public function availableAppointments(){
        return $this->hasMany(AvailableAppointment::class, 'clinic_doctor_id', 'id');
    }    
}
