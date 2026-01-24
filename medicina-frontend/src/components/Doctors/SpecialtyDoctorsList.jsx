import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Row, Alert } from 'react-bootstrap';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';
import TopPageDetails from '../TopPageDetails/TopPageDetails';
import { specialtyCards } from '../../data/clinicSpecialties';
import Loading from '../Loading';

function SpecialtyDoctorsList() {
    const { directory } = useParams();
    const [specialtyDoctors, setSpecialtyDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentSpecialty = specialtyCards.find(card => card.directory === directory);
    const pageTitle = currentSpecialty?.title || 'التخصصات';

    useEffect(() => {
        fetchDoctorsBySpecialization();
    }, [directory]);

    const fetchDoctorsBySpecialization = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/doctors/by-specialization/${directory}`);
            
            if (response.data.success) {
                setSpecialtyDoctors(response.data.doctors);
            } else {
                setError('فشل في تحميل بيانات الأطباء');
            }
        } catch (err) {
            console.error('Error fetching doctors by specialization:', err);
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
                <TopPageDetails pageTitle={pageTitle} />
                <Loading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <TopPageDetails pageTitle={pageTitle} />
                <Container className="pt-5 text-center">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="primary" onClick={fetchDoctorsBySpecialization}>
                        إعادة المحاولة
                    </Button>
                </Container>
            </>
        );
    }

    return (
        <>    
            <TopPageDetails pageTitle={pageTitle} />
            <Container className="pt-5 text-center">
                {specialtyDoctors.length === 0 ? (
                    <Alert variant="info">
                        لا يوجد أطباء متاحين في هذا التخصص حالياً
                    </Alert>
                ) : (
                    <Row className="justify-content-center g-4 row-card">
                        {specialtyDoctors.map((doctor, index) => (
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

export default SpecialtyDoctorsList;
