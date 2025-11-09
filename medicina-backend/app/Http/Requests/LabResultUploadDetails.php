<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LabResultUploadDetails extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $labResult = $this->route('labResult');
        return [
            'examination_title' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'appointment_id' => [
            'nullable',
            Rule::exists('appointments', 'id')
                ->where(function ($query) use ($labResult) {
                    $query->where('patient_id', $labResult->patient_id);
                }),
        ],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_id' => 'The appointment ID does not exist or does not belong to this patient',
        ];
    }
}
