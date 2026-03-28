<?php

namespace App\Models;

use App\Enums\SpecialtyCategory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $fillable = [
        'name_en',
        'name_ar',
        'category',
        'description_en',
        'description_ar',
        'is_active',
    ];

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
