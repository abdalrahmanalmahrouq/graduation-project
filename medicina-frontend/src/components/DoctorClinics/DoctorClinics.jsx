import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorClinics();
  }, []);

  const fetchDoctorClinics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/doctors/get-clinics');
      setClinics(response.data.clinics || []);
      setError('');
    } catch (err) {
      console.error('Error fetching doctor clinics:', err);
      setError('حدث خطأ في تحميل العيادات المرتبطة');
    } finally {
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

  return (
    <div className="doctor-clinics-container">
      {/* Header Section */}
      <div className="doctor-clinics-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">
              <i className="bi bi-hospital me-3"></i>
              عياداتي
            </h1>
            <p className="header-subtitle">
              قائمة العيادات التي تعمل بها
            </p>
          </div>
          <div className="header-icon">
            <i className="bi bi-building-check"></i>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <i className="bi bi-hospital-fill"></i>
            <div className="stat-info">
              <span className="stat-number">{clinics.length}</span>
              <span className="stat-label">عيادة مرتبطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Clinics Grid */}
      {clinics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-hospital"></i>
          </div>
          <h3>لا توجد عيادات مرتبطة</h3>
          <p>لم يتم ربطك بأي عيادة حتى الآن</p>
        </div>
      ) : (
        <div className="clinics-grid">
          {clinics.map((clinic, index) => (
            <div 
              className="clinic-card" 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="clinic-doctor-card-header">
                <div className="clinic-avatar">
                  {clinic.profile_image_url ? (
                    <img src={clinic.profile_image_url} alt={clinic.clinic_name} />
                  ) : (
                    <i className="bi bi-hospital-fill"></i>
                  )}
                </div>
                <div className="clinic-badge">
                  <i className="bi bi-patch-check-fill"></i>
                </div>
              </div>

              <div className="clinic-card-body">
                <h3 className="clinic-name">{clinic.clinic_name}</h3>
                
                <div className="clinic-details">
                  <div className="detail-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>{clinic.address}</span>
                  </div>
                  
                  {clinic.phone_number && (
                    <div className="detail-item">
                      <i className="bi bi-telephone-fill"></i>
                      <span dir="ltr">{clinic.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="clinic-card-footer">
                <button className="btn-view-details">
                  <span>عرض التفاصيل</span>
                  <i className="bi bi-arrow-left"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorClinics;

