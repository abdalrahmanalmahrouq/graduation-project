<?php

namespace App\Services;

use App\Models\Insurance;
use App\Models\Clinic;

class InsuranceService
{
    /**
     * Get all insurance companies
     */
    public function getAllInsurances()
    {
        return Insurance::select('insurance_id', 'name', 'logo_path')
            ->orderBy('name')
            ->get()
            ->makeHidden(['logo_path']);
    }

    /**
     * Get insurances for a specific clinic
     */
    public function getInsurancesForClinic(Clinic $clinic)
    {
        return $clinic->insurances()
            ->wherePivotNull('deleted_at')
            ->get(['insurances.insurance_id', 'insurances.name', 'insurances.logo_path'])
            ->makeHidden(['logo_path']);
    }

    /**
     * Add insurance to clinic
     */
    public function addInsuranceForClinic(Clinic $clinic, string $insuranceId): array
    {
        // Try to restore if soft deleted
        $updated = \DB::table('insurances_clinics')
            ->where('clinic_id', $clinic->user_id)
            ->where('insurance_id', $insuranceId)
            ->whereNotNull('deleted_at')
            ->update([
                'deleted_at' => null,
                'updated_at' => now()
            ]);
        if ($updated) {
            return [
                'success' => true,
                'message' => 'تم استرجاع شركة التأمين بنجاح',
                'restored' => true
            ];
        }

        // Check if already exists and active
        $exists = \DB::table('insurances_clinics')
            ->where('clinic_id', $clinic->user_id)
            ->where('insurance_id', $insuranceId)
            ->whereNull('deleted_at')
            ->exists();
        if ($exists) {
            return [
                'success' => false,
                'message' => 'Insurance already added.',
                'duplicate' => true
            ];
        }

        // Attach new insurance
        $clinic->insurances()->attach($insuranceId, [
            'created_at' => now(),
            'updated_at' => now()
        ]);
        return [
            'success' => true,
            'message' => 'تم إضافة شركة التأمين بنجاح',
            'added' => true
        ];
    }

    /**
     * Soft delete insurance from clinic
     */
    public function deleteInsuranceForClinic(Clinic $clinic, string $insuranceId): array
    {
        $updated = $clinic->insurances()->updateExistingPivot($insuranceId, [
            'deleted_at' => now()
        ]);

        return [
            'success' => $updated > 0,
            'message' => $updated > 0 ? 'تم حذف شركة التأمين بنجاح' : 'فشل في حذف شركة التأمين',
            'deleted' => $updated > 0
        ];
    }
}
