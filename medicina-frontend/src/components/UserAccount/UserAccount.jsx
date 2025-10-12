import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../../assets/img/profpic.png';
import axios from 'axios';
import idbanner from '../../assets/img/theme/id.png';
import namebanner from '../../assets/img/theme/name.png';
import phonebanner from '../../assets/img/theme/phone.png';
import datebanner from '../../assets/img/theme/date-of-birth.png';
import locationbanner from '../../assets/img/theme/location.png';
import editbanner from '../../assets/img/theme/edit.png';
import clinicbanner from '../../assets/img/theme/clinic.png';
import doctorbanner from '../../assets/img/theme/doctor.png';
import lockbanner from '../../assets/img/theme/locked.png';
import biobanner from '../../assets/img/theme/bio.png';

const UserAccount = ({ token }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      initializeEditForm(userData);
      setIsLoading(false);
      
      // Always try to refresh from API to get latest data
      axios
        .get('/profile')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          initializeEditForm(res.data);
        })
        .catch((err) => {
          console.error('Error loading fresh profile data:', err);
          // Keep using cached data if API fails
        });
    } else {
      axios
        .get('/profile')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          initializeEditForm(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  };

  const initializeEditForm = (userData) => {
    const formData = {
      full_name: userData.profile.full_name || '',
      phone_number: userData.profile.phone_number || '',
      date_of_birth: userData.profile.date_of_birth || '',
      address: userData.profile.address || '',
      clinic_name: userData.profile.clinic_name || '',
      specialization: userData.profile.specialization || '',
    };
    setEditForm(formData);
  };


  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('Image selected:', file);
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        console.log('Image preview set');
      };
      reader.readAsDataURL(file);
    }
  };

  // Frontend validation function
  const validateForm = (data, role) => {
    const errors = [];
    
    // Phone number validation
    if (data.phone_number && data.phone_number.trim()) {
      const phoneRegex = /^[+]?[0-9\s\-\(\)]{7,20}$/;
      if (!phoneRegex.test(data.phone_number.trim())) {
        errors.push('Phone number must contain only numbers, spaces, hyphens, parentheses, and optional + prefix.');
      }
    }
    
    // Name validation
    if (data.full_name && data.full_name.trim().length > 255) {
      errors.push('Full name cannot exceed 255 characters.');
    }
    
    // Clinic name validation
    if (data.clinic_name && data.clinic_name.trim().length > 255) {
      errors.push('Clinic name cannot exceed 255 characters.');
    }
    
    // Specialization validation
    if (data.specialization && data.specialization.trim().length > 255) {
      errors.push('Specialization cannot exceed 255 characters.');
    }
    
    // Address validation
    if (data.address && data.address.trim().length > 500) {
      errors.push('Address cannot exceed 500 characters.');
    }
    
    // Date validation
    if (data.date_of_birth && data.date_of_birth.trim()) {
      const date = new Date(data.date_of_birth);
      if (isNaN(date.getTime())) {
        errors.push('Date of birth must be a valid date.');
      }
    }
    
    return errors;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare data based on user role
      const { role } = user;
      
      let requestData = {};
      
      switch (role) {
        case 'patient':
          requestData = {
            full_name: editForm.full_name || '',
            phone_number: editForm.phone_number || '',
            date_of_birth: editForm.date_of_birth || '',
            address: editForm.address || ''
          };
          break;
        case 'doctor':
          requestData = {
            full_name: editForm.full_name || '',
            phone_number: editForm.phone_number || '',
            specialization: editForm.specialization || ''
          };
          break;
        case 'clinic':
          requestData = {
            clinic_name: editForm.clinic_name || '',
            phone_number: editForm.phone_number || '',
            address: editForm.address || ''
          };
          break;
      }


      // Frontend validation
      const validationErrors = validateForm(requestData, role);
      if (validationErrors.length > 0) {
        setMessage({ 
          type: 'error', 
          text: validationErrors.join(' ') 
        });
        return;
      }

      // Always use FormData when we have an image, otherwise use JSON
      let response;
      if (selectedImage) {
        const formData = new FormData();
        
        // Add all the form fields
        Object.keys(requestData).forEach(key => {
          if (requestData[key] !== null && requestData[key] !== undefined) {
            formData.append(key, requestData[key]);
          }
        });
        
        // Add the image file
        formData.append('profile_image', selectedImage);
        
        response = await axios.post('/profile', formData);
      } else {
        response = await axios.post('/profile', requestData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Update local user data
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Force reload user data from API to ensure we have the latest image URL
      setTimeout(() => {
        axios.get('/profile')
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          })
          .catch((err) => {
            console.error('Error reloading user data:', err);
          });
      }, 500);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Handle validation errors from backend
      if (error.response?.status === 422 && error.response?.data?.details) {
        const validationErrors = error.response.data.details;
        const errorMessages = [];
        
        // Extract error messages from validation details
        Object.keys(validationErrors).forEach(field => {
          validationErrors[field].forEach(message => {
            errorMessages.push(message);
          });
        });
        
        setMessage({ 
          type: 'error', 
          text: errorMessages.join(' ') 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to update profile. Please try again.' 
        });
      }
    } finally {
      setIsSaving(false);
    }
  };


  // Loading component with modern design
  if (isLoading) {
    return (
      <div className="user-account-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-account-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to load profile</h3>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  const { user_id, full_name, phone_number, date_of_birth, address } = user.profile;
  const { email, role, profile_image_url } = user;

  // Role-based styling
  const getRoleColor = (role) => {
    switch (role) {
      case 'patient': return 'var(--contrast-color)'; // Green
      case 'doctor': return 'var(--contrast-color)'; // Blue
      case 'clinic': return 'var(--contrast-color)'; // Purple
      default: return '#6b7280'; // Gray
    }
  };

  // Render input field
  const renderInputField = (label, value, field, type = 'text', placeholder = '') => (
    <div className="info-field modern-field">
      <div className="field-icon">
        <img src={getFieldIcon(field)} alt={label} style={{width: '40px', height: '40px'}}/>
      </div>
      <div className="field-content">
        <label className="field-label">{label}</label>
        <input
          type={type}
          value={editForm[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="field-input"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  // Get field icon based on field name
  const getFieldIcon = (field) => {
    switch (field) {
      case 'user_id': return idbanner;
      case 'full_name': 
      case 'clinic_name': return namebanner;
      case 'phone_number': return phonebanner;
      case 'date_of_birth': return datebanner;
      case 'address': return locationbanner;
      case 'specialization': return doctorbanner;
      default: return namebanner;
    }
  };



  const patientForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">👤</div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span className="field-value non-editable">{email}</span>
        </div>
      </div>

      {/* Editable fields */}
      {renderInputField('Full Name', full_name, 'full_name', 'text', 'Enter your full name')}
      {renderInputField('Phone Number', phone_number, 'phone_number', 'tel', 'Enter your phone number')}
      {renderInputField('Date of Birth', date_of_birth, 'date_of_birth', 'date')}
      {renderInputField('Address', address, 'address', 'text', 'Enter your address')}
    </div>
  );

  const doctorForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={doctorbanner} alt="Doctor" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span className="field-value non-editable">{email}</span>
        </div>
      </div>

      {/* Editable fields */}
      {renderInputField('Full Name', full_name, 'full_name', 'text', 'Enter your full name')}
      {renderInputField('Phone Number', phone_number, 'phone_number', 'tel', 'Enter your phone number')}
      {renderInputField('Specialization', user.profile.specialization, 'specialization', 'text', 'Enter your specialization')}
    </div>
  );

  const clinicForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={clinicbanner} alt="Clinic" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span className="field-value non-editable">{email}</span>
        </div>
      </div>

      {/* Editable fields */}
      {renderInputField('Clinic Name', user.profile.clinic_name, 'clinic_name', 'text', 'Enter clinic name')}
      {renderInputField('Phone Number', phone_number, 'phone_number', 'tel', 'Enter phone number')}
      {renderInputField('Address', address, 'address', 'text', 'Enter clinic address')}
    </div>
  );

  return (
    <div className="user-account-container">
      <div className="user-account-wrapper">
        <div className="modern-profile-card" id="profileCard">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar" style={{background: `linear-gradient(135deg, ${getRoleColor(role)}20, ${getRoleColor(role)}40)`}}>
                <img 
                  src={imagePreview || profile_image_url || profileImg} 
                  alt="Profile" 
                  className="avatar-image"
                  onError={(e) => {
                    // Fallback to default image
                    e.target.src = profileImg;
                  }}
                />
                <div className="avatar-status" style={{backgroundColor: getRoleColor(role)}}></div>
                
                {/* Image upload overlay */}
                <div className="avatar-upload-overlay" onClick={() => document.getElementById('avatar-upload').click()}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="avatar-upload-input"
                    id="avatar-upload"
                  />
                  <div className="avatar-upload-label">
                    📷
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-title">
              <h2 className="user-name">
                {role === 'patient' ? user.profile.full_name : 
                 role === 'doctor' ? user.profile.full_name : 
                 user.profile.clinic_name}
              </h2>
              <p className="user-role" style={{color: getRoleColor(role)}}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-content">
            {role === 'patient' ? (
              patientForm
            ):role === 'doctor' ? (
              doctorForm
            ):role === 'clinic' ? (
              clinicForm
            ) : null}
          </div>
      
          {/* Action Buttons */}
          <div className="profile-actions">
            <button 
              onClick={handleSave} 
              className="modern-btn primary-btn"
              disabled={isSaving}
            >
              <span className="btn-icon pb-1">
                <img src={editbanner} alt="Save" style={{width: '20px', height: '20px'}}/>
              </span>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            
            <button 
              onClick={() => navigate(`/${user.role}/change-password`)} 
              className="modern-btn secondary-btn"
            >
              <span className="btn-icon pb-1">
                <img src={lockbanner} alt="Lock" style={{width: '20px', height: '20px'}}/>
              </span>
              Change Password
            </button>
            
            {user.role === 'doctor' && (
              <button 
                onClick={() => navigate(`/${user.role}/bio`)} 
                className="modern-btn secondary-btn"
              >
                <span className="btn-icon pb-1">
                  <img src={biobanner} alt="" style={{width: '20px', height: '20px'}}/>
                </span>
                Bio
              </button>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;