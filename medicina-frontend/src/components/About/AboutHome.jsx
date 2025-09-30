import React from 'react'
import about_img from '../../assets/img/aboutus-img.jpg'

const AboutHome = () => {
  return (
    <div className='about-details'>
      <section id="about" className="about section">
        <div className="container section-title" data-aos="fade-up">
          <h2>من نحن<br/></h2>
          <p>نحن منصة تربط بين المرضى والعيادات لتسهيل حجز المواعيد والتواصل بينهم بكل سهولة وفعالية.</p>
        </div>

        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
              <img src={about_img} className="img-fluid" alt=""/>
              {/* <a href="" className="glightbox pulsating-play-btn"></a> */}
            </div>
            <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="200" dir="rtl">
              <h3>نحن نسعى لتقديم حلول مبتكرة في مجال الرعاية الصحية.</h3>
              <p className="fst-italic">
                هدفنا هو تسهيل عملية حجز المواعيد والتواصل بين المرضى والعيادات بطريقة مريحة وآمنة.
              </p>
              <ul>
                <li><i className="bi bi-check2-all"></i> <span>نحن نوفر نظاماً سهلاً لحجز المواعيد الطبية.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>نحن نضمن التواصل الفعّال بين المرضى والأطباء.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>نحن نقدم حلولاً تقنية متطورة لتلبية احتياجات الرعاية الصحية.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>نحن نساعد المرضى في العثور على العيادة المناسبة بسهولة.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>نحن نؤمن بأهمية توفير الوقت والجهد لكل من المرضى والأطباء.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>نحن نعمل على تحسين تجربة الرعاية الصحية للجميع.</span></li>
              </ul>
              <p>
                انضم إلينا اليوم لتجربة خدماتنا المميزة التي تسهل حياتك وتوفر لك الوقت والجهد.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutHome