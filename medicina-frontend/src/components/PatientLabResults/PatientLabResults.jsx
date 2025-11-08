import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientLabResults = () => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedNotes, setExpandedNotes] = useState({});

  useEffect(() => {
    fetchLabResults();
  }, []);

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/patients/lab-results');
      setLabResults(response.data.labResults || []);
    } catch (error) {
      console.error('Error fetching lab results:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'حدث خطأ أثناء تحميل نتائج الفحوصات' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UK');
  };

  const handleDownload = (result) => {
    // Use file_url from API response if available, otherwise construct it
    let fileUrl = result.file_url;
    
    if (!fileUrl && result.file_path) {
      // Fallback: construct URL if file_url is not provided
      if (result.file_path.startsWith('http')) {
        fileUrl = result.file_path;
      } else {
        // Construct storage URL
        const baseURL = axios.defaults.baseURL || '';
        fileUrl = `${baseURL}/storage/${result.file_path.replace(/^\/+/, '')}`;
      }
    }

    if (!fileUrl) {
      setMessage({ type: 'error', text: 'الملف غير متاح للتحميل' });
      return;
    }

    try {
      // Open in new tab for viewing
      window.open(fileUrl, '_blank');
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء فتح الملف' });
    }
  };

  const toggleNotes = (resultId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };

  const shouldTruncateNotes = (notes) => {
    if (!notes) return false;
    // Truncate if notes are longer than 150 characters or have more than 3 lines
    return notes.length > 150 || (notes.match(/\n/g) || []).length > 2;
  };

  return (
    <div className="patient-lab-results-container">
      {/* Header Section */}
      <div className="patient-lab-results-header">
        <div className="patient-lab-results-header-content">
          <div className="patient-lab-results-title-section">
            <div className="patient-lab-results-icon-wrapper">
              <i className="fa-solid fa-flask patient-lab-results-main-icon"></i>
            </div>
            <div className="patient-lab-results-title-text">
              <h1 className="patient-lab-results-main-title">تقارير المختبرات</h1>
              <p className="patient-lab-results-subtitle">عرض جميع نتائج الفحوصات المعملية المعتمدة</p>
            </div>
          </div>
          {labResults.length > 0 && (
            <div className="patient-lab-results-count">
              <span className="count-number">{labResults.length}</span>
              <span className="count-label">فحص</span>
            </div>
          )}
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mx-4 mt-4`} role="alert">
          {message.text}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3 text-muted">جاري التحميل ...</p>
        </div>
      ) : (
        <div className="patient-lab-results-content">
          {labResults.length === 0 ? (
            <div className="patient-lab-results-empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-flask"></i>
              </div>
              <h3>لا توجد نتائج فحوصات</h3>
              <p>لا توجد نتائج فحوصات معملية متاحة في الوقت الحالي</p>
            </div>
          ) : (
            <div className="patient-lab-results-list">
              {labResults.map((result) => (
                <div key={result.id} className="patient-lab-result-card">
                  <div className="patient-lab-result-icon">
                    <i className="fa-solid fa-file-medical"></i>
                  </div>
                  <div className="patient-lab-result-content">
                    <div className="patient-lab-result-header-info">
                      <h5 className="patient-lab-result-title">
                        {result.examination_title || 'فحص معملي'}
                      </h5>
                      <span className="patient-lab-result-status approved">
                        <i className="fa-solid fa-check-circle ms-1"></i>
                        معتمد
                      </span>
                    </div>
                    
                    <div className="patient-lab-result-details">
                      {result.lab && result.lab.lab_name && (
                        <div className="patient-lab-result-detail-item">
                          <i className="fa-solid fa-hospital ms-2"></i>
                          <span className="detail-label">المختبر:</span>
                          <span className="detail-value">{result.lab.lab_name}</span>
                        </div>
                      )}
                      
                      <div className="patient-lab-result-detail-item">
                        <i className="fa-solid fa-calendar ms-2"></i>
                        <span className="detail-label">تاريخ الفحص:</span>
                        <span className="detail-value">{formatDate(result.created_at)}</span>
                      </div>

                    
                    </div>

                    {result.notes && (
                      <div className="patient-lab-result-notes-wrapper">
                        <div className={`patient-lab-result-notes ${expandedNotes[result.id] ? 'expanded' : 'collapsed'}`}>
                          <div className="notes-header">
                            <i className="fa-solid fa-note-sticky ms-2"></i>
                            <span className="notes-label">الملاحظات:</span>
                          </div>
                          <div className="notes-content">
                            <p>{result.notes}</p>
                          </div>
                          {shouldTruncateNotes(result.notes) && !expandedNotes[result.id] && (
                            <div className="notes-fade"></div>
                          )}
                        </div>
                        {shouldTruncateNotes(result.notes) && (
                          <button
                            className="btn-toggle-notes"
                            onClick={() => toggleNotes(result.id)}
                          >
                            {expandedNotes[result.id] ? (
                              <>
                                <i className="fa-solid fa-chevron-up ms-1"></i>
                                عرض أقل
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-chevron-down ms-1"></i>
                                عرض المزيد
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                  
                  </div>
                  
                  <div className="patient-lab-result-actions">
                    {(result.file_path || result.file_url) ? (
                      <button
                        className="btn btn-primary btn-download"
                        onClick={() => handleDownload(result)}
                      >
                        <i className="fa-solid fa-download ms-2"></i>
                        عرض/تحميل
                      </button>
                    ) : (
                      <span className="no-file-badge">
                        <i className="fa-solid fa-exclamation-triangle ms-1"></i>
                        لا يوجد ملف
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientLabResults;

