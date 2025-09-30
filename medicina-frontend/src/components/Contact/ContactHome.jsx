import React from 'react';

const ContactHome = () => {
  return (
    <div>
      <section id="contact" className="contact section">
        <div className="container section-title" data-aos="fade-up">
          <h2>تواصل معنا</h2>
          <p>يمكنك التواصل معنا لترتيب المواعيد والتواصل بين المرضى والعيادات عبر موقعنا الإلكتروني</p>
        </div>

        <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
          <iframe
            style={{ border: 0, width: '100%', height: '370px' }}
            
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2279.602059965359!2d36.184969112257555!3d32.10004860928629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b73b8f05b73b3%3A0xbb538a62e4116f2d!2z2YPZhNmK2Kkg2KfZhNij2YXZitixINin2YTYrdiz2YrZhiDYqNmGINi52KjYr9in2YTZhNmHINin2YTYq9in2YbZiiDZhNiq2YPYqtmI2YTZiNis2YrYpyDYp9mE2YXYudmE2YjZhdin2Ko!5e0!3m2!1sen!2sjo!4v1745065695602!5m2!1sen!2sjo"
            frameBorder="0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="row gy-4">
                <div className="col-lg-12">
                  <div
                    className="info-item d-flex flex-column justify-content-center align-items-center"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <i className="bi bi-geo-alt"></i>
                    <h3>العنوان</h3>
                    <p>شارع تكنولوجيا المعلومات 100 HU 330127</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="info-item d-flex flex-column justify-content-center align-items-center"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <i className="bi bi-phone"></i>
                    <h3>اتصل بنا</h3>
                    <p><span dir='ltr'>+79 10 44 738</span></p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="info-item d-flex flex-column justify-content-center align-items-center"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <i className="bi bi-envelope"></i>
                    <h3>البريد الإلكتروني</h3>
                    <p>medicinahu@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <form
                action="forms/contact.php"
                method="post"
                className="php-email-form"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="row gy-4">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="اسمك"
                      required=""
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="بريدك الإلكتروني"
                      required=""
                    />
                  </div>

                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="الموضوع"
                      required=""
                    />
                  </div>

                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="4"
                      placeholder="رسالتك"
                      required=""
                    ></textarea>
                  </div>

                  <div className="col-md-12 text-center">
                    <div className="loading">جاري الإرسال...</div>
                    <div className="error-message"></div>
                    <div className="sent-message">تم إرسال رسالتك بنجاح. شكراً لك!</div>

                    <button type="submit">إرسال الرسالة</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactHome;