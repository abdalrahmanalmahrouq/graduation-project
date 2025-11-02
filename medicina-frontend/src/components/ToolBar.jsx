import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import profileimg from '../assets/img/profpic.png'
import axios from 'axios';

const ToolBar = ({ token }) => {
  const [user, setUser] = useState(() => {
    // ✅ Initialize directly from localStorage to avoid first-null flicker
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Always check token validity when component mounts or token changes
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  useEffect(() => {
    // Fetch notification count for patients
    if (user && user.role === 'patient') {
      fetchNotificationCount();
      // Set up polling to refresh count every 30 seconds
      const interval = setInterval(() => {
        fetchNotificationCount();
      }, 30000);

      // Refresh count when page becomes visible again
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchNotificationCount();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user]);

  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Use axios without custom headers to let interceptors handle token expiration
    axios
      .get('/profile')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error('Failed to load user profile in ToolBar:', err);
        // The global axios interceptor will handle 401 errors and clear tokens
      });
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get('/lab-results/notifications');
      const notifications = response.data.notifications || [];
      setNotificationCount(notifications.length);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      // Set count to 0 on error to avoid showing incorrect badge
      setNotificationCount(0);
    }
  };

  const { role, profile, profile_image_url } = user || {};
  const { full_name, clinic_name, lab_name } = profile || {};

  const toggleMobileSidebar = () => {
    console.log('Toggle mobile sidebar clicked'); // Debug log
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    console.log('Sidebar found:', sidebar); // Debug log
    console.log('Overlay found:', overlay); // Debug log
    
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
      console.log('Sidebar classes:', sidebar.className); // Debug log
    }
    
    if (overlay) {
      overlay.classList.toggle('active');
      console.log('Overlay classes:', overlay.className); // Debug log
    }
  };

  return (
      <header className="toolbar">
        <div className="toolbar-left">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <div className="search-bar">
            <span></span>
            <input type="search" placeholder="Search..." />
          </div>
        </div>
        <div className="toolbar-right">
          {role === 'patient' ? (
            <Link to="/patient/notifications" className="notification-btn">
              <i className={`fa-solid fa-bell`}></i>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
              )}
            </Link>
          ) : (
            <button className="notification-btn">
              <i className={`fa-solid fa-bell`}></i>
            </button>
          )}
          <div>
            <h3 className='mt-3 font-bold fw-bolder text-sky-950'>
              {!user ? (
                <span>...</span> // ⬅️ tiny placeholder instead of hiding toolbar
              ) : role === 'clinic' ? (
                clinic_name
              ) : role === 'patient' || role === 'doctor' ? (
                full_name
              ) : role === 'lab' ? (
                lab_name
              ) : (
                "Unknown role"
              )}
            </h3>
          </div>
          <div className="profile-pic">
            {user ? (
              <Link to={`/${role}/account`}>
                <img 
                  src={profile_image_url || profileimg} 
                  alt="Profile" 
                  style={{width:'30px', height:'30px'}}
                  onError={(e) => {
                    // Fallback to default image if profile image fails to load
                    e.target.src = profileimg;
                  }}
                />
              </Link>
            ) : (
              <img src={profileimg} alt="" style={{width:'30px', height:'30px', opacity:0.5}}/>
            )}
          </div>
        </div>
      </header>
  );
};

export default ToolBar;
