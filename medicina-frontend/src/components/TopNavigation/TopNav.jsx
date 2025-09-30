import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/medicinalogo.png';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const TopNav = ({ token }) => {
  const [navMenu, setNavMenu] = useState("header d-flex align-items-center fixed-top");
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const onScroll = () => {
    if (window.scrollY > 100) {
      setNavMenu("nav-back-scroll d-flex align-items-center fixed-top header");
    } else {
      setNavMenu("header d-flex align-items-center fixed-top");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    loadUser();
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const toggleMobileNav = () => {
    document.body.classList.toggle('mobile-nav-active');
  };

  const handleNavClick = () => {
    document.body.classList.remove('mobile-nav-active');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null); // Clear user state immediately
    setAuthToken(null); // Clear token state immediately
    // Force re-render by updating state
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setAuthToken(token); // Update token state
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        setUser(null);
        setAuthToken(null);
      }
    } else if (token) {
      // Only make API request if we have a token
      axios
        .get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setAuthToken(token); // Update token state
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error('Failed to load user profile:', err);
          // Clear invalid token and user data
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setAuthToken(null);
          }
        });
    } else {
      // No token, ensure user and token states are null
      setUser(null);
      setAuthToken(null);
    }
  };

  let button;

  // Use state variable for reactive token checking
  if (authToken && user) {
    const { role } = user;
    button = (
      <div>
        <li className="dropdown" dir="rtl">
          <NavLink>
            <span>ادارة الحساب</span> 
            <i className="bi bi-chevron-down toggle-dropdown"></i>
          </NavLink>
          <ul className="dropdown-active">
            <li>
              <NavLink to="/" onClick={logout}>تسجيل الخروج</NavLink>
            </li>
            <li>
              {/* ✅ Dynamic role-based account link */}
              <NavLink to={`/${role}/account`}>حسابي</NavLink>
            </li>
          </ul>
        </li>
      </div>
    );
  } else if (authToken && !user) {
    // Show loading state when we have a token but user data is still loading
    button = <li><span>جارٍ تحميل الحساب...</span></li>;
  } else {
    button = (
      <div>
        <li className="dropdown" dir="rtl">
          <NavLink>
            <span>تسجيل الدخول </span> 
            <i className="bi bi-chevron-down toggle-dropdown"></i>
          </NavLink>
          <ul className="dropdown-active">
            <li><NavLink to="/login/patient">مريض</NavLink></li>
            <li><NavLink to="/login/clinic">عيادة</NavLink></li>
            <li><NavLink to="/login/doctor">طبيب</NavLink></li>
            <li><NavLink to="/login/lab">مختبر</NavLink></li>
          </ul>
        </li>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <header id="header" className={navMenu}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          
          {/* Logo */}
          <NavLink to="/" onClick={() => window.scrollTo(0, 0)}>
            <img 
              src={logo} 
              alt="ميديسينا" 
              className="logo d-flex align-items-center me-auto" 
              style={{ height: "90px", width: "100px" }} 
            />
          </NavLink>

          {/* Nav */}
          <nav id="navmenu" className="navmenu">
            <ul onClick={handleNavClick}>
              <li><NavLink to="/" onClick={() => window.scrollTo(0, 0)}>الصفحة الرئيسية</NavLink></li>
              <li><NavLink to="/about" onClick={() => window.scrollTo(0, 0)}>من نحن</NavLink></li>
              {/* Only show clinics link for patients or when not logged in */}
              {(!user || user.role === 'patient') && (
                <li><NavLink to="/clinics" onClick={() => window.scrollTo(0, 0)}>العيادات</NavLink></li>
              )}
              <li><NavLink to="/contact" onClick={() => window.scrollTo(0, 0)}>اتصل بنا</NavLink></li>
              {button}
            </ul>

            {/* Hamburger toggle */}
            <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggleMobileNav}></i>
          </nav>

        </div>
      </header>
    </div>
  );
};

export default TopNav;