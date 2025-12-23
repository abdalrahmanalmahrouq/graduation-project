<?php
namespace App\Helpers;

class ValidationRules
{
    /**
     * Get password validation rules
     */
    public static function password(): array
    {
        return [
            'required',
            'min:8',
            'confirmed',
            'regex:/^[A-Z]/',
            'regex:/[0-9]/',
            'regex:/[!@#$%^&*(),.?":{}|<>]/',
        ];
    }

    public static function passwordWithoutConfirmed(): array
{
    return [
        'required',
        'min:8',
        'regex:/^[A-Z]/',
        'regex:/[0-9]/',
        'regex:/[!@#$%^&*(),.?":{}|<>]/',
    ];
}

public static function phoneNumber(): array
{
    return [
        'required',
        'regex:/^07[0-9]{8}$/',
    ];
}

    /**
     * Get password validation messages
     */
    public static function passwordMessages(): array
    {
        return [
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون على الأقل 8 أحرف',
            'password.regex' => 'كلمة المرور يجب أن تبدأ بحرف كبير، وتحتوي على رقم واحد ورمز خاص واحد على الأقل',
            'password.confirmed' => 'كلمة المرور وتأكيدها غير متطابقتين',
        ];
    }
}

