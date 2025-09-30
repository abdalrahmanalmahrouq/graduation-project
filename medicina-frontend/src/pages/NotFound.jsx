import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <i className="bi bi-search"></i>
        </div>
        <div className="not-found-text">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">الصفحة غير موجودة</h2>
          <h3 className="not-found-subtitle-en">Page Not Found</h3>
          <p className="not-found-description">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة للصفحة الرئيسية.
          </p>
          <p className="not-found-description-en">
            Sorry, the page you are looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
          </p>
        </div>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary not-found-btn">
            <i className="bi bi-house-door"></i>
            العودة للرئيسية
          </Link>
          <button 
            className="btn btn-outline-primary not-found-btn"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-right"></i>
            العودة للخلف
          </button>
        </div>
        <div className="not-found-suggestions">
          <h4 className="suggestions-title">اقتراحات مفيدة:</h4>
          <div className="suggestions-list">
            <Link to="/" className="suggestion-item">
              <i className="bi bi-house"></i>
              الصفحة الرئيسية
            </Link>
            <Link to="/about" className="suggestion-item">
              <i className="bi bi-info-circle"></i>
              من نحن
            </Link>
            <Link to="/contact" className="suggestion-item">
              <i className="bi bi-telephone"></i>
              اتصل بنا
            </Link>
            <Link to="/services" className="suggestion-item">
              <i className="bi bi-heart-pulse"></i>
              خدماتنا
            </Link>
          </div>
        </div>
        <div className="not-found-help">
          <p className="help-text">
            <i className="bi bi-question-circle"></i>
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم الفني
          </p>
        </div>
      </div>
    </div>
  );
}
