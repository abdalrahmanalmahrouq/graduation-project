<?php

namespace App\Http\Controllers\SessionControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset email
     */
    public function sendResetLinkEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email'
        ], [
            'email.required' => 'عنوان البريد الإلكتروني مطلوب.',
            'email.email' => 'يرجى تقديم عنوان بريد إلكتروني صحيح.',
            'email.exists' => 'لا يوجد حساب بهذا العنوان.'
        ]);

            $user = User::where('email', $request->email)->first();
            
            // Generate reset token
            $resetToken = Str::random(64);
            $expiresAt = now()->addMinutes(60); // Token expires in 1 hour
            
            // Store token in database
            $user->update([
                'password_reset_token' => $resetToken,
                'password_reset_token_expires_at' => $expiresAt
            ]);

            // Send reset email (will fail silently if no mail config)
            try {
                Mail::send('emails.password-reset', [
                    'user' => $user,
                    'resetToken' => $resetToken,
                    'resetUrl' => env('FRONTEND_URL', 'http://localhost:3000') . '/#/reset-password/' . $resetToken
                ], function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('إعادة تعيين كلمة المرور - Medicina');
                });
                
                $emailSent = true;
                $message = 'تم إرسال رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.';
            } catch (\Exception $e) {
                // Email sending failed (no credentials), continue without email
                $emailSent = false;
                $message = 'تم إنشاء رمز إعادة تعيين كلمة المرور. (إرسال البريد الإلكتروني معطل للتطوير)';
            }

            return response()->json([
                'message' => $message,
                'email_sent' => $emailSent,
                'token' => $emailSent ? null : $resetToken // Only return token if email wasn't sent
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify reset token
     */
    public function verifyResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $user = User::where('password_reset_token', $request->token)
                   ->where('password_reset_token_expires_at', '>', now())
                   ->first();

        if (!$user) {
            return response()->json([
                'valid' => false,
                'message' => 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية.'
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'message' => 'رمز إعادة التعيين صحيح.',
            'email' => $user->email
        ]);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed'
        ], [
            'password.required' => 'كلمة المرور مطلوبة.',
            'password.min' => 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
            'password.confirmed' => 'تأكيد كلمة المرور غير متطابق.'
        ]);

        $user = User::where('email', $request->email)
                   ->where('password_reset_token', $request->token)
                   ->where('password_reset_token_expires_at', '>', now())
                   ->first();

        if (!$user) {
            return response()->json([
                'message' => 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية.'
            ], 400);
        }

        // Update password and clear reset token
        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_token_expires_at' => null
        ]);

        return response()->json([
            'message' => 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
        ]);
    }
}
