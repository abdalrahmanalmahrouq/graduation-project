import React, {  useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';


function FeatureBanner () {

  useEffect(() => {
      AOS.init({ duration: 1000});
    }, []);
  
    return (
      <div className='App' dir="rtl">
        <section id="featured-services" className="featured-services section justify-content-center">
        <div className="container section-title justify-content-center">
        <h2 className='text-center'>المميزات<br/></h2>
       
        </div>

<div className="container">

<div className="row gy-4 justify-content-center">

  <div className="col-xl-3 col-md-6 d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
  <div className="service-item position-relative feature-pargraph">
    <div className="icon"><i className="fas fa-heartbeat icon"></i></div>
    <h4>خدمات القلب</h4>
    <p>نقدم خدمات متخصصة في رعاية القلب لضمان صحتكم وسلامتكم.</p>
  </div>
  </div>

  <div className="col-xl-3 col-md-6 d-flex justify-content-center" data-aos="fade-up" data-aos-delay="200">
  <div className="service-item position-relative feature-pargraph">
    <div className="icon"><i className="fas fa-pills icon"></i></div>
    <h4>الأدوية والعلاج</h4>
    <p>نوفر مجموعة واسعة من الأدوية والعلاجات لتلبية احتياجاتكم الصحية.</p>
  </div>
  </div>

  <div className="col-xl-3 col-md-6 d-flex justify-content-center" data-aos="fade-up" data-aos-delay="300">
  <div className="service-item position-relative feature-pargraph">
    <div className="icon"><i className="fas fa-thermometer icon"></i></div>
    <h4>الفحوصات الطبية</h4>
    <p>نقدم خدمات فحص دقيقة وشاملة لضمان التشخيص السليم.</p>
  </div>
  </div>

  <div className="col-xl-3 col-md-6 d-flex justify-content-center" data-aos="fade-up" data-aos-delay="400">
  <div className="service-item position-relative feature-pargraph">
    <div className="icon"><i className="fas fa-stethoscope icon"></i></div>
    <h4>الاستشارات الطبية</h4>
    <p>نساعدكم في فهم الجوانب الطبية لصحتكم لتقديم رعاية مخصصة.</p>
  </div>
  </div>

</div>

</div>

</section>
      </div>
    )
 
}

export default FeatureBanner
