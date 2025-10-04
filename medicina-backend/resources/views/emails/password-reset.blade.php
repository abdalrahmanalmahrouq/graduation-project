<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور - Medicina</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Tajawal', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
            direction: rtl;
            text-align: right;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .security-info {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        .security-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .security-text {
            color: #78350f;
            font-size: 14px;
            line-height: 1.5;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .footer-link {
            color: #3b82f6;
            text-decoration: none;
        }
        .footer-link:hover {
            text-decoration: underline;
        }
        .expiry-info {
            background: #ecfdf5;
            border: 1px solid #d1fae5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .expiry-text {
            color: #065f46;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🏥 Medicina</div>
            <div style="font-size: 16px; opacity: 0.9;">صحتك أولويتنا</div>
        </div>
        
        <div class="content">
            <h1 class="title">إعادة تعيين كلمة المرور</h1>
            
            <div class="message">
                مرحباً <strong>{{ $user->full_name ?? $user->email }}</strong>،
            </div>
            
            <div class="message">
                لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في Medicina. إذا كنت قد قدمت هذا الطلب، انقر على الزر أدناه لإعادة تعيين كلمة المرور:
            </div>
            
            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">إعادة تعيين كلمة المرور</a>
            </div>
            
            <div class="expiry-info">
                <div class="expiry-text">
                    ⏰ سينتهي هذا الرابط بعد ساعة واحدة لأسباب أمنية
                </div>
            </div>
            
            <div class="security-info">
                <div class="security-title">🛡️ معلومات أمنية</div>
                <div class="security-text">
                    • يمكن استخدام هذا الرابط مرة واحدة فقط<br>
                    • إذا لم تطلب إعادة التعيين، يرجى تجاهل هذه الرسالة<br>
                    • لن يتم تغيير كلمة المرور حتى تنقر على الرابط أعلاه<br>
                    • لا تشارك هذا الرابط مع أي شخص
                </div>
            </div>
            
            <div class="message">
                إذا لم يعمل الزر أعلاه، يمكنك نسخ ولصق هذا الرابط في متصفحك:
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 14px; color: #374151;">
                {{ $resetUrl }}
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                تم إرسال هذه الرسالة من منصة Medicina الصحية.<br>
                إذا كان لديك أي أسئلة، يرجى الاتصال بفريق الدعم لدينا.
            </div>
            <div style="margin-top: 15px; direction: rtl;">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/#" class="footer-link">زيارة Medicina</a> |
                <a href="#" class="footer-link">اتصل بالدعم</a>
            </div>
        </div>
    </div>
</body>
</html>
