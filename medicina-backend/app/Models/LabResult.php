<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    use HasFactory;

    protected $table = 'lab_results';
    protected $fillable=[
        'lab_id',
        'patient_id',
        'status',
        'examination_title',
        'notes',
        'file_path',
        'approved_at',
        'rejected_at',
    ];
    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['file_url'];

    public function lab(){
        return $this->belongsto(Lab::class, 'lab_id', 'user_id');
    }

    public function patient(){
        return $this->belongsto(Patient::class, 'patient_id', 'user_id');
    }

    /**
     * Get the file URL for accessing the lab result file.
     *
     * @return string|null
     */
    public function getFileUrlAttribute()
    {
        if ($this->file_path) {
            // Use Laravel Storage to generate the correct URL
            // This works with the storage:link command (public/storage -> storage/app/public)
            return asset('storage/' . $this->file_path);
        }
        
        return null;
    }
}
