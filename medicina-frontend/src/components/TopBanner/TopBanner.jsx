import React, { useEffect, useRef } from 'react';
import { Carousel } from 'bootstrap';

import imghero1 from '../../assets/img/topbanner/Adobe Express - file (1) (1).png';
import imghero2 from '../../assets/img/topbanner/Adobe Express - file (1) (1).jpg';
import imghero3 from '../../assets/img/topbanner/Adobe Express - file (2).jpg';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const TopBanner = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = new Carousel(carouselRef.current, {
      interval: 5000,
      ride: 'carousel',
    });
  }, []);

  return (
    <section id="hero" className="hero section">
      <div
        id="hero-carousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        ref={carouselRef}
      >
        <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={imghero1}
                  className="d-block w-200"
                  alt="Slide 1"
                />
               
                  <div className="container">
                    <h2>مرحبًا بكم في ميديسينا</h2>
                    <p>
                      نحن في <strong>ميديسينا</strong> نقدم خدمات طبية شاملة ومتميزة لضمان راحتكم وصحتكم. فريقنا الطبي ملتزم بتقديم أفضل رعاية صحية باستخدام أحدث التقنيات.
                    </p>
                    <a href="#about" className="btn-get-started">للمزيد</a>
                  </div>
                
              </div>

          <div className="carousel-item">
            <img src={imghero2}className="d-block w-100" alt="Slide 2" />
            <div className="container">
              <h2>رعاية طبية متكاملة</h2>
              <p>نحن نؤمن بأهمية تقديم خدمات طبية متميزة وشاملة تلبي احتياجاتكم الصحية بأعلى معايير الجودة.</p>
              <a href="#about" className="btn-get-started">اقرأ المزيد</a>
            </div>
          </div>

          <div className="carousel-item">
            <img src={imghero3} className="d-block w-100" alt="Slide 3" />
            <div className="container">
              <h2>التزامنا بصحتكم</h2>
              <p>في ميديسينا، نعمل جاهدين لضمان تقديم أفضل رعاية طبية لكم ولعائلاتكم، مع التركيز على الثقة والراحة.</p>
              <a href="#about" className="btn-get-started">اقرأ المزيد</a>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <a className="carousel-control-prev" href="#hero-carousel" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
        </a>

        <a className="carousel-control-next" href="#hero-carousel" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
        </a>

        {/* Carousel indicators */}
        <ol className="carousel-indicators">
          <li data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="1"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="2"></li>
        </ol>
      </div>
    </section>
  );
};

export default TopBanner;