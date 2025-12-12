import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerificationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  const success = searchParams.get('success') === 'true';
  const alreadyVerified = searchParams.get('already_verified') === 'true';
  const error = searchParams.get('error');

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect to login page after countdown
            navigate('/login/patient');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, navigate]);

  const handleGoToLogin = () => {
    navigate('/login/patient');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              {error === 'invalid_hash' 
                ? 'The verification link is invalid or has been tampered with.'
                : 'Something went wrong during email verification.'
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Go to Homepage
            </button>
            <button
              onClick={handleGoToLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Try Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <i className="fas fa-check-circle text-green-500 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {alreadyVerified ? 'Already Verified!' : 'Email Verified Successfully!'}
          </h1>
          <p className="text-gray-600">
            {alreadyVerified 
              ? 'Your email was already verified. You can now access all features of Medicina.'
              : 'Thank you for verifying your email address. Your account is now fully activated!'
            }
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <i className="fas fa-check-circle text-green-600"></i>
            <span className="font-medium">Account Status: Verified</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Continue to Login
          </button>
          
          {success && (
            <div className="text-sm text-gray-500">
              Redirecting to login in {countdown} seconds...
            </div>
          )}
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Go to Homepage
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Welcome to Medicina - Your trusted healthcare platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
