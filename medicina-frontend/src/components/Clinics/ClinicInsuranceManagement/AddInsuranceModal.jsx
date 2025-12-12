import React, { useState, useEffect } from 'react';

const AddInsuranceModal = ({ isOpen, onClose, onAdd, availableInsurances, existingInsurances }) => {
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredInsurances, setFilteredInsurances] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Filter out already added insurances
      const existingIds = existingInsurances.map(ins => ins.insurance_id);
      const filtered = availableInsurances.filter(ins => !existingIds.includes(ins.insurance_id));
      setFilteredInsurances(filtered);
      setSelectedInsurance('');
    }
  }, [isOpen, availableInsurances, existingInsurances]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInsurance) return;

    setIsLoading(true);
    try {
      await onAdd(selectedInsurance);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedInsurance('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="insurance-modal-overlay">
      <div className="insurance-modal-container">
        <div className="insurance-modal-content">
          <div className="insurance-modal-header">
            <div className="insurance-modal-title-section">
              
              <h5 className="insurance-modal-title">إضافة شركة تأمين جديدة</h5>
            </div>
            <button 
              type="button" 
              className="insurance-modal-close" 
              onClick={handleClose}
              disabled={isLoading}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="insurance-modal-body">
              {filteredInsurances.length === 0 ? (
                <div className="insurance-modal-empty">
                  <div className="insurance-modal-empty-icon">
                    <i className="fa-solid fa-info-circle"></i>
                  </div>
                  <h5 className="insurance-modal-empty-title">جميع شركات التأمين مضافة بالفعل</h5>
                  <p className="insurance-modal-empty-description">لا توجد شركات تأمين جديدة يمكن إضافتها</p>
                </div>
              ) : (
                <div>
                  <div className="insurance-form-group">
                    <label htmlFor="insuranceSelect" className="insurance-form-label">
                      <i className="fa-solid fa-building me-2"></i>
                      اختر شركة التأمين
                    </label>
                    <select
                      id="insuranceSelect"
                      className="insurance-form-select"
                      value={selectedInsurance}
                      onChange={(e) => setSelectedInsurance(e.target.value)}
                      required
                      disabled={isLoading}
                    >
                      <option value="">-- اختر شركة التأمين --</option>
                      {filteredInsurances.map((insurance) => (
                        <option key={insurance.insurance_id} value={insurance.insurance_id}>
                          {insurance.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="insurance-modal-info">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    <strong>ملاحظة:</strong> سيتم إضافة شركة التأمين المختارة إلى قائمة شركات التأمين المقبولة في عيادتك
                  </div>
                </div>
              )}
            </div>
            
            <div className="insurance-modal-footer">
              <button 
                type="button" 
                className="insurance-modal-cancel-btn" 
                onClick={handleClose}
                disabled={isLoading}
              >
                إلغاء
              </button>
              {filteredInsurances.length > 0 && (
                <button 
                  type="submit" 
                  className="insurance-modal-submit-btn"
                  disabled={!selectedInsurance || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus me-2"></i>
                      إضافة شركة التأمين
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInsuranceModal;
