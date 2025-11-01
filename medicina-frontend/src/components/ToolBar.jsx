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

  useEffect(() => {
    // Always check token validity when component mounts or token changes
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

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
