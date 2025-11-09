import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LabResultRequest = () => {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    appointment_id: '',
    examination_title: '',
    notes: '',
    file: null
  });

  // Fetch lab requests on component mount
  useEffect(() => {
    fetchLabRequests();
  }, []);

  const fetchLabRequests = async () => {
    try {
      const response = await axios.get('/lab-results/requests');
      setPendingRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching lab requests:', error);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/lab-results/request', {
        patient_id: patientId
      });

      setMessage({ 
        type: 'success', 
        text: 'تم إرسال الطلب بنجاح. في انتظار موافقة المريض.' 
      });
      setPatientId('');
      
      // Refresh the list
      fetchLabRequests();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({
      ...uploadData,
      file: e.target.files[0]
    });
  };

  const handleUploadSubmit = async (e, labResultId) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('appointment_id', uploadData.appointment_id);
    formData.append('examination_title', uploadData.examination_title);
    formData.append('notes', uploadData.notes);
    formData.append('file', uploadData.file);

    try {
      await axios.post(`/lab-results/${labResultId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        type: 'success', 
        text: 'تم رفع نتيجة الفحص بنجاح!' 
      });
      setShowUploadForm(false);
      setApprovedRequest(null);
      setUploadData({
        appointment_id: '',
        examination_title: '',
        notes: '',
        file: null
      });
      
      // Refresh the list
      fetchLabRequests();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء رفع الملف';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lab-result-request-container">
      {/* Header Section */}
      <div className="lab-result-header">
        <div className="lab-result-header-content">
          <div className="lab-result-title-section">
            <div className="lab-result-icon-wrapper">
              <i className="fa-solid fa-flask lab-result-main-icon"></i>
            </div>
            <div className="lab-result-title-text">
              <h1 className="lab-result-main-title">طلبات نتائج الفحوصات</h1>
              <p className="lab-result-subtitle">إرسال طلب فحص جديد للمرضى</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mx-4`} role="alert">
          {message.text}
        </div>
      )}

      {/* Request Form */}
      {!showUploadForm && (
        <div className="lab-result-card">
          <div className="card-body">
            <h4 className="card-title mb-4">
              <i className="fa-solid fa-paper-plane ms-2"></i>
              إرسال طلب فحص جديد
            </h4>
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-4">
                <label htmlFor="patientId" className="form-label">
                  معرف المريض (Patient ID)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="أدخل معرف المريض"
                  required
                />
                <small className="form-text text-muted">
                  سيتم إرسال طلب للمريض وبعد موافقته يمكنك رفع نتيجة الفحص
                </small>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane ms-2"></i>
                    إرسال الطلب
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Form (shown after approval) */}
      {showUploadForm && approvedRequest && (
        <div className="lab-result-card">
          <div className="card-body">
            <h4 className="card-title mb-4">
              <i className="fa-solid fa-upload ms-2"></i>
              رفع نتيجة الفحص
            </h4>
            <div className="alert alert-info mb-4">
              <i className="fa-solid fa-check-circle ms-2"></i>
              تمت الموافقة! يمكنك الآن رفع نتيجة الفحص للمريض
            </div>
            <form onSubmit={(e) => handleUploadSubmit(e, approvedRequest.id)}>
              <div className="mb-3">
                <label htmlFor="appointmentId" className="form-label">
                  معرف الموعد (Appointment ID)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="appointmentId"
                  value={uploadData.appointment_id}
                  onChange={(e) => setUploadData({...uploadData, appointment_id: e.target.value})}
                  placeholder="أدخل معرف الموعد"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="examinationTitle" className="form-label">
                  عنوان الفحص
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="examinationTitle"
                  value={uploadData.examination_title}
                  onChange={(e) => setUploadData({...uploadData, examination_title: e.target.value})}
                  placeholder="مثال: تحليل دم شامل"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  ملاحظات
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="3"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({...uploadData, notes: e.target.value})}
                  placeholder="أضف ملاحظات إضافية (اختياري)"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="form-label">
                  ملف النتيجة (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                <small className="form-text text-muted">
                  الحد الأقصى لحجم الملف: 2 ميجابايت
                </small>
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-upload ms-2"></i>
                      رفع النتيجة
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUploadForm(false);
                    setApprovedRequest(null);
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending and Approved Requests List */}
      {pendingRequests.length > 0 && !showUploadForm && (
        <div className="lab-result-card mt-4">
          <div className="card-body">
            <h4 className="card-title mb-4">
              <i className="fa-solid fa-list ms-2"></i>
              جميع الطلبات
            </h4>
            <div className="list-group">
              {pendingRequests.map((request) => (
                <div key={request.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">معرف المريض: {request.patient_id}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                          {new Date(request.created_at).toLocaleString('en-UK')}
                        </small>
                        {request.status === 'pending' && (
                          <span className="badge bg-warning text-dark">
                            <i className="fa-solid fa-clock ms-1"></i>
                            في انتظار الموافقة
                          </span>
                        )}
                        {request.status === 'approved' && !request.file_path && (
                          <span className="badge bg-success">
                            <i className="fa-solid fa-check ms-1"></i>
                            تمت الموافقة - جاهز للرفع
                          </span>
                        )}
                        {request.status === 'approved' && request.file_path && (
                          <span className="badge bg-primary">
                            <i className="fa-solid fa-check-double ms-1"></i>
                            مكتمل
                          </span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="badge bg-danger">
                            <i className="fa-solid fa-times ms-1"></i>
                            مرفوض
                          </span>
                        )}
                      </div>
                      {request.examination_title && (
                        <small className="text-muted d-block mt-1">
                          <i className="fa-solid fa-flask ms-1"></i>
                          {request.examination_title}
                        </small>
                      )}
                    </div>
                    {request.status === 'approved' && !request.file_path && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setApprovedRequest(request);
                          setShowUploadForm(true);
                        }}
                      >
                        <i className="fa-solid fa-upload ms-2"></i>
                        رفع النتيجة
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResultRequest;


