<?php

namespace App\Enums;

enum SpecialtyCategory: string
{
    case INTERNAL_MEDICINE = 'internal_medicine';
    case GENERAL_SURGERY = 'general_surgery';
    case PEDIATRICS = 'pediatrics';
    case OBSTETRICS_GYNECOLOGY = 'obstetrics_gynecology';
    case FAMILY_MEDICINE = 'family_medicine';
    case EMERGENCY_MEDICINE = 'emergency_medicine';
    case ANESTHESIOLOGY = 'anesthesiology';
    case DERMATOLOGY = 'dermatology';
    case OPHTHALMOLOGY = 'ophthalmology';
    case ORTHOPEDIC_SURGERY = 'orthopedic_surgery';
    case PSYCHIATRY = 'psychiatry';
    case RADIOLOGY = 'radiology';
    case NEUROLOGY = 'neurology';
    case UROLOGY = 'urology';
    case ENT = 'ent';
    case DENTISTRY = 'dentistry';

    /**
     * Get the localized label for the category
     */
    public function label(): string
    {
        return match($this) {
            self::INTERNAL_MEDICINE => app()->getLocale() === 'ar' ? 'الطب الباطني' : 'Internal Medicine',
            self::GENERAL_SURGERY => app()->getLocale() === 'ar' ? 'الجراحة العامة' : 'General Surgery',
            self::PEDIATRICS => app()->getLocale() === 'ar' ? 'طب الأطفال' : 'Pediatrics',
            self::OBSTETRICS_GYNECOLOGY => app()->getLocale() === 'ar' ? 'طب النساء والتوليد' : 'Obstetrics & Gynecology',
            self::FAMILY_MEDICINE => app()->getLocale() === 'ar' ? 'طب الأسرة' : 'Family Medicine',
            self::EMERGENCY_MEDICINE => app()->getLocale() === 'ar' ? 'طب الطوارئ' : 'Emergency Medicine',
            self::ANESTHESIOLOGY => app()->getLocale() === 'ar' ? 'تخدير وعناية مركزة' : 'Anesthesiology',
            self::DERMATOLOGY => app()->getLocale() === 'ar' ? 'الأمراض الجلدية' : 'Dermatology',
            self::OPHTHALMOLOGY => app()->getLocale() === 'ar' ? 'طب وجراحة العيون' : 'Ophthalmology',
            self::ORTHOPEDIC_SURGERY => app()->getLocale() === 'ar' ? 'جراحة العظام' : 'Orthopedic Surgery',
            self::PSYCHIATRY => app()->getLocale() === 'ar' ? 'الطب النفسي' : 'Psychiatry',
            self::RADIOLOGY => app()->getLocale() === 'ar' ? 'الأشعة والتصوير الطبي' : 'Radiology',
            self::NEUROLOGY => app()->getLocale() === 'ar' ? 'طب الأعصاب' : 'Neurology',
            self::UROLOGY => app()->getLocale() === 'ar' ? 'جراحة المسالك البولية' : 'Urology',
            self::ENT => app()->getLocale() === 'ar' ? 'طب وجراحة الأنف والأذن والحنجرة' : 'ENT (Otolaryngology)',
            self::DENTISTRY => app()->getLocale() === 'ar' ? 'طب الأسنان' : 'Dentistry',
        };
    }

    /**
     * Get all categories as array with labels
     */
    public static function options(): array
    {
        return collect(self::cases())->mapWithKeys(fn($case) => [
            $case->value => $case->label()
        ])->toArray();
    }
}
