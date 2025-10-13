import React, { Fragment, useState, useEffect } from 'react';
import { Button, Card, Container, Nav, Row, Spinner, Alert, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';
import TopPageDetails from '../TopPageDetails/TopPageDetails';


function DoctorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("locations"); // Default to "overview"
    const [selectedClinic, setSelectedClinic] = useState('');
  
    useEffect(()=>{
        fetchDoctor();
    },[id]);

    const fetchDoctor = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/doctors/profile/${id}`);
            
            if (response.data.success) {
                setDoctor(response.data.doctor);
            } else {
                setError('فشل في تحميل بيانات الطبيب');
            }
        } catch (err) {
            console.error('Error fetching doctor:', err);
            setError('فشل في تحميل بيانات الطبيب');
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
            <Container className="pt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
                <p className="mt-3">جاري تحميل بيانات الطبيب...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="pt-5 text-center">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!doctor) {
        return <div>الطبيب غير موجود</div>;
    }

 
    // Handle tab change logic
    const handleTabSelect = (selectedKey) => {
        setActiveTab(selectedKey); // This updates the active tab
    };

    // Handle clinic selection
    const handleClinicSelect = (clinicId) => {
        setSelectedClinic(clinicId);
    };

    // Handle booking appointment with selected clinic
    const handleBookAppointment = () => {
        if (selectedClinic) {
            // Navigate to appointment schedule with clinic information
            navigate(`/doctor/appointment/schedule/${id}?clinic=${selectedClinic}`);
        } else {
            // If no clinic selected, navigate without clinic parameter
            navigate(`/doctor/appointment/schedule/${id}`);
        }
    };

    return (
        <Fragment>
            <Container className='doctor-profile' dir="rtl">
                <Row>
                    <Card>
                        <Card.Header as="h5" className='doctor-title'>ملف الطبيب</Card.Header>
                        <Card.Body className="d-flex align-items-center">
                            <Card.Img
                                variant="top"
                                src={doctor.profile_image_url || getDefaultImage()}
                                className="card-img-clinics"
                                style={{ width: '150px', height: '150px', marginLeft: '20px' }}
                            />
                            <div>
                                <Card.Title className='doctor-title'>{doctor.name}</Card.Title>
                                <Card.Text>{doctor.specialization}</Card.Text>
                                
                                
                            </div>
                        </Card.Body>
                    </Card>
                </Row>

                <Row className='pt-5'>
                    <Card>
                        <Card.Header>
                            <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabSelect}>
                                
                                <Nav.Item>
                                    <Nav.Link eventKey="locations">المواقع</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="overview">نظرة عامة</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {activeTab === "overview" && (
                                <>
                                    <Card.Title className='doctor-title'>عن الطبيب</Card.Title>
                                    <Card.Text className='doctor-description'>
                                        {doctor.bio || 'لا توجد معلومات متاحة عن الطبيب حالياً'}
                                    </Card.Text>
                                </>
                            )}

                            {activeTab === "locations" && (
                                <>
                                    <Card.Title className='doctor-title'>المواقع</Card.Title>
                                    <div className='doctor-description'>
                                        {doctor.clinics && doctor.clinics.length > 0 ? (
                                            <div>
                                                <div className="mb-4">
                                                    <Form.Label className="fw-bold">اختر العيادة للحجز:</Form.Label>
                                                    <Form.Select 
                                                        value={selectedClinic} 
                                                        onChange={(e) => handleClinicSelect(e.target.value)}
                                                        className="mb-3"
                                                    >
                                                        <option value="">اختر العيادة</option>
                                                        {doctor.clinics.map((clinic, index) => (
                                                            <option key={index} value={clinic.id}>
                                                                {clinic.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                                
                                                <div className="row">
                                                    {doctor.clinics.map((clinic, index) => (
                                                        <div key={index} className="col-md-6 mb-3">
                                                            <div className={`p-3 border rounded ${selectedClinic === clinic.id ? 'border-primary bg-light' : ''}`}>
                                                                <h6 className="mb-2">
                                                                    <strong>{clinic.name}</strong>
                                                                    {selectedClinic === clinic.id && (
                                                                        <span className="badge ms-2" style={{ backgroundColor: 'var(--accent-color)' }}>محدد</span>
                                                                    )}
                                                                </h6>
                                                                {clinic.address && (
                                                                    <div className="text-muted">
                                                                        <i className="fas fa-map-marker-alt me-2"></i>
                                                                        {clinic.address}
                                                                    </div>
                                                                )}
                                                                <Button 
                                                                    variant={selectedClinic === clinic.id ? "primary" : "outline-primary"}
                                                                    size="sm" 
                                                                    className="mt-2"
                                                                    onClick={() => handleClinicSelect(clinic.id)}
                                                                >
                                                                    {selectedClinic === clinic.id ? "محدد" : "اختيار"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {selectedClinic && (
                                                    <div className="mt-4 p-3  text-white rounded" style={{ backgroundColor: 'var(--accent-color)' }}>
                                                        <h6 className="mb-2">العيادة المحددة:</h6>
                                                        <p className="mb-3 text-white">
                                                            {doctor.clinics.find(clinic => clinic.id === selectedClinic)?.name}
                                                        </p>
                                                        <Button variant="light" onClick={handleBookAppointment}>
                                                            حجز موعد في هذه العيادة
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-muted">لا توجد مواقع متاحة</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </Fragment>
    );
}

export default DoctorProfile;
