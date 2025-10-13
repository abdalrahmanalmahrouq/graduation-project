import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import kid_img from '../../assets/img/clinics/kids.jpg'
import eyes_img from '../../assets/img/clinics/eyes.jpg'
import teeth_img from '../../assets/img/clinics/teeth.jpg'
import women_img from '../../assets/img/clinics/women.jpg'
import heart_img from '../../assets/img/clinics/heart.jpg'
import skin_img from '../../assets/img/clinics/skinjpg.jpg'
import bone_img from '../../assets/img/clinics/bone.jpg'
import ears_img from '../../assets/img/clinics/earsjpg.jpg'
import neuron_img from '../../assets/img/clinics/neuron.jpg'
import interior_img from '../../assets/img/clinics/interiorjpg.jpg'
import chest_img from '../../assets/img/clinics/chest.jpg'
import digestive_img from '../../assets/img/clinics/digestive.jpg'
import { Link } from 'react-router-dom'

const ClinicsDetails = () => {
  const clinics = [
    {
      title: "عيادات الأسنان",
      description: "نقدم خدمات شاملة للعناية بالأسنان باستخدام أحدث التقنيات.",
      image: teeth_img,
      directory: 'Dentistry'
    },
    {
      title: "عيادات العيون",
      description: "فحص شامل للعيون وعلاج مشاكل الرؤية بأحدث الأجهزة.",
      image: eyes_img,
      directory: 'Ophthalmology'
    },
    {
      title: "عيادات الأطفال",
      description: "رعاية طبية متكاملة للأطفال من جميع الأعمار.",
      image: kid_img,
      directory: 'Pediatrics'
    },
    {
      title: "عيادات الجلدية",
      description: "علاج مشاكل البشرة والشعر بأحدث التقنيات.",
      image: skin_img,
      directory: 'Dermatology'
    },
    {
      title: "عيادات القلب",
      description: "تشخيص وعلاج أمراض القلب بأيدي أطباء متخصصين.",
      image: heart_img,
      directory: 'Cardiology'
    },
    {
      title: "عيادات النساء",
      description: "خدمات طبية شاملة للنساء في جميع المراحل العمرية.",
      image: women_img,
      directory: 'Gynecology'
    },
    {
      title: "عيادات الأنف والأذن والحنجرة",
      description: "تشخيص وعلاج أمراض الأنف والأذن والحنجرة.",
      image: ears_img,
      directory: 'ENT'
    },
    {
      title: "عيادات العظام",
      description: "علاج مشاكل العظام والمفاصل بأحدث الطرق الطبية.",
      image: bone_img,
      directory: 'orthopedic'
    },
    {
      title: "عيادات الأعصاب",
      description: "رعاية متخصصة لعلاج أمراض الجهاز العصبي.",
      image: neuron_img,
      directory: 'neurology'
    },
    {
      title: "عيادات الجهاز الهضمي",
      description: "تشخيص وعلاج أمراض الجهاز الهضمي والكبد.",
      image: digestive_img,
      directory: 'digestive'
    },
    {
      title: "عيادات الجهاز التنفسي",
      description: "علاج أمراض الجهاز التنفسي والرئة.",
      image: chest_img,
      directory: 'Pulmonology'
    },
    {
      title: "عيادات الباطنية",
      description: "تقديم خدمات طبية شاملة للأمراض الباطنية.",
      image: interior_img,
      directory: 'Gastroenterology'
    },
  ];

  return (
    <div>
      <Container className='pt-5 text-center ' data-aos="fade-up" data-aos-delay="200">
        <div className="container section-title" data-aos="fade-up">
          <h2>احجز الآن<br/></h2>
          <p>نحن منصة تربط بين المرضى والعيادات لتسهيل حجز المواعيد والتواصل بينهم بكل سهولة وفعالية.</p>
        </div>
        <Row className="justify-content-center g-4 row-card" >
          {clinics.map((clinic, index) => (
            <Col key={index} lg={4} md={6} sm={12} className="d-flex justify-content-center" data-aos="fade-up" data-aos-delay="200">
              <Card style={{ width: '18rem' }} className='clinics-card'>
                <Card.Img variant="top" src={clinic.image} className='card-img-clinics' />
                <Card.Body>
                  <Card.Title>{clinic.title}</Card.Title>
                  <Card.Text>{clinic.description}</Card.Text>
                  <Link to={'/clinics/'+clinic.directory}>  <Button variant="primary">المزيد من التفاصيل</Button></Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ClinicsDetails