import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/img/medicinalogo.png";
import axios from "axios";

export default function Sidebar() {
  const [openItem, setOpenItem] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // ✅ safely get token & role
  const token = localStorage.getItem("token");
  const role = user?.role || "guest"; // fallback role if user is not loaded

  const handleToggle = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (token) {
      axios
        .get("/profile")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => console.error(err));
    }
  };

  // componentDidMount
  useEffect(() => {
    loadUser();
  }, []);

  // componentDidUpdate for token change
  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const logout = () => {
    localStorage.clear();
    setUser(null); // reset state
  };

  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  };

  return (
    <div>
      <nav className="sidebar">
        {/* Mobile close button */}
        <button className="mobile-close-btn" onClick={closeMobileSidebar}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="sidebar-header">
          <img
            src={logo}
            alt="logo"
            style={{ height: "90px", minWidth: "100%" }}
            className="pb-2 pr-4"
          />
        </div>

        {/* ---------- PATIENT MENU ---------- */}
        {role === "patient" && (
          <ul className="nav-list">
            <li>
              <a href="">
               <i className={`fa-solid fa-house medicina-theme-icon pb-2`}></i>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <NavLink to="/clinics">
              <i className={`fa-solid fa-hospital medicina-theme-icon pb-2`}></i>
              <span>العيادات</span>
              </NavLink>
             
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "store" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("store")}>
                <i className={`fa-solid fa-calendar medicina-theme-icon pb-2`}></i>
                <span>مواعيدي</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to="/patient/upcoming-appointments">
                    <i className={`fa-solid fa-calendar-check medicina-theme-icon pb-2`}></i>
                    <span>المواعيد القادمة</span> 
                  </NavLink>
                 
                </li>
                <li>
                  <NavLink to="/patient/past-appointments">
                    <i className={`fa-solid fa-calendar-minus medicina-theme-icon pb-2`}></i>
                    <span>المواعيد السابقة</span>                 
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <a href="">
                <i className={`fa-solid fa-file-medical medicina-theme-icon pb-2`}></i>
                <span>السجل الطبي</span>
              </a>
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <i className={`fa-solid fa-gear medicina-theme-icon pb-2`}></i>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <i className={`fa-solid fa-user medicina-theme-icon pb-2`}></i>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <i className={`fa-solid fa-power-off medicina-theme-icon pb-2`}></i>
                    <span>تسجيل الخروج</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        )}

        {/* ---------- CLINIC MENU ---------- */}
        {role === "clinic" && (
          <ul className="nav-list">
            <li>
              <a href="">
                <i className={`fa-solid fa-house medicina-theme-icon pb-2`}></i>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <a href="">
                <i className={`fa-solid fa-square-poll-vertical medicina-theme-icon pb-2`}></i>
                <span>داشبورد</span>
              </a>
            </li>
            <li>
              <NavLink 
                to="/manage/doctors"
                className={({ isActive }) => 
                  isActive || location.pathname.startsWith('/manage/doctor') 
                    ? 'active' 
                    : ''
                }
              >
                <i className={`fa-solid fa-user-doctor medicina-theme-icon pb-2`}></i>
                <span>الاطباء</span>
              </NavLink>
              
            </li>
            <li>
              <NavLink to="/clinic/appointments">
                <i className={`fa-solid fa-calendar medicina-theme-icon pb-2`}></i>
                <span>مواعيد العيادة</span>
              </NavLink>
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <i className={`fa-solid fa-gear medicina-theme-icon pb-2`}></i>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <i className={`fa-solid fa-user medicina-theme-icon pb-2`}></i>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <i className={`fa-solid fa-power-off medicina-theme-icon pb-2`}></i><span>تسجيل الخروج</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        )}

        {/* ---------- DOCTOR MENU ---------- */}
        {role === "doctor" && (
          <ul className="nav-list">
            <li>
              <a href="">
                <i className={`fa-solid fa-house medicina-theme-icon pb-2`}></i>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <a href="">
                <i className={`fa-solid fa-hospital medicina-theme-icon pb-2`}></i>
                <span>العيادات</span>
              </a>
            </li>
            <li>
              <a href="">
                <i className={`fa-solid fa-user-injured medicina-theme-icon pb-2`}></i>
                <span>المرضى</span>
              </a>
            </li>
            
           
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <i className={`fa-solid fa-gear medicina-theme-icon pb-2`}></i>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <i className={`fa-solid fa-user medicina-theme-icon pb-2`}></i>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <i className={`fa-solid fa-power-off medicina-theme-icon pb-2`}></i><span>تسجيل الخروج</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
