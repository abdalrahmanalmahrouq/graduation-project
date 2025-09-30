import React from 'react';
import img1 from '../../assets/img/aboutimglogo.png'
import img2 from '../../assets/img/aboutimgfeature.jpg'
import img3 from '../../assets/img/meetourteam.jpg'

const AboutDetails = () => {
  return (
    <div className="container about-details">
      <div className="container section-title" data-aos="fade-up">
        <h2>اكتشف المزيد<br/></h2>
        <p>نحن منصة تربط بين المرضى والعيادات لتسهيل حجز المواعيد والتواصل بينهم بكل سهولة وفعالية.</p>
      </div>
      <div className="row gy-4">
        <div className="col-lg-6 position-relative align-self-start text-center" data-aos="fade-up" data-aos-delay="100">
          <img src={img1} className="img-fluid" alt="" style={{height:300}}/>
          {/* <a href="" className="glightbox pulsating-play-btn"></a> */}
        </div>
        <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="200" dir="rtl">
          <h3 className="about-subtitle">💡 قصة اسم ميديسينا</h3>
         
          <p className="about-text">
            في بدايات مشروعنا، تساءلنا: كيف يمكننا أن نبتكر اسمًا يُجسّد جوهر الطب، لكن بروح عصرية؟ وبينما كنا نناقش أفكارًا عديدة، ألهمنا اسم العالم المسلم ابن سينا، رائد الطب القديم، والذي ألّف أعظم الكتب الطبية مثل "القانون في الطب".
            فجاءت فكرة الدمج بين "Medicine" و"ابن سينا"، لتولد كلمة <strong>"ميديسينا"</strong> — اسم يعكس الجذور العريقة للطب الإسلامي مع انطلاقة نحو المستقبل الذكي.
          </p>
        </div>
      </div>

      <div className="row gy-4 pt-5">
        <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
          <img src={img2}  className="img-fluid" alt=""/>
        </div>
         
        <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="200" dir="rtl">
          <h3 className="about-subtitle pt-3"> ⚙️ مميزات منصتنا</h3>
         
          <p className="about-text">
            Medicina ليست منصة تقليدية، بل هي نتيجة لشغف بالتكنولوجيا وحرص على تطوير الرعاية الصحية.
            من أبرز الميزات:
          </p>
          <ul className="about-list">
            <li><strong>🧠 المساعد الذكي:</strong> روبوت يساعدك على فهم الأعراض وتقديم اقتراحات مبدئية.</li>
            <li><strong>🏥 ملفات العيادات:</strong> كل عيادة لها حسابها وخدماتها وتواصل مباشر.</li>
            <li><strong>🔬 دعم المختبرات:</strong> يمكن رفع نتائج الأشعة والتحاليل وربطها مع المريض.</li>
            <li><strong>🔒 أمان وخصوصية:</strong> حماية متكاملة للبيانات باستخدام تقنيات التشفير.</li>
          </ul>
        </div>
      </div>

      <div className="row gy-4 pt-5">
        <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
          <img src={img3} className="img-fluid" alt=""/>
          {/* <a href="" className="glightbox pulsating-play-btn"></a> */}
        </div>
        <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="200" dir="rtl">
          <h3 className="about-subtitle pt-5">👨‍💻 عن فريقنا</h3>
          <p className="about-text">
            نحن مجموعة طلاب في مجال نظم المعلومات الحاسوبية، اجتمعنا و خططنا، وقررنا أن نصنع شيئًا حقيقيًا يخدم الناس. بدأ كل شيء بفكرة، ثم تصميم، ثم تطوير استمر لأشهر. هدفنا الأساسي أن نخدم الإنسان بالتكنولوجيا، وأن نُقرّب الرعاية الصحية للناس بأسهل الطرق.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutDetails;