<?php

namespace App\Observers;

use App\Models\ClinicDoctor;
use App\Services\AvailableAppointmentService;
use Carbon\Carbon;

class ClinicDoctorObserver
{
    /**
     * Handle the ClinicDoctor "created" event.
     */
    public function created(ClinicDoctor $clinicDoctor): void
    {
        // Generate template weekday slots from the weekly_schedule (one row per weekday+time)
        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);
    }

    /**
     * Handle the ClinicDoctor "updated" event.
     */
    public function updated(ClinicDoctor $clinicDoctor): void
    {
        // On update, regenerate template weekday slots (will create missing weekday+time rows).
        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);
    }

    /**
     * Handle the ClinicDoctor "deleted" event.
     */
    public function deleted(ClinicDoctor $clinicDoctor): void
    {
        // On delete, remove template weekday slots.
        // AvailableAppointmentService::removeFromWeeklySchedule($clinicDoctor);
        $clinicDoctor->availableAppointments()->delete();
    }

    public function restored(ClinicDoctor $clinicDoctor): void
    {
        // On restore, regenerate template weekday slots.
        AvailableAppointmentService::generateFromWeeklySchedule($clinicDoctor);
    }
}
