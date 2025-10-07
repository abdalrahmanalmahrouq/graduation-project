import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import editbanner from '../../assets/img/theme/edit.png';
import lockbanner from '../../assets/img/theme/locked.png';
import arrowbanner from '../../assets/img/theme/arrow.png';
const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Simple validation
    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'كلمات المرور الجديدة غير متطابقة' });
      setIsLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });

      setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Redirect back to account page after 2 seconds
      setTimeout(() => {
        navigate(`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'patient'}/account`);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'فشل في تغيير كلمة المرور' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render input field with Medicina design
  const renderPasswordField = (label, field, placeholder) => (
    <div className="info-field modern-field">
      <div className="field-icon">
        <img src={lockbanner} alt="Lock" style={{width: '20px', height: '20px'}}/>
      </div>
      <div className="field-content">
        <label className="field-label">{label}</label>
        <input
          type="password"
          name={field}
          value={formData[field] || ''}
          onChange={handleInputChange}
          className="field-input"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="user-account-container">
      <div className="user-account-wrapper">
        <div className="modern-profile-card" id="changePasswordCard">
          {/* Header */}
          <div className="profile-header">
            
            <div className="profile-title text-center">
              <h2 className="user-name">تغيير كلمة المرور</h2>
              
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Password Form */}
          <div className="profile-content">
            <div className="user-info-grid">
              {renderPasswordField('كلمة المرور الحالية', 'current_password', 'أدخل كلمة المرور الحالية')}
              {renderPasswordField('كلمة المرور الجديدة', 'new_password', 'أدخل كلمة المرور الجديدة')}
              {renderPasswordField('تأكيد كلمة المرور الجديدة', 'confirm_password', 'أعد إدخال كلمة المرور الجديدة')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button 
              onClick={handleSubmit} 
              className="modern-btn primary-btn"
              disabled={isLoading}
            >
              <span className="btn-icon pb-1">
                <img src={editbanner} alt="Save" style={{width: '20px', height: '20px'}}/>
              </span>
              {isLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
            
            <button 
              onClick={() => navigate(`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'patient'}/account`)} 
              className="modern-btn secondary-btn"
            >
              <span className="btn-icon pb-1">
                <img src={arrowbanner} alt="Arrow" style={{width: '20px', height: '20px'}}/>
              </span>
              العودة للحساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
