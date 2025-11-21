import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import { useFlashMessage } from '../../hooks/useFlashMessage';

const Notifications = () => {
  // 1. Data States
  const [labNotifications, setLabNotifications] = useState([]);
  const [labNotificationsDone, setLabNotificationsDone] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  
  // 2. UI States
  const [loading, setLoading] = useState(true);
  const { message, setMessage } = useFlashMessage();
  const [processingId, setProcessingId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 3. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 4. Fetch Data on Load or Refresh
  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/notifications');
      setLabNotifications(response.data.labNotifications || []);
      setLabNotificationsDone(response.data.labNotificationsDone || []);
      setUnreadNotifications(response.data.unreadNotifications || []);
      setReadNotifications(response.data.readNotifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحميل الإشعارات' });
    } finally {
      setLoading(false);
    }
  };

  // 5. Action Handlers
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

      // Trigger a re-fetch to move the item from "Pending" to "Done"
      setRefreshTrigger(prev => prev + 1);
    
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
      setMessage({ type: 'success', text: 'تمت القراءة بنجاج' });
      
      // Optimistic Update: Move item from Unread to Read arrays immediately
      const item = unreadNotifications.find(n => n.id === id);
      if(item) {
          setUnreadNotifications(prev => prev.filter(n => n.id !== id));
          setReadNotifications(prev => [item, ...prev]); 
      }
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  // --- CORE LOGIC: MERGE, SORT, & PAGINATE ---

  // A. Merge all arrays into one Master List
  // We add a 'category' tag to know how to render the card later
  // We add 'sortDate' to ensure we sort correctly (using approved_at for done items if available)
  const allNotifications = [
    ...labNotifications.map(n => ({ ...n, category: 'pending', sortDate: n.created_at })),
    ...labNotificationsDone.map(n => ({ ...n, category: 'done', sortDate: n.approved_at || n.updated_at })), 
    ...unreadNotifications.map(n => ({ ...n, category: 'unread', sortDate: n.created_at })),
    ...readNotifications.map(n => ({ ...n, category: 'read', sortDate: n.created_at }))
  ];

  // B. Sort: Newest First
  allNotifications.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

  // C. Pagination Calculations
  const totalItems = allNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // D. Get the items for the CURRENT page
  const currentItems = allNotifications.slice(indexOfFirstItem, indexOfLastItem);

  // E. Change Page Handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- END LOGIC ---

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

      {/* Flash Message */}
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mx-4 mt-4`} role="alert">
          {message.text}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <Loading />
      ) : (
        <div className="notifications-content">
          {totalItems === 0 ? (
            <div className="notifications-empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-bell-slash"></i>
              </div>
              <h3>لا توجد إشعارات</h3>
              <p>لا توجد اشعارات في الوقت الحالي</p>
            </div>
          ) : (
            <>
              {/* THE NOTIFICATION LIST */}
              <div className="notifications-list">
                {currentItems.map((notification) => {
                  
                  // --- RENDER CARD TYPE 1: PENDING LAB REQUEST ---
                  if (notification.category === 'pending') {
                    return (
                      <div key={`pending-${notification.id}`} className="notification-card">
                        <div className="notification-icon">
                          <i className="fa-solid fa-flask"></i>
                        </div>
                        <div className="notification-content">
                          <h5 className="notification-title">طلب نتيجة فحص معملي</h5>
                          <p className="notification-text">
                            يرجى الموافقة على السماح للمختبر برفع نتائج الفحص الخاصة بك من مختبر {notification.lab?.lab_name}
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
                              <><i className="fa-solid fa-check ms-1"></i> قبول</>
                            )}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRespond(notification.id, 'rejected')}
                            disabled={processingId === notification.id}
                          >
                            <i className="fa-solid fa-times ms-1"></i> رفض
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // --- RENDER CARD TYPE 2: LAB DONE (Approved/Rejected) ---
                  if (notification.category === 'done') {
                    return (
                      <div key={`done-${notification.id}`} className="notification-card">
                        <div className="notification-icon">
                          <i className="fa-solid fa-flask"></i>
                        </div>
                        <div className="notification-content">
                          <h5 className="notification-title">نتيجة فحص معملي</h5>
                          <p className="notification-text">
                            {notification.status === 'approved' ? (
                              <>تمت الموافقة منك على رفع الفحص المختبري من مختبر {notification.lab?.lab_name}</>
                            ) : (
                              <>تم رفض الطلب منك لرفع تقرير من المختبر {notification.lab?.lab_name}</>
                            )}
                          </p>
                          <div className="notification-meta">
                            <span className="notification-time">
                              <i className="fa-regular fa-clock ms-1"></i>
                              {notification.approved_at && (
                                <>
                                {new Date(notification.approved_at).toLocaleString('en-UK')}
                                </>
                              )}
                              {notification.rejected_at && (
                                <>
                                {new Date(notification.rejected_at).toLocaleString('en-UK')}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="notification-actions">
                          <div className="text-success">
                            <i className="fa-solid fa-check-double ms-1"></i> مقروء
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // --- RENDER CARD TYPE 3: GENERAL NOTIFICATION (Read/Unread) ---
                  const isUnread = notification.category === 'unread';
                  let iconClass = "fa-solid fa-bell";
                  if (notification.type === "lab_result_uploaded") iconClass = "fa-solid fa-flask";
                  if (notification.type === "medical_record_uploaded") iconClass = "fa-solid fa-notes-medical";

                  return (
                    <div key={`gen-${notification.id}`} className={`notification-card ${isUnread ? 'bg-light' : ''}`}>
                      <div className="notification-icon">
                        <i className={iconClass}></i>
                      </div>
                      <div className="notification-content">
                        <h5 className="notification-title">{notification.title}</h5>
                        <p className="notification-text">{notification.message}</p>
                        <div className="notification-meta">
                          <span className="notification-time">
                            <i className="fa-regular fa-clock ms-1"></i>
                            {new Date(notification.created_at).toLocaleString('en-UK')}
                          </span>
                        </div>
                      </div>
                      <div className="notification-actions">
                        {isUnread ? (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleMarkAsRead(notification.id)}>
                            <i className="fa-solid fa-check-double ms-1"></i> تحديد كمقروء
                          </button>
                        ) : (
                          <div className="text-success">
                            <i className="fa-solid fa-check-double ms-1"></i> مقروء
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 mb-4" dir="ltr">
                  <nav aria-label="Page navigation">
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          &laquo; Previous
                        </button>
                      </li>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;