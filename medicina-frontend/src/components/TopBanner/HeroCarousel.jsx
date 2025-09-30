// import React, { useEffect, useRef } from 'react';
// import { Carousel } from 'bootstrap';

// import imghero1 from '../../assets/img/hero-bg.jpg';
// import imghero2 from '../../assets/img/hero-carousel/hero-carousel-2.jpg';
// import imghero3 from '../../assets/img/hero-carousel/hero-carousel-3.jpg';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// const TopBanner = () => {
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const carousel = new Carousel(carouselRef.current, {
//       interval: 5000,
//       ride: 'carousel',
//     });
//   }, []);

//   return (
//     <section id="hero" className="hero section">
//       <div
//         id="hero-carousel"
//         className="carousel slide carousel-fade"
//         data-bs-ride="carousel"
//         ref={carouselRef}
//       >
//         <div className="carousel-inner">
//               <div className="carousel-item active">
//                 <img
//                   src="https://i.pinimg.com/1200x/d5/a8/d4/d5a8d46e20093bec3f6b90b4a5345db1.jpg"
//                   className="d-block w-200"
//                   alt="Slide 1"
//                 />
               
//                   <div className="container">
//                     <h2>مرحبًا بكم في ميديسينا</h2>
//                     <p>
//                       نحن في <strong>ميديسينا</strong> نقدم خدمات طبية شاملة ومتميزة لضمان راحتكم وصحتكم. فريقنا الطبي ملتزم بتقديم أفضل رعاية صحية باستخدام أحدث التقنيات.
//                     </p>
//                     <a href="#about" className="btn-get-started">للمزيد</a>
//                   </div>
                
//               </div>

//           <div className="carousel-item">
//             <img src="https://i.pinimg.com/1200x/1f/50/ff/1f50ff26f906ce127ad8bf255466ad30.jpg" className="d-block w-100" alt="Slide 2" />
//             <div className="container">
//               <h2>رعاية طبية متكاملة</h2>
//               <p>نحن نؤمن بأهمية تقديم خدمات طبية متميزة وشاملة تلبي احتياجاتكم الصحية بأعلى معايير الجودة.</p>
//               <a href="#about" className="btn-get-started">اقرأ المزيد</a>
//             </div>
//           </div>

//           <div className="carousel-item">
//             <img src="https://i.pinimg.com/1200x/98/09/9d/98099d7072cbf64f1869814f658cce9f.jpg" className="d-block w-100" alt="Slide 3" />
//             <div className="container">
//               <h2>التزامنا بصحتكم</h2>
//               <p>في ميديسينا، نعمل جاهدين لضمان تقديم أفضل رعاية طبية لكم ولعائلاتكم، مع التركيز على الثقة والراحة.</p>
//               <a href="#about" className="btn-get-started">اقرأ المزيد</a>
//             </div>
//           </div>
//         </div>

//         {/* Carousel controls */}
//         <a className="carousel-control-prev" href="#hero-carousel" role="button" data-bs-slide="prev">
//           <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
//         </a>

//         <a className="carousel-control-next" href="#hero-carousel" role="button" data-bs-slide="next">
//           <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
//         </a>

//         {/* Carousel indicators */}
//         <ol className="carousel-indicators">
//           <li data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active"></li>
//           <li data-bs-target="#hero-carousel" data-bs-slide-to="1"></li>
//           <li data-bs-target="#hero-carousel" data-bs-slide-to="2"></li>
//         </ol>
//       </div>
//     </section>
//   );
// };

// export default TopBanner;



// import React, { Component } from 'react'

// import imghero1 from '../../assets/img/hero-bg.jpg'
// import imghero2 from '../../assets/img/hero-carousel/hero-carousel-2.jpg'
// import imghero3 from '../../assets/img/hero-carousel/hero-carousel-3.jpg'

//  class TopBanner extends Component {
  
//   render() {
//     return (
//       <div>
     
//     <section id="hero" className="hero section">

//       <div id="hero-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">

//       <div className="carousel-item active">
//         {/* <img src={imghero1} alt="" /> */}
//         <img src="https://img.freepik.com/free-photo/nobody-office-with-medical-equipment-instruments_482257-27345.jpg?t=st=1745157230~exp=1745160830~hmac=9687166eb28435f422d57f7ced04c73591a907d5acd504117d948f700399be61&w=1380" alt="" />
//           <div className='background0'>
//               <div className="container">
//               <h2>مرحبًا بكم في ميديسينا</h2>
//               <p>
//                 نحن في <strong>ميديسينا</strong> نقدم خدمات طبية شاملة ومتميزة لضمان راحتكم وصحتكم. فريقنا الطبي ملتزم بتقديم أفضل رعاية صحية باستخدام أحدث التقنيات.
//               </p>            
//               <a href="#about" className="btn-get-started">للمزيد</a>
//               </div>
//           </div>
//       </div>

//       <div className="carousel-item">
//         <img src={imghero3} alt="" />
//         <div className="container">
//         <h2>رعاية طبية متكاملة</h2>
//         <p>نحن نؤمن بأهمية تقديم خدمات طبية متميزة وشاملة تلبي احتياجاتكم الصحية بأعلى معايير الجودة.</p>
//         <a href="#about" className="btn-get-started">اقرأ المزيد</a>
//         </div>
//       </div>

//       <div className="carousel-item">
//         <img src={imghero3} alt="" />
//         <div className="container">
//         <h2>التزامنا بصحتكم</h2>
//         <p>في ميديسينا، نعمل جاهدين لضمان تقديم أفضل رعاية طبية لكم ولعائلاتكم، مع التركيز على الثقة والراحة.</p>
//         <a href="#about" className="btn-get-started">اقرأ المزيد</a>
//         </div>
//       </div>

//       <a className="carousel-control-prev" href="#hero-carousel" role="button" data-bs-slide="prev">
//         <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
//       </a>

//       <a className="carousel-control-next" href="#hero-carousel" role="button" data-bs-slide="next">
//         <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
//       </a>

//       <ol className="carousel-indicators"></ol>

//       </div>

//     </section>
    

    
    
//       </div>
//     )
//   }
// }

// export default TopBanner