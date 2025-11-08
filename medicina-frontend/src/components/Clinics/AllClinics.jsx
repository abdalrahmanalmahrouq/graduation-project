import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';

import TopPageDetails from '../TopPageDetails/TopPageDetails';
import { titles } from '../../data/clinicsData';

function AllClinics() {
    const { directory } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, [directory]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/doctors/by-specialization/${directory}`);
            
            if (response.data.success) {
                setDoctors(response.data.doctors);
            } else {
                setError('فشل في تحميل بيانات الأطباء');
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('فشل في تحميل بيانات الأطباء');
        } finally {
            setLoading(false);
        }
    };

    const getDefaultImage = () => {
        // You can add a default doctor image here
        return defaultImage;
    };

    if (loading) {
        return (
            <>
                <TopPageDetails pageTitle={titles[directory] || 'العيادات'} />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p className="mt-3 text-muted">جاري التحميل ...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <TopPageDetails pageTitle={titles[directory] || 'العيادات'} />
                <Container className="pt-5 text-center">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="primary" onClick={fetchDoctors}>
                        إعادة المحاولة
                    </Button>
                </Container>
            </>
        );
    }

    return (
        <>    
            <TopPageDetails pageTitle={titles[directory] || 'العيادات'} />
            <Container className="pt-5 text-center">
                {doctors.length === 0 ? (
                    <Alert variant="info">
                        لا يوجد أطباء متاحين في هذا التخصص حالياً
                    </Alert>
                ) : (
                    <Row className="justify-content-center g-4 row-card">
                        {doctors.map((doctor, index) => (
                            <Col key={doctor.id} lg={4} md={6} sm={12} className="d-flex justify-content-center" data-aos="fade-up" data-aos-delay="200">
                                <Card style={{ width: '18rem' }} className="clinics-card">
                                    <Card.Img 
                                        variant="top" 
                                        src={doctor.profile_image_url || getDefaultImage()} 
                                        className="card-img-clinics" 
                                        onError={(e) => {
                                            e.target.src = getDefaultImage();
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title dir="rtl">{doctor.name}</Card.Title>
                                       
                                        {doctor.clinics && doctor.clinics.length > 0 && (
                                            <Card.Text className="text-muted small">
                                                <div>
                                                    <strong>العيادات:</strong>
                                                    <div className="mt-1">
                                                        <strong>{doctor.clinics.map(clinic => clinic.name).join("   ,   ")}</strong>
                                                    </div>
                                                </div>
                                            </Card.Text>
                                        )}
                                        <Link to={`/doctor/profile/${doctor.id}`}>
                                            <Button variant="primary">المزيد</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
}

export default AllClinics;
