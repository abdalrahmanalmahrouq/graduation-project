import React from 'react';

const Services = () => {
  return (
    <div>
      <section id="services" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2>الخدمات</h2>
          <p>نقدم خدمات تسهل التواصل بين المرضى والعيادات وتنظيم المواعيد بكل سهولة</p>
        </div>

        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                
                <h3>تنظيم المواعيد</h3>
                
                <p>نساعدك على تنظيم مواعيدك مع العيادات بسهولة وفعالية.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-pills"></i>
                </div>
                
                <h3>الوصفات الطبية</h3>
                
                <p>إمكانية الوصول إلى الوصفات الطبية الخاصة بك بسهولة عبر الموقع.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-hospital-user"></i>
                </div>
                
                <h3>التواصل مع العيادات</h3>
                
                <p>تواصل مباشر مع العيادات لتلبية احتياجاتك الطبية.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-dna"></i>
                </div>
                
                <h3>التحاليل الطبية</h3>
                
                <p>إمكانية الاطلاع على نتائج التحاليل الطبية الخاصة بك بسهولة.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-wheelchair"></i>
                </div>
                
                <h3>خدمات خاصة</h3>
                
                <p>نوفر خدمات خاصة للمرضى ذوي الاحتياجات الخاصة لتسهيل تجربتهم.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="fas fa-notes-medical"></i>
                </div>
                
                <h3>السجلات الطبية</h3>
                
                <p>إدارة سجلاتك الطبية ومشاركتها مع العيادات بسهولة وأمان.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;