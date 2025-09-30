import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import TopPageDetails from '../TopPageDetails/TopPageDetails';

import { clinicsData, titles } from '../../data/clinicsData';




function AllClinics() {
    const { directory } = useParams();
    const doctors = clinicsData[directory] || []; // Get doctors for this clinic

    return (
        <>    
            <TopPageDetails pageTitle={titles[directory] || 'العيادات'} />
            <Container className="pt-5 text-center">
                <Row className="justify-content-center g-4 row-card">
                    {doctors.map((doctor, index) => (
                        <Col key={index} lg={4} md={6} sm={12} className="d-flex justify-content-center" data-aos="fade-up" data-aos-delay="200">
                            <Card style={{ width: '18rem' }} className="clinics-card">
                                <Card.Img variant="top" src={doctor.img} className="card-img-clinics" />
                                <Card.Body>
                                    <Card.Title dir="rtl">{doctor.name}</Card.Title>
                                    <Card.Text>
                                        {doctor.clinic}
                                    </Card.Text>
                                 <Link to={"/doctor/profile/"+doctor.id}>   <Button variant="primary" >المزيد</Button></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default AllClinics;
