import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../../assets/img/profpic.png';
import axios from 'axios';
import ImageCropModal from './ImageCropModal';
import Loading from '../Loading';
import { useFlashMessage } from '../../hooks/useFlashMessage';


const UserAccount = ({ token }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const {message, setMessage} = useFlashMessage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [isLoadingInsurances, setIsLoadingInsurances] = useState(false);
  const [insuranceFetchError, setInsuranceFetchError] = useState('');
  const [hasLoadedInsurances, setHasLoadedInsurances] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

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

  const loadInsuranceOptions = async () => {
    if (!user || user.role !== 'patient') {
      return;
    }

    setIsLoadingInsurances(true);
    setInsuranceFetchError('');

    try {
      const response = await axios.get('/insurances');
      const rawOptions = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalizedOptions = rawOptions.map((option) => {
        if (typeof option === 'string') {
          return { insurance_id: option, name: option };
        }
        return option;
      });

      setInsuranceOptions(normalizedOptions);
      setHasLoadedInsurances(true);
    } catch (error) {
      console.error('Failed to fetch insurance companies:', error);
      setInsuranceOptions([]);
      setInsuranceFetchError('Failed to load insurance companies. Please try again later.');
    } finally {
      setIsLoadingInsurances(false);
    }
  };

  const ensureInsuranceOptionsLoaded = () => {
    if (isLoadingInsurances || hasLoadedInsurances) {
      return;
    }

    loadInsuranceOptions();
  };

  const initializeEditForm = (userData) => {
    const formData = {
      full_name: userData.profile.full_name || '',
      phone_number: userData.profile.phone_number || '',
      date_of_birth: userData.profile.date_of_birth || '',
      address: userData.profile.address || '',
      clinic_name: userData.profile.clinic_name || '',
      specialization: userData.profile.specialization || '',
      insurance_id: userData.profile.insurance_id || '',
      lab_name: userData.profile.lab_name || '',
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
     
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCropComplete = (croppedFile) => {
    setSelectedImage(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(croppedFile);
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

    // Lab name validation
    if (data.lab_name && data.lab_name.trim().length > 255) {
      errors.push('Lab name cannot exceed 255 characters.');
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
            address: editForm.address || '',
            insurance_id: editForm.insurance_id || null,
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
        case 'lab':
          requestData = {
            lab_name: editForm.lab_name || '',
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

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
    setMessage('');
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmation !== 'حذف') {
      setMessage({ type: 'error', text: 'يرجى كتابة "حذف" بالضبط للتأكيد' });
      return;
    }

    // Show loading state
    setIsSaving(true);
    setMessage('');
    setShowDeleteModal(false);
    
    axios.post('/delete-account')
      .then((res) => {
        console.log('Account deleted successfully:', res);
        
        // Show success message
        setMessage({ type: 'success', text: 'تم حذف حسابك بنجاح' });
        
        // Clear all user data
        localStorage.clear();
        sessionStorage.clear();
        
        // Show success message for a moment before redirecting
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((err) => {
        console.error('Error deleting account:', err);
        setIsSaving(false);
        
        // Handle different error types
        if (err.response?.status === 401) {
          setMessage({ type: 'error', text: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى' });
          setTimeout(() => {
            localStorage.clear();
            navigate('/');
          }, 2000);
        } else if (err.response?.status === 403) {
          setMessage({ type: 'error', text: 'ليس لديك صلاحية لحذف هذا الحساب' });
        } else if (err.response?.status >= 500) {
          setMessage({ type: 'error', text: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً' });
        } else {
          setMessage({ type: 'error', text: 'حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى' });
        }
      });
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    setMessage('');
  };

  // Loading component with modern design
  if (isLoading) {
    return (
      <Loading />
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
      case 'lab': return 'var(--contrast-color)'; // Orange or other unique color
      default: return '#6b7280'; // Gray
    }
  };

  // Render input field
  const renderInputField = (label, value, field, type = 'text', placeholder = '') => (
    <div className="info-field modern-field">
      <div className="field-icon">
       
        <i className={`fa-solid ${getFieldIcon(field)} medicina-theme-icon`}></i>
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
      case 'user_id': return 'fa-id-card-clip';
      case 'full_name': return 'fa-user'; 
      case 'clinic_name': return 'fa-hospital';
      case 'lab_name': return 'fa-flask-vial';
      case 'phone_number': return 'fa-phone';
      case 'date_of_birth': return 'fa-calendar';
      case 'address': return 'fa-location-dot';
      case 'specialization': return 'fa-stethoscope';
      case 'consultation_duration': return 'fa-clock';
      default: return 'fa-user';
    }
  };



  const patientForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-id-card-clip medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-hospital-user medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-envelope medicina-theme-icon`}></i>
        </div>
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
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-building medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Insurance Company</label>
          <select
            value={editForm.insurance_id || ''}
            onChange={(e) => handleInputChange('insurance_id', e.target.value || '')}
            className="field-input"
            onFocus={ensureInsuranceOptionsLoaded}
            onClick={ensureInsuranceOptionsLoaded}
          >
            <option value="">Select insurance</option>
            {!hasLoadedInsurances && user.profile?.insurances && (
              <option value={user.profile.insurances.insurance_id || ''}>
                {user.profile.insurances.name}
              </option>
            )}
            {insuranceOptions.map((option) => (
              <option
                key={option.insurance_id ?? option.name}
                value={option.insurance_id ?? ''}
              >
                {option.name}
              </option>
            ))}
          </select>
          {isLoadingInsurances && (
            <small className="text-muted d-block mt-1">Loading insurance companies...</small>
          )}
          {insuranceFetchError && (
            <small className="text-danger d-block mt-1">{insuranceFetchError}</small>
          )}
        </div>
      </div>
    </div>
  );

  const doctorForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-id-card-clip medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-user-doctor medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-envelope medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span className="field-value non-editable">{email}</span>
        </div>
      </div>

      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-clock medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Consultation Duration</label>
          <span className="field-value non-editable" >{user.profile.consultation_duration} </span>
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
          <i className={`fa-solid fa-id-card-clip medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-hospital medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-envelope medicina-theme-icon`}></i>
        </div>
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

  const labForm = (
    <div className="user-info-grid">
      {/* Non-editable fields */}
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-id-card-clip medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span className="field-value non-editable">{user_id}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-flask-vial medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span className="field-value role-badge non-editable" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <i className={`fa-solid fa-envelope medicina-theme-icon`}></i>
        </div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span className="field-value non-editable">{email}</span>
        </div>
      </div>
      {/* Editable fields */}
      {renderInputField('Lab Name', user.profile.lab_name, 'lab_name', 'text', 'Enter lab name')}
      {renderInputField('Phone Number', phone_number, 'phone_number', 'tel', 'Enter phone number')}
      {renderInputField('Address', address, 'address', 'text', 'Enter lab address')}
    </div>
  );

  // Delete Account Modal Component
  const DeleteAccountModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="delete-account-modal-overlay">
        <div className="delete-account-modal">
          <div className="delete-account-modal-header">
            <h3 className="delete-account-modal-title">حذف الحساب نهائياً</h3>
            <button 
              className="delete-account-modal-close"
              onClick={cancelDeleteAccount}
            >
              ✕
            </button>
          </div>
          
          <div className="delete-account-modal-body">
            <div className="delete-account-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h4>تحذير: هذا الإجراء لا يمكن التراجع عنه!</h4>
                <p>سيتم حذف جميع بياناتك بشكل دائم، بما في ذلك:</p>
                <ul>
                  <li>معلومات الملف الشخصي</li>
                  <li>جميع المواعيد والجلسات</li>
                  <li>السجلات الطبية</li>
                  <li>جميع البيانات المرتبطة بحسابك</li>
                </ul>
              </div>
            </div>
            
            <div className="delete-account-confirmation">
              <label htmlFor="delete-confirmation-input">
                للتأكيد، يرجى كتابة <strong>"حذف"</strong> في المربع أدناه:
              </label>
              <input
                id="delete-confirmation-input"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="اكتب 'حذف' هنا"
                className="delete-confirmation-input"
                autoComplete="off"
              />
            </div>
          </div>
          
          <div className="delete-account-modal-footer">
            <button 
              className="delete-account-cancel-btn"
              onClick={cancelDeleteAccount}
            >
              إلغاء
            </button>
            <button 
              className="delete-account-confirm-btn"
              onClick={confirmDeleteAccount}
              disabled={deleteConfirmation !== 'حذف' || isSaving}
            >
              {isSaving ? 'جاري الحذف...' : 'حذف الحساب نهائياً'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user-account-container">
      <DeleteAccountModal />
      {showCropModal && (
        <ImageCropModal
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      )}
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
                 role === 'clinic' ? user.profile.clinic_name :
                 role === 'lab' ? user.profile.lab_name :
                 ''}
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
            ):role === 'lab' ? (
              labForm
            ) : null}
          </div>
      
          {/* Action Buttons */}
          <div className="profile-actions">
          
            <div className="profile-actions-right">

            <button 
              onClick={handleSave} 
              className="modern-btn primary-btn"
              disabled={isSaving}
            >
              <span className="btn-icon">
                <i className={`fa-solid fa-pen-to-square medicina-theme-icon`}></i>
              </span>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            
            <button 
              onClick={() => navigate(`/${user.role}/change-password`)} 
              className="modern-btn secondary-btn"
            >
              <span className="btn-icon">
                <i className={`fa-solid fa-key medicina-theme-icon`}></i>
              </span>
              Change Password
            </button>

            {user.role === 'doctor' && (
              <button 
                onClick={() => navigate(`/${user.role}/bio`)} 
                className="modern-btn secondary-btn"
              >
                <span className="btn-icon">
                  <i className={`fa-solid fa-notes-medical medicina-theme-icon`}></i>
                </span>
                Bio
              </button>
            )}
           
            
            
            
            
            </div>

            <div className="profile-actions-left">
              <button 
                onClick={() => handleDeleteAccount()} 
                className="modern-btn danger-btn"
              >
                <span className="btn-icon">
                  <i className={`fa-solid fa-trash text-white`}></i>
                </span>
                Delete Account
              </button>
          </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
