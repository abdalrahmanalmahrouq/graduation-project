import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { specialtyCards } from '../../data/clinicSpecialties'
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

const ClinicSpecialtiesGrid = () => {
  const images = {
    kid_img,
    eyes_img,
    teeth_img,
    women_img,
    heart_img,
    skin_img,
    bone_img,
    ears_img,
    neuron_img,
    interior_img,
    chest_img,
    digestive_img,
  };

  const cardsWithImages = specialtyCards.map(card => ({
    ...card,
    image: images[card.imageKey],
  }));

  return (
    <div>
      <Container className='pt-5 text-center ' data-aos="fade-up" data-aos-delay="200">
        <div className="container section-title" data-aos="fade-up">
          <h2>احجز الآن<br/></h2>
          <p>نحن منصة تربط بين المرضى والعيادات لتسهيل حجز المواعيد والتواصل بينهم بكل سهولة وفعالية.</p>
        </div>
        <Row className="justify-content-center g-4 row-card" >
          {cardsWithImages.map((clinic, index) => (
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

export default ClinicSpecialtiesGrid

