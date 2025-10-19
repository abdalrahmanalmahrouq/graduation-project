import React, { Fragment, useState, useEffect } from 'react';
import { Button, Card, Container, Nav, Row, Spinner, Alert, Form, Badge, Col } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorHeaderCard from '../DoctorHeaderCard';



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
            <Container className='modern-appointment-container' dir="rtl">
                {/* Modern Doctor Header Card */}
                <Row className="mb-4">
                    <Col>
                        <DoctorHeaderCard 
                            doctor={doctor}
                            showStats={true}
                            showSpecialty={true}
                            imageSize="large"
                        />
                    </Col>
                </Row>

                {/* Modern Tabs Card */}
                <Row>
                    <Col>
                        <div className="modern-profile-card">
                            <div className="modern-tabs-container">
                                <Nav variant="pills" activeKey={activeTab} onSelect={handleTabSelect} className="modern-nav-tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="overview" className="modern-nav-link">
                                            <i className="fas fa-user me-2"></i>
                                            نظرة عامة
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="locations" className="modern-nav-link">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            المواقع والعيادات
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>

                            <div className="profile-content">
                                {activeTab === "overview" && (
                                    <div className="overview-section">
                                        <div className="section-header">
                                            <h3 className="section-title-doctor">
                                                <i className="fas fa-info-circle me-2"></i>
                                                عن الطبيب
                                            </h3>
                                        </div>
                                        <div className="modern-field bio-field">
                                            <div className="field-content">
                                                <div className="bio-content">
                                                    {doctor.bio ? (
                                                        <p className="doctor-bio-text">{doctor.bio}</p>
                                                    ) : (
                                                        <div className="empty-state">
                                                            <i className="fas fa-user-md empty-icon"></i>
                                                            <p className="empty-text">لا توجد معلومات متاحة عن الطبيب حالياً</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "locations" && (
                                    <div className="locations-section">
                                        <div className="section-header">
                                            <h3 className="section-title-doctor">
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                العيادات والمواقع
                                            </h3>
                                            <p className="section-subtitle">اختر العيادة المناسبة لك واحجز موعدك</p>
                                        </div>

                                        {doctor.clinics && doctor.clinics.length > 0 ? (
                                            <div className="clinics-container">
                                                {/* Quick Selection Dropdown */}
                                                <div className="clinic-selector-container">
                                                    <Form.Label className="modern-label">
                                                        <i className="fas fa-search me-2"></i>
                                                        اختر العيادة للحجز
                                                    </Form.Label>
                                                    <Form.Select 
                                                        value={selectedClinic} 
                                                        onChange={(e) => handleClinicSelect(e.target.value)}
                                                        className="modern-select clinic-selector"
                                                    >
                                                        <option value="">اختر العيادة</option>
                                                        {doctor.clinics.map((clinic, index) => (
                                                            <option key={index} value={clinic.id}>
                                                                {clinic.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                                
                                                {/* Modern Clinic Cards Grid */}
                                                <div className="clinics-grid">
                                                    {doctor.clinics.map((clinic, index) => (
                                                        <div key={index} className="clinic-card-container">
                                                            <div className={`clinic-card ${selectedClinic === clinic.id ? 'selected' : ''}`}>
                                                                <div className="clinic-card-header">
                                                                    <div className="clinic-icon">
                                                                        <i className="fas fa-hospital"></i>
                                                                    </div>
                                                                    <div className="clinic-info">
                                                                        <h4 className="clinic-name">{clinic.name}</h4>
                                                                        {selectedClinic === clinic.id && (
                                                                            <Badge bg="primary" className="selected-badge">
                                                                                <i className="fas fa-check me-1"></i>
                                                                                محدد
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                
                                                                {clinic.address && (
                                                                    <div className="clinic-address">
                                                                        <i className="fas fa-map-marker-alt"></i>
                                                                        <span>{clinic.address}</span>
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="clinic-actions">
                                                                    <Button 
                                                                        variant={selectedClinic === clinic.id ? "primary" : "outline-primary"}
                                                                        className="modern-btn clinic-select-btn"
                                                                        onClick={() => handleClinicSelect(clinic.id)}
                                                                    >
                                                                        <i className={`fas ${selectedClinic === clinic.id ? 'fa-check' : 'fa-plus'} me-2`}></i>
                                                                        {selectedClinic === clinic.id ? "محدد" : "اختيار"}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Booking Action Card */}
                                                {selectedClinic && (
                                                    <div className="booking-action-card">
                                                        <div className="booking-card-content">
                                                            <div className="booking-info">
                                                                <h4 className="booking-title">
                                                                    <i className="fas fa-calendar-check me-2"></i>
                                                                    جاهز للحجز
                                                                </h4>
                                                                <p className="booking-subtitle">
                                                                    العيادة المحددة: <strong>{doctor.clinics.find(clinic => clinic.id === selectedClinic)?.name}</strong>
                                                                </p>
                                                            </div>
                                                            <Button 
                                                                variant="primary" 
                                                                size="lg"
                                                                className="modern-btn booking-btn"
                                                                onClick={handleBookAppointment}
                                                            >
                                                                <i className="fas fa-calendar-plus me-2"></i>
                                                                حجز موعد الآن
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <i className="fas fa-hospital empty-icon"></i>
                                                <h4 className="empty-title">لا توجد عيادات متاحة</h4>
                                                <p className="empty-text">هذا الطبيب غير متاح في أي عيادة حالياً</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

export default DoctorProfile;
