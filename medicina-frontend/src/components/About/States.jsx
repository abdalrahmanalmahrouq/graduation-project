import React, { useEffect } from 'react';

const States = () => {
  useEffect(() => {
    // Load the PureCounter script manually if it's not part of index.html
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@srexi/purecounterjs/dist/purecounter_vanilla.js';
    script.async = true;
    script.onload = () => {
      new window.PureCounter(); // initialize it once the script is loaded
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div dir="rtl">
      <section id="stats" className="stats section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i className="fas fa-user-md flex-shrink-0"></i>
                <div>
                  <span
                    data-purecounter-start="0"
                    data-purecounter-end="50"
                    data-purecounter-duration="1"
                    className="purecounter"
                  ></span>
                  <p>الأطباء المسجلون</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i className="far fa-calendar-alt flex-shrink-0"></i>
                <div>
                  <span
                    data-purecounter-start="0"
                    data-purecounter-end="200"
                    data-purecounter-duration="1"
                    className="purecounter"
                  ></span>
                  <p>المواعيد المحجوزة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i className="fas fa-clinic-medical flex-shrink-0"></i>
                <div>
                  <span
                    data-purecounter-start="0"
                    data-purecounter-end="30"
                    data-purecounter-duration="1"
                    className="purecounter"
                  ></span>
                  <p>العيادات المتاحة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i className="fas fa-users flex-shrink-0"></i>
                <div>
                  <span
                    data-purecounter-start="0"
                    data-purecounter-end="500"
                    data-purecounter-duration="1"
                    className="purecounter"
                  ></span>
                  <p>المرضى المسجلين</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default States;