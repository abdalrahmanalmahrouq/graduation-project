import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import notificatioimg from '../assets/img/notification.png'
import profileimg from '../assets/img/profpic.png'
import axios from 'axios';

const ToolBar = ({ token }) => {
  const [user, setUser] = useState(() => {
    // ✅ Initialize directly from localStorage to avoid first-null flicker
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!user && token) {
      loadUser();
    }
  }, [token]);

  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    axios
      .get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error('Failed to load user profile in ToolBar:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      });
  };

  const { role, profile } = user || {};
  const { full_name, clinic_name } = profile || {};

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
          <button className="notification-btn">
            <img src={notificatioimg} alt="" style={{width:'20px', height:'20px'}} />
          </button>
          <div>
            <h3 className='mt-3 font-bold fw-bolder text-sky-950'>
              {!user ? (
                <span>...</span> // ⬅️ tiny placeholder instead of hiding toolbar
              ) : role === 'clinic' ? (
                clinic_name
              ) : role === 'patient' || role === 'doctor' ? (
                full_name
              ) : (
                "Unknown role"
              )}
            </h3>
          </div>
          <div className="profile-pic">
            {user ? (
              <Link to={`/${role}/account`}>
                <img src={profileimg} alt="" style={{width:'30px', height:'30px'}}/>
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
