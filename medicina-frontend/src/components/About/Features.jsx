import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import feature_img from '../../assets/img/featuresimage.jpg';

const Features = () => {
  return (
    <div dir="rtl">
      <section id="features" className="features section" dir="rtl">
        <div className="container">
          <div className="row justify-content-around gy-4">
            <div
              className="features-image col-lg-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img src={feature_img} alt=""/>
            </div>

            <div
              className="col-lg-5 d-flex flex-column justify-content-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3>ميزات موقعنا</h3>
              <p>
                موقعنا يهدف إلى تسهيل التواصل بين المرضى والعيادات وتنظيم المواعيد بكل سهولة وفعالية.
              </p>

              <div
                className="icon-box d-flex position-relative"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <i className="fa-solid fa-calendar-check flex-shrink-0"></i>
                <div className='features-info'>
                  <h4>
                    <a href="#clinics" className="stretched-link">تنظيم المواعيد</a>
                  </h4>
                  <p>
                    يمكنك حجز المواعيد بسهولة مع العيادات المناسبة لك عبر موقعنا.
                  </p>
                </div>
              </div>

              <div
                className="icon-box d-flex position-relative"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <i className="fa-solid fa-comments flex-shrink-0"></i>
                <div className='features-info'>
                  <h4>
                    <a href="#contact" className="stretched-link">التواصل المباشر</a>
                  </h4>
                  <p>
                    نوفر وسيلة تواصل مباشرة بين المرضى والأطباء لتسهيل الاستفسارات.
                  </p>
                </div>
              </div>

              <div
                className="icon-box d-flex position-relative"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <i className="fa-solid fa-user-md flex-shrink-0"></i>
                <div className='features-info'>
                  <h4>
                    <a href="#clinics" className="stretched-link">اختيار الطبيب المناسب</a>
                  </h4>
                  <p>
                    يمكنك البحث عن الأطباء المتخصصين واختيار الأنسب لحالتك الصحية.
                  </p>
                </div>
              </div>

              <div
                className="icon-box d-flex position-relative"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <i className="fa-solid fa-clinic-medical flex-shrink-0"></i>
                <div className='features-info'>
                  <h4>
                    <a href="#login/clinic" className="stretched-link">إدارة العيادات</a>
                  </h4>
                  <p>
                    نوفر للعيادات أدوات لإدارة المواعيد والمرضى بسهولة وفعالية.
                  </p>
                 
                </div>
              </div>

              <div
                className="button-feature d-flex position-relative"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <i ></i>
                <div className='features-info'>
                  <h4>
                     
                  </h4>
                  <p>
                 <Link to={'/register/patient'}> <Button className='btn btn'>سجل الان  </Button></Link>
                  </p>
                 
                </div>
              </div>

              {/* <Button className='btn btn-info'>Register Now ! </Button> */}
            </div>
          </div>
        
        </div>
      </section>
    </div>
  );
};

export default Features;