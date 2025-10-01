import React, { useState, useEffect } from 'react';
import profileImg from '../../assets/img/profpic.png';
import axios from 'axios';
import idbanner from '../../assets/img/theme/id.png';
import namebanner from '../../assets/img/theme/name.png';
import phonebanner from '../../assets/img/theme/phone.png';
import datebanner from '../../assets/img/theme/date-of-birth.png';
import locationbanner from '../../assets/img/theme/location.png';
import editbanner from '../../assets/img/theme/edit.png';
import settingbanner from '../../assets/img/theme/setting.png';
import clinicbanner from '../../assets/img/theme/clinic.png';
import doctorbanner from '../../assets/img/theme/doctor.png';
const UserAccount = ({ token }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
    } else {
      axios
        .get('/profile')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
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
  const { email, role } = user;

  // Role-based styling
  const getRoleColor = (role) => {
    switch (role) {
      case 'patient': return 'var(--contrast-color)'; // Green
      case 'doctor': return 'var(--contrast-color)'; // Blue
      case 'clinic': return 'var(--contrast-color)'; // Purple
      default: return '#6b7280'; // Gray
    }
  };



  const patientForm = (
    <div className="user-info-grid">
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span id="UserId-view" className="field-value">{user_id}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">👤</div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span id="role-view" className="field-value role-badge" style={{backgroundColor: getRoleColor(role)}}>
             {role}
          </span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={namebanner} alt="Full Name" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Full Name</label>
          <span id="fullName-view" className="field-value">{full_name}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span id="email-view" className="field-value">{email}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={phonebanner} alt="Phone" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Phone</label>
          <span id="phoneNumber-view" className="field-value">{phone_number}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={datebanner} alt="Date of Birth" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Date of Birth</label>
          <span id="dateOfBirth-view" className="field-value">{date_of_birth}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={locationbanner} alt="Address" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Address</label>
          <span id="address-view" className="field-value">{address}</span>
        </div>
      </div>
    </div>
  );

  const doctorForm = (
    <div className="user-info-grid">
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span id="UserId-view" className="field-value">{user_id}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={doctorbanner} alt="Doctor" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span id="role-view" className="field-value role-badge" style={{backgroundColor: getRoleColor(role)}}>
             {role}
          </span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={namebanner} alt="Full Name" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Full Name</label>
          <span id="fullName-view" className="field-value">{full_name}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span id="email-view" className="field-value">{email}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={phonebanner} alt="Phone" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Phone</label>
          <span id="phoneNumber-view" className="field-value">{phone_number}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">🩺</div>
        <div className="field-content">
          <label className="field-label">Specialization</label>
          <span id="specialization-view" className="field-value">{user.profile.specialization}</span>
        </div>
      </div>
    </div>
  );

  const clinicForm = (
    <div className="user-info-grid">
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={idbanner} alt="User ID" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">User ID</label>
          <span id="UserId-view" className="field-value">{user_id}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={clinicbanner} alt="Clinic" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Role</label>
          <span id="role-view" className="field-value role-badge" style={{backgroundColor: getRoleColor(role)}}>
            {role}
          </span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={namebanner} alt="Clinic Name" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Clinic Name</label>
          <span id="clinicName-view" className="field-value">{user.profile.clinic_name}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">📧</div>
        <div className="field-content">
          <label className="field-label">Email</label>
          <span id="email-view" className="field-value">{email}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={phonebanner} alt="Phone" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Phone</label>
          <span id="phoneNumber-view" className="field-value">{phone_number}</span>
        </div>
      </div>
      <div className="info-field modern-field">
        <div className="field-icon">
          <img src={locationbanner} alt="Location" style={{width: '40px', height: '40px'}}/>
        </div>
        <div className="field-content">
          <label className="field-label">Location</label>
          <span id="address-view" className="field-value">{address}</span>
        </div>
      </div>
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
                <img src={profileImg} alt="Profile" className="avatar-image" />
                <div className="avatar-status" style={{backgroundColor: getRoleColor(role)}}></div>
              </div>
              
            </div>
            <div className="profile-title">
              <h2 className="user-name">
                
                {role ==='patient' ? user.profile.full_name : role === 'doctor' ? user.profile.full_name : user.profile.clinic_name}
                </h2>
              <p className="user-role" style={{color: getRoleColor(role)}}>
                 {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>

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
            <button id="editBtn" className="modern-btn primary-btn">
              <span className="btn-icon pb-1">
                <img src={editbanner} alt="Edit" style={{width: '20px', height: '20px'}}/>
              </span>
              Edit Profile
            </button>
            <button className="modern-btn secondary-btn">
              <span className="btn-icon pb-1">
                <img src={settingbanner} alt="Settings" style={{width: '20px', height: '20px'}}/>
              </span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;