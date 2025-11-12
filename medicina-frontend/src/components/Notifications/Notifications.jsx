import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Loading';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/lab-results/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحميل الإشعارات' });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (labResultId, decision) => {
    setProcessingId(labResultId);
    setMessage({ type: '', text: '' });

    try {
      await axios.patch(`/lab-results/${labResultId}/respond`, {
        decision: decision
      });

      setMessage({ 
        type: 'success', 
        text: decision === 'approved' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب' 
      });

      // Remove notification from list
      setNotifications(notifications.filter(n => n.id !== labResultId));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء معالجة الطلب';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="notifications-container">
      {/* Header Section */}
      <div className="notifications-header">
        <div className="notifications-header-content">
          <div className="notifications-title-section">
            <div className="notifications-icon-wrapper">
              <i className="fa-solid fa-bell notifications-main-icon"></i>
            </div>
            <div className="notifications-title-text">
              <h1 className="notifications-main-title">الإشعارات</h1>
              <p className="notifications-subtitle">طلبات نتائج الفحوصات المعملية</p>
            </div>
          </div>
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
        <Loading />
      ) : (
        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="notifications-empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-bell-slash"></i>
              </div>
              <h3>لا توجد إشعارات</h3>
              <p>لا توجد طلبات فحوصات معملية في الوقت الحالي</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <div className="notification-icon">
                    <i className="fa-solid fa-flask"></i>
                  </div>
                  <div className="notification-content">
                    <h5 className="notification-title">
                      طلب نتيجة فحص معملي
                    </h5>
                    <p className="notification-text">
                      يرجى الموافقة على السماح للمختبر برفع نتائج الفحص الخاصة بك
                    </p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        <i className="fa-regular fa-clock ms-1"></i>
                        {new Date(notification.created_at).toLocaleString('en-UK')}
                      </span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleRespond(notification.id, 'approved')}
                      disabled={processingId === notification.id}
                    >
                      {processingId === notification.id ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <>
                          <i className="fa-solid fa-check ms-1"></i>
                          قبول
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRespond(notification.id, 'rejected')}
                      disabled={processingId === notification.id}
                    >
                      <i className="fa-solid fa-times ms-1"></i>
                      رفض
                    </button>
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

export default Notifications;


