import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';
import idbanner from '../../assets/img/theme/id.png';
import namebanner from '../../assets/img/theme/name.png';
import phonebanner from '../../assets/img/theme/phone.png';
import datebanner from '../../assets/img/theme/date-of-birth.png';
import locationbanner from '../../assets/img/theme/location.png';

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
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-data-error">
        <div className="error-message">{error || 'لم يتم العثور على المريض'}</div>
        <button onClick={() => navigate(-1)} className="back-button">
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="patient-data-container">
      <div className="patient-data-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          ← العودة
        </button>
        <h1 className="page-title-1">بيانات المريض</h1>
      </div>

      {/* Patient Profile Card */}
      <div className="patient-profile-card">
        <div className="patient-profile-header">
          <div className="patient-image-section">
            <img 
              src={patient.user?.profile_image_url || defaultImage} 
              alt={patient.full_name}
              className="patient-profile-image"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="patient-header-info">
            <h2 className="patient-name">{patient.full_name}</h2>
            <p className="patient-email" style={{color: 'var(--contrast-color)'}}>{patient.user?.email || 'لا يوجد بريد إلكتروني'}</p>
          </div>
        </div>

        {/* Patient Information Grid */}
        <div className="patient-info-grid">
          {/* User ID */}
          <div className="info-card">
            <div className="info-icon">
              <img src={idbanner} alt="ID" />
            </div>
            <div className="info-content">
              <p className="info-label">تعريف المستخدم</p>
              <p className="info-value">{patient.user_id}</p>
            </div>
          </div>

     

          {/* Full Name */}
          <div className="info-card">
            <div className="info-icon">
              <img src={namebanner} alt="Name" />
            </div>
            <div className="info-content">
              <p className="info-label">الاسم الكامل</p>
              <p className="info-value">{patient.full_name}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="info-card">
            <div className="info-icon">
              <img src={phonebanner} alt="Phone" />
            </div>
            <div className="info-content">
              <p className="info-label">رقم الهاتف</p>
              <p className="info-value">{patient.phone_number || 'غير متوفر'}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="info-card">
            <div className="info-icon">
              <img src={datebanner} alt="Date" />
            </div>
            <div className="info-content">
              <p className="info-label">تاريخ الميلاد</p>
              <p className="info-value">{patient.date_of_birth || 'غير متوفر'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="info-card info-card-wide">
            <div className="info-icon">
              <img src={locationbanner} alt="Location" />
            </div>
            <div className="info-content">
              <p className="info-label">العنوان</p>
              <p className="info-value">{patient.address || 'غير متوفر'}</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default PatientData;

