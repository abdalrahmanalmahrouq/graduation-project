import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';
import idbanner from '../../assets/img/theme/id.png';
import namebanner from '../../assets/img/theme/name.png';
import phonebanner from '../../assets/img/theme/phone.png';
import datebanner from '../../assets/img/theme/date-of-birth.png';
import locationbanner from '../../assets/img/theme/location.png';
import Loading from '../Loading';

const PatientData = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  
    fetchPatientData();
  }, [user_id]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`/patients/by-user-id/${user_id}`);
    
      setPatient(response.data.patient);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('فشل في تحميل بيانات المريض');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-data-error-modern">
        <div className="error-icon-wrapper">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="error-message-modern">{error || 'لم يتم العثور على المريض'}</div>
        <button onClick={() => navigate(-1)} className="back-button-modern">
          <span className="back-icon">←</span>
          <span>العودة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="patient-data-container">
      <div className="patient-data-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-button-modern"
        >
          <span className="back-icon">←</span>
          <span>العودة</span>
        </button>
        <div className="header-title-section">
          <h1 className="page-title-modern">بيانات المريض</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="patient-profile-card-modern">
        <div className="patient-profile-header-modern">
          <div className="profile-image-wrapper">
            <div className="profile-image-glow"></div>
            <img 
              src={patient.user?.profile_image_url || defaultImage} 
              alt={patient.full_name}
              className="patient-profile-image-modern"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="patient-header-info-modern">
            <h2 className="patient-name-modern">{patient.full_name}</h2>
            <div className="patient-email-wrapper">
              <svg className="email-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <p className="patient-email-modern">{patient.user?.email || 'لا يوجد بريد إلكتروني'}</p>
            </div>
          </div>
        </div>

        {/* Patient Information Grid */}
        <div className="patient-info-grid-modern">
          {/* User ID */}
          <div className="info-card-modern">
            <div className="info-icon-modern info-icon-id">
              <img src={idbanner} alt="ID" />
            </div>
            <div className="info-content-modern">
              <p className="info-label-modern">تعريف المستخدم</p>
              <p className="info-value-modern">{patient.user_id}</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="info-card-modern">
            <div className="info-icon-modern info-icon-name">
              <img src={namebanner} alt="Name" />
            </div>
            <div className="info-content-modern">
              <p className="info-label-modern">الاسم الكامل</p>
              <p className="info-value-modern">{patient.full_name}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="info-card-modern">
            <div className="info-icon-modern info-icon-phone">
              <img src={phonebanner} alt="Phone" />
            </div>
            <div className="info-content-modern">
              <p className="info-label-modern">رقم الهاتف</p>
              <p className="info-value-modern">{patient.phone_number || 'غير متوفر'}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="info-card-modern">
            <div className="info-icon-modern info-icon-date">
              <img src={datebanner} alt="Date" />
            </div>
            <div className="info-content-modern">
              <p className="info-label-modern">تاريخ الميلاد</p>
              <p className="info-value-modern">{patient.date_of_birth || 'غير متوفر'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="info-card-modern info-card-wide-modern">
            <div className="info-icon-modern info-icon-location">
              <img src={locationbanner} alt="Location" />
            </div>
            <div className="info-content-modern">
              <p className="info-label-modern">العنوان</p>
              <p className="info-value-modern">{patient.address || 'غير متوفر'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientData;

