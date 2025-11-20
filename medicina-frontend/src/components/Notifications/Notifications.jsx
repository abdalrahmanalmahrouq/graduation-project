import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav } from 'react-bootstrap'
import Loading from '../Loading';
import { useFlashMessage } from '../../hooks/useFlashMessage';
const Notifications = () => {
  const [labNotifications, setLabNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("nonReadNotifications")
  const {message, setMessage} = useFlashMessage();
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/notifications');
      setLabNotifications(response.data.labNotifications || []);
      setUnreadNotifications(response.data.unreadNotifications || []);
      setReadNotifications(response.data.readNotifications || []);
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
      setLabNotifications(prev =>
        prev.filter(n => n.id !== labResultId)
      );
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء معالجة الطلب';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setMessage({ 
        type: 'success', 
        text: 'تمت القراءة بنجاج'
      });
      setUnreadNotifications(prev => prev.filter(n => n.id !== id));
      setReadNotifications(prev => [
        ...prev,
        unreadNotifications.find(n => n.id === id)
      ]);
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const handleTabSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  }
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
              <p className="notifications-subtitle"> جميع اشعارات المريض المقروءة و الغير المقروءة في العيادة</p>
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

        <div>
           <div className="modern-tabs-container-notifications" >
              <Nav variant="pills" activeKey={activeTab} onSelect={handleTabSelect} className="modern-nav-tabs">
                  <Nav.Item>
                      <Nav.Link eventKey="nonReadNotifications" className="modern-nav-link">
                          <i className="fas fa-bell me-2"></i>
                         الاشعارات الغير المقروءة
                      </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="ReadNotifications" className="modern-nav-link">
                          <i className="fas fa-bell-slash me-2"></i>
                         كل الاشعارات
                      </Nav.Link>
                  </Nav.Item>
              </Nav>
          </div>
        <div className="notifications-content">


          {activeTab === "nonReadNotifications" && (
            <div>
            {unreadNotifications.length === 0 && labNotifications.length === 0 ? (
              <div className="notifications-empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-bell-slash"></i>
              </div>
              <h3>لا توجد إشعارات</h3>
              <p>لا توجد اشعارات في الوقت الحالي</p>
            </div>
            ): (
              <div className="notifications-list">
              {labNotifications.map((notification) => (
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
  
              {unreadNotifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <div className="notification-icon">
                    {/* Choose icon based on type */}
                    {notification.type === "lab_result_uploaded" && (
                      <i className="fa-solid fa-flask"></i>
                    )}
                    {notification.type === "medical_record_uploaded" && (
                      <i className="fa-solid fa-notes-medical"></i>
                    )}
                    {notification.type !== "lab_result_uploaded" &&
                      notification.type !== "medical_record_uploaded" && (
                        <i className="fa-solid fa-bell"></i>
                    )}
                  </div>
  
                  <div className="notification-content">
                    <h5 className="notification-title">
                      {notification.title}
                    </h5>
  
                    <p className="notification-text">
                      {notification.message}
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
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <i className="fa-solid fa-check-double ms-1"></i>
                      تحديد كمقروء
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
           </div>
          )}
         
         {activeTab === "ReadNotifications" && (
          <div>
             {readNotifications.length === 0 ? (
              <div className="notifications-empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-bell-slash"></i>
              </div>
              <h3>لا توجد إشعارات</h3>
              <p>لا توجد اشعارات في الوقت الحالي</p>
            </div>
             ): (
              <div className="notifications-list">
              {readNotifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <div className="notification-icon">
                    {/* Choose icon based on type */}
                    {notification.type === "lab_result_uploaded" && (
                      <i className="fa-solid fa-flask"></i>
                    )}
                    {notification.type === "medical_record_uploaded" && (
                      <i className="fa-solid fa-notes-medical"></i>
                    )}
                    {notification.type !== "lab_result_uploaded" &&
                      notification.type !== "medical_record_uploaded" && (
                        <i className="fa-solid fa-bell"></i>
                    )}
                  </div>
  
                  <div className="notification-content">
                    <h5 className="notification-title">
                      {notification.title}
                    </h5>
  
                    <p className="notification-text">
                      {notification.message}
                    </p>
  
                    <div className="notification-meta">
                      <span className="notification-time">
                        <i className="fa-regular fa-clock ms-1"></i>
                        {new Date(notification.created_at).toLocaleString('en-UK')}
                      </span>
                    </div>
                  </div>
  
                  <div className="notification-actions">
                    <div className="text-success">
                      <i className="fa-solid fa-check-double ms-1"></i>
                      مقروء
                    </div>
                  </div>
                </div>
              ))}
              </div>
             )}
          </div>
         )}
         
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;


