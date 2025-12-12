import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/password/forgot', {
        email: email
      });

      setMessage(response.data.message);
      setEmailSent(response.data.email_sent);
      
      // If email wasn't sent (development mode), show the token
      if (!response.data.email_sent && response.data.token) {
        setMessage(response.data.message + ' Use this token: ' + response.data.token);
      }
      
    } catch (err) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-green-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              تحقق من بريدك الإلكتروني
            </h1>
            <p className="text-gray-600 mb-4">
              لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-medium">الخطوات التالية:</span>
            </div>
            <div className="text-blue-600 text-sm mt-2 space-y-1">
              <div>• تحقق من صندوق الوارد في بريدك الإلكتروني</div>
              <div>• انقر على رابط إعادة التعيين في الرسالة</div>
              <div>• قم بإنشاء كلمة مرور جديدة</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setEmailSent(false);
                setMessage('');
                setEmail('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              تجربة بريد إلكتروني آخر
            </button>
            <Link
              to="/login/patient"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-blue-500 text-2xl"></i>
          </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              نسيت كلمة المرور؟
            </h1>
            <p className="text-gray-600">
              أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              عنوان البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="أدخل عنوان بريدك الإلكتروني"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                <span className="font-medium">خطأ</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="font-medium">نجح</span>
              </div>
              <p className="text-green-600 text-sm mt-1">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>جاري إرسال رابط إعادة التعيين...</span>
              </span>
            ) : (
              'إرسال رابط إعادة التعيين'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login/patient"
            className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
