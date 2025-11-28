<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicDoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    // this resource file is to customize the output of ClinicDoctor model not the weekly schedule seems organized .
    public function toArray(Request $request): array
    {
        $rawSchedule = $this->pivot->weekly_schedule;

        // 2. Define the strict order of days
        $orderedDays = [
            'saturday',
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday'
        ];

        // 3. Rebuild the array in the correct order
        $sortedSchedule = [];

        // If rawSchedule is null (data issue), handle it gracefully
        if (is_array($rawSchedule)) {
            foreach ($orderedDays as $day) {
                // Use the value from the DB, or default to null if missing
                $sortedSchedule[$day] = $rawSchedule[$day] ?? null;
            }
        }

        return [
            'doctor_id' => $this->id,
            'user_id' => $this->user_id,
            'full_name' => $this->full_name,
            'specialization' => $this->specialization,
            'phone_number' => $this->phone_number,
            'profile_image' => $this->user->profile_image ?? null,
            'profile_image_url' => $this->profile_image_url,
            'clinic_id' => $this->pivot->clinic_id,
            'weekly_schedule' => $sortedSchedule,
        ];
    }
}
