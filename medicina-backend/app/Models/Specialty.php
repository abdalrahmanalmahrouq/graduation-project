<?php

namespace App\Models;

use App\Enums\SpecialtyCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Specialty extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'category',
        'description_en',
        'description_ar',
        'is_active',
    ];

    /**
     * Boot the model and auto-generate slug from name_en
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($specialty) {
            if (empty($specialty->slug) && !empty($specialty->name_en)) {
                $specialty->slug = Str::slug($specialty->name_en);
            }
        });

        static::updating(function ($specialty) {
            if ($specialty->isDirty('name_en')) {
                $specialty->slug = Str::slug($specialty->name_en);
            }
        });
    }

    protected $casts = [
        'is_active' => 'boolean',
        'category' => SpecialtyCategory::class,
    ];

    /**
     * Get localized name based on current locale
     */
    public function getNameAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    /**
     * Get localized description based on current locale
     */
    public function getDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }
    
    /**
     * Get localized category label
     */
    public function getCategoryLabelAttribute()
    {
        return $this->category?->label();
    }

    /**
     * Doctors with this specialty
     */
    public function doctors()
    {
        return $this->belongsToMany(Doctor::class, 'doctor_specialty', 'specialty_id', 'doctor_id', 'id', 'user_id');
    }

    /**
     * Scope to get only active specialties
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by category
     */
    public function scopeByCategory($query, SpecialtyCategory $category)
    {
        return $query->where('category', $category);
    }
}
