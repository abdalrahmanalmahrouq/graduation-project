<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpsertClinicDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'clinic';
    }

    public function rules(): array
    {
        return [
            'doctor_id' => 'required|string|exists:doctors,user_id',
            'weekly_schedule' => 'required|array',
            'weekly_schedule.*.day' => 'sometimes|string|in:sunday,monday,tuesday,wednesday,thursday,friday,saturday',
            'weekly_schedule.*.start_time' => 'sometimes|date_format:H:i',
            'weekly_schedule.*.end_time' => 'sometimes|date_format:H:i',
            'weekly_schedule.*.break_start' => 'nullable|date_format:H:i',
            'weekly_schedule.*.break_end' => 'nullable|date_format:H:i',
        ];
    }
}
