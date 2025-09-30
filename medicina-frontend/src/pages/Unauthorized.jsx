import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="bi bi-shield-exclamation"></i>
        </div>
        <div className="unauthorized-text">
          <h1 className="unauthorized-title">غير مصرح لك بالوصول</h1>
          <h2 className="unauthorized-subtitle">Unauthorized Access</h2>
          <p className="unauthorized-description">
            عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة. يرجى التأكد من تسجيل الدخول بحساب صحيح أو التواصل مع الإدارة.
          </p>
          <p className="unauthorized-description-en">
            Sorry, you don't have permission to access this page. Please make sure you're logged in with the correct account or contact the administrator.
          </p>
        </div>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary unauthorized-btn">
            <i className="bi bi-house-door"></i>
            العودة للرئيسية
          </Link>
          
        </div>
        <div className="unauthorized-help">
          <p className="help-text">
            <i className="bi bi-info-circle"></i>
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم الفني
          </p>
        </div>
      </div>
    </div>
  );
}
