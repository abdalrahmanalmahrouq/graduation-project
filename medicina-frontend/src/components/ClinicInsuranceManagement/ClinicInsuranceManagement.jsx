import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInsuranceModal from './AddInsuranceModal';

const ClinicInsuranceManagement = () => {
  const [insurances, setInsurances] = useState([]);
  const [availableInsurances, setAvailableInsurances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [insuranceToDelete, setInsuranceToDelete] = useState(null);

  useEffect(() => {
    fetchClinicInsurances();
  }, []);

  const fetchClinicInsurances = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/clinic/get-insurances');
      setInsurances(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching clinic insurances:', err);
      setError('حدث خطأ في تحميل تأمينات العيادة');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableInsurances = async () => {
    try {
      const response = await axios.get('/insurances');
      setAvailableInsurances(response.data.data || []);
    } catch (err) {
      console.error('Error fetching available insurances:', err);
      setError('حدث خطأ في تحميل شركات التأمين المتاحة');
    }
  };

  const handleAddInsurance = async (insuranceId) => {
    try {
      const response = await axios.post('/clinic/add-insurances', {
        insurance_id: insuranceId
      });
      
      setSuccess(response.data.message);
      setIsAddModalOpen(false);
      fetchClinicInsurances(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding insurance:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ في إضافة شركة التأمين');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteInsurance = (insurance) => {
    setInsuranceToDelete(insurance);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteInsurance = async () => {
    if (!insuranceToDelete) return;

    try {
      const response = await axios.delete('/clinic/delete-insurances', {
        data: { insurance_id: insuranceToDelete.insurance_id }
      });
      
      setSuccess(response.data.message);
      setIsDeleteModalOpen(false);
      setInsuranceToDelete(null);
      fetchClinicInsurances(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting insurance:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ في حذف شركة التأمين');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  const cancelDeleteInsurance = () => {
    setIsDeleteModalOpen(false);
    setInsuranceToDelete(null);
  };

  const openAddModal = () => {
    fetchAvailableInsurances();
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="insurance-loading-container">
        <div className="insurance-loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="insurance-loading-text">جاري تحميل تأمينات العيادة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insurance-management-container">
      {/* Header Section */}
      <div className="insurance-header">
        <div className="insurance-header-content">
          <div className="insurance-title-section">
            <div className="insurance-icon-wrapper">
              <i className="fa-solid fa-building insurance-main-icon"></i>
            </div>
            <div className="insurance-title-text">
              <h1 className="insurance-main-title">تأمينات العيادة</h1>
              <p className="insurance-subtitle">إدارة شركات التأمين المقبولة في عيادتك</p>
            </div>
          </div>
          <button 
            className="insurance-add-btn"
            onClick={openAddModal}
          >
            <i className="fa-solid fa-plus me-2"></i>
            إضافة شركة تأمين
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="insurance-alert insurance-alert-success">
          <i className="fa-solid fa-check-circle me-2"></i>
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
          ></button>
        </div>
      )}

      {error && (
        <div className="insurance-alert insurance-alert-error">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {/* Insurance Cards Section */}
      <div className="insurance-content">
        {insurances.length === 0 ? (
          <div className="insurance-empty-state">
            <div className="insurance-empty-icon">
              <i className="fa-solid fa-building"></i>
            </div>
            <h3 className="insurance-empty-title">لا توجد شركات تأمين مضافة</h3>
            <p className="insurance-empty-description">ابدأ بإضافة شركات التأمين المقبولة في عيادتك</p>
            <button 
              className="insurance-empty-btn"
              onClick={openAddModal}
            >
              <i className="fa-solid fa-plus me-2"></i>
              إضافة أول شركة تأمين
            </button>
          </div>
        ) : (
          <div className="insurance-cards-grid">
            {insurances.map((insurance) => (
              <div key={insurance.insurance_id} className="insurance-card">
                <div className="insurance-card-header">
                  <div className="insurance-card-icon">
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <div className="insurance-card-actions">
                    <button
                      className="insurance-delete-btn"
                      onClick={() => handleDeleteInsurance(insurance)}
                      title="حذف شركة التأمين"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="insurance-card-body">
                  <h3 className="insurance-card-title">{insurance.name}</h3>
                  <p className="insurance-card-subtitle">شركة تأمين</p>
                </div>
                
                <div className="insurance-card-footer">
                  <div className="insurance-card-date">
                    <i className="fa-solid fa-calendar me-1"></i>
                    <span>تم الإضافة: {new Date(insurance.pivot.created_at).toLocaleDateString('en-UK')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Insurance Modal */}
      <AddInsuranceModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAddInsurance}
        availableInsurances={availableInsurances}
        existingInsurances={insurances}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && insuranceToDelete && (
        <div className="insurance-delete-modal-overlay">
          <div className="insurance-delete-modal-container">
            <div className="insurance-delete-modal-content">
              <div className="insurance-delete-modal-header">
                <div className="insurance-delete-modal-icon">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <h5 className="insurance-delete-modal-title">تأكيد الحذف</h5>
              </div>
              
              <div className="insurance-delete-modal-body">
                <div className="insurance-delete-modal-warning">
                  <i className="fa-solid fa-info-circle"></i>
                  <p className="insurance-delete-modal-message">
                    هل أنت متأكد من حذف شركة التأمين <strong>"{insuranceToDelete.name}"</strong>؟
                  </p>
                </div>
                
                <div className="insurance-delete-modal-details">
                  <div className="insurance-delete-modal-detail-item">
                    <i className="fa-solid fa-building"></i>
                    <span>اسم الشركة: {insuranceToDelete.name}</span>
                  </div>
                  <div className="insurance-delete-modal-detail-item">
                    <i className="fa-solid fa-calendar"></i>
                    <span>تاريخ الإضافة: {new Date(insuranceToDelete.pivot.created_at).toLocaleDateString('en-UK')}</span>
                  </div>
                </div>
                
               
              </div>
              
              <div className="insurance-delete-modal-footer">
                <button 
                  type="button" 
                  className="insurance-delete-modal-cancel-btn" 
                  onClick={cancelDeleteInsurance}
                >
                  <i className="fa-solid fa-times me-2"></i>
                  إلغاء
                </button>
                <button 
                  type="button" 
                  className="insurance-delete-modal-confirm-btn"
                  onClick={confirmDeleteInsurance}
                >
                  <i className="fa-solid fa-trash me-2"></i>
                  حذف نهائياً
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicInsuranceManagement;
