import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/img/medicinalogo.png";
import homebanenr from "../assets/img/theme/home.png";
import clinicsbanner from "../assets/img/theme/clinics.png"
import appointmentbanner from "../assets/img/theme/appointment.png";
import upappointmentbanner from "../assets/img/theme/upcomingapointment.png";
import pastappointmentbanner from "../assets/img/theme/pastappointment.png";
import medicalrecordbanner from "../assets/img/theme/medical-record.png";
import settingsbanner from "../assets/img/theme/setting.png";
import accountbanner from "../assets/img/theme/account.png";
import doctorbanner from "../assets/img/theme/doctor.png";
import patientbanner from "../assets/img/theme/patient.png";
import dashboardbanner from "../assets/img/theme/dashboard.png"
import logoutbanner from "../assets/img/theme/power.png";

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
                <img src={homebanenr} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <NavLink to="/clinics">
              <img src={clinicsbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
              <span>العيادات</span>
              </NavLink>
             
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "store" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("store")}>
                <img src={appointmentbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>مواعيدي</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to="/patient/upcoming-appointments">
                    <img src={upappointmentbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                    <span>المواعيد القادمة</span> 
                  </NavLink>
                 
                </li>
                <li>
                  <NavLink to="/patient/past-appointments">
                    <img src={pastappointmentbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                    <span>المواعيد السابقة</span>                 
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <a href="">
                <img src={medicalrecordbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>السجل الطبي</span>
              </a>
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <img src={settingsbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <img src={accountbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <img src={logoutbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
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
                <img src={homebanenr} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <a href="">
                <img src={dashboardbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
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
                <img src={doctorbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الاطباء</span>
              </NavLink>
              
            </li>
            <li>
              <a href="">
                <img src={patientbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>مواعيد المرضى</span>
              </a>
            </li>
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <img src={settingsbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <img src={accountbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <img src={logoutbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/><span>تسجيل الخروج</span>
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
                <img src={homebanenr} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الصفحة الرئيسية</span>
              </a>
            </li>
            <li>
              <a href="">
                <img src={clinicsbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>العيادات</span>
              </a>
            </li>
            <li>
              <a href="">
                <img src={patientbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>المرضى</span>
              </a>
            </li>
            
           
            <li
              className={`nav-item-collapsible ${
                openItem === "settings" ? "open" : ""
              }`}
            >
              <a onClick={() => handleToggle("settings")}>
                <img src={settingsbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                <span>الاعدادات</span>
              </a>
              <ul className="sub-list">
                <li>
                  <NavLink to={`/${role}/account`}>
                    <img src={accountbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/>
                    <span>حسابي</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" onClick={logout}>
                     <img src={logoutbanner} alt="" style={{ height:"21px" , width:"20px" , paddingBottom:"3px"}}/><span>تسجيل الخروج</span>
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
