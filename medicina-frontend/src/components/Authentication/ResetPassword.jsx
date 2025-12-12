import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.post('/password/verify-token', {
        token: token
      });

      if (response.data.valid) {
        setTokenValid(true);
        setFormData(prev => ({ ...prev, email: response.data.email }));
      } else {
        setTokenValid(false);
        setError(response.data.message);
      }
    } catch (err) {
      setTokenValid(false);
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/password/reset', {
        ...formData,
        token: token
      });

      setMessage(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login/patient');
      }, 3000);
      
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.password) {
          setError(errors.password[0]);
        } else if (errors.password_confirmation) {
          setError(errors.password_confirmation[0]);
        } else if (errors.email) {
          setError(errors.email[0]);
        } else if (errors.token) {
          setError(errors.token[0]);
        }
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              التحقق من رابط إعادة التعيين
            </h1>
            <p className="text-gray-600">
              يرجى الانتظار بينما نتحقق من رابط إعادة تعيين كلمة المرور...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              رابط إعادة التعيين غير صحيح
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'رابط إعادة تعيين كلمة المرور هذا غير صحيح أو منتهي الصلاحية.'}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-red-700">
              <i className="fas fa-info-circle text-red-600"></i>
              <span className="font-medium">ما يجب فعله:</span>
            </div>
            <div className="text-red-600 text-sm mt-2 space-y-1">
              <div>• طلب رابط إعادة تعيين كلمة مرور جديد</div>
              <div>• تحقق من استخدام أحدث رسالة بريد إلكتروني</div>
              <div>• الروابط تنتهي صلاحيتها بعد ساعة واحدة</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            طلب رابط إعادة تعيين جديد
          </button>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i className="fas fa-check-circle text-green-500 text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              تم إعادة تعيين كلمة المرور بنجاح!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="font-medium">جاري التوجيه إلى تسجيل الدخول...</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/login/patient')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            الذهاب لتسجيل الدخول الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-key text-blue-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            إنشاء كلمة مرور جديدة
          </h1>
          <p className="text-gray-600">
            أدخل كلمة المرور الجديدة لـ <strong>{formData.email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="أدخل كلمة المرور الجديدة"
              required
              minLength="8"
            />
            <p className="text-xs text-gray-500 mt-1">
              يجب أن تكون كلمة المرور 8 أحرف على الأقل
            </p>
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="أكد كلمة المرور الجديدة"
              required
              minLength="8"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>جاري إعادة تعيين كلمة المرور...</span>
              </span>
            ) : (
              'إعادة تعيين كلمة المرور'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login/patient')}
            className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
