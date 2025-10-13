import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <div dir="rtl">
      <footer id="footer" className="footer light-background">
        <div className="container footer-top">
          <div className="row gy-4">
      
            <div className="col-lg-4 col-md-6 footer-about">
              
              <NavLink className="logo d-flex align-items-center" to="/"  onClick={() => window.scrollTo(0, 0)} > 
              <span className="sitename">ميديسينا</span>
              </NavLink>
               
              
              <div className="footer-contact pt-3">
                <p>شارع تكنولوجيا المعلومات 100</p>
                <p>الجامعة الهاشمية HU 330127</p>
                <p className="mt-3">
                  <strong>الهاتف:</strong> <span dir='ltr'>+79 10 44 738</span>
                </p>
                <p>
                  <strong>البريد الإلكتروني:</strong> <span>medicinahu@gmail.com</span>
                </p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="/">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="/">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="/">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="/">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>روابط مفيدة</h4>
              <ul>
                <li>
                  
                <NavLink to="/"  onClick={() => window.scrollTo(0, 0)} >الصفحة الرئيسية</NavLink>
                </li>
                <li>
                  <a href="#about">من نحن</a>
                </li>
                <li>
                  <a href="#clinics">العيادات</a>
                </li>
                <li>
                  <a href="#contact">اتصل بنا</a>
                </li>
                {/* <li>
                  <a href="#">شروط الخدمة</a>
                </li> */}
                {/* <li>
                  <a href="#">سياسة الخصوصية</a>
                </li> */}
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>خدماتنا</h4>
              <ul>
              <li>
                 رفع التقارير الطبية
                </li>
                <li>
                  تواصل مع الأطباء
                </li>
                <li>
                 خدمات التشخيص  
                </li>
                <li>
                  حجز مواعيد
                </li>
                <li>
                  إدارة المواعيد
                </li>
                
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>عياداتنا</h4>
              <ul>
                <li>
                  <a href="#clinics/Dentistry">عيادة الأسنان</a>
                </li>
                <li>
                  <a href="#clinics/Pediatrics">عيادة الأطفال</a>
                </li>
                <li>
                  <a href="#clinics/Dermatology">عيادة الجلدية</a>
                </li>
                <li>
                  <a href="#clinics/Ophthalmology">عيادة العيون</a>
                </li>
                <li>
                  <a href="#clinics/Cardiology">عيادة القلب</a>
                </li>
                <li>
                  <a href="#clinics/Gynecology">عيادة النساء</a>
                </li>
                <li>
                  <a href="#clinics/ENT">عيادة الأنف والأذن</a>
                </li>
                <li>
                  <a href="#clinics/Orthopedics">عيادة العظام</a>
                </li>
                <li>
                  <a href="#clinics/Neurology">عيادة الأعصاب</a>
                </li>
                <li>
                  <a href="#clinics/Gastroenterology">عيادة الباطنة</a>
                </li>
                <li>
                  <a href="#clinics/Pulmonology">عيادة الجهاز التنفسي</a>
                </li>
                <li>
                  <a href="#clinics/Gastroenterology">عيادة الجهاز الهضمي</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>تواصل معنا</h4>
              <ul>
                <li>
                  <a href="#contact">الدعم الفني</a>
                </li>
                <li>
                  <a href="#contact">الأسئلة الشائعة</a>
                </li>
                {/* <li>
                  <a href="#">الشكاوى</a>
                </li> */}
                <li>
                  <a href="#contact">الاقتراحات</a>
                </li>
                <li>
                  <a href="#contact">اتصل بنا</a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>
            © <span>حقوق النشر</span>{' '}
            <strong className="px-1 sitename">ميديسينا</strong>{' '}
            <span>جميع الحقوق محفوظة</span>
          </p>
          <div className="credits"></div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;