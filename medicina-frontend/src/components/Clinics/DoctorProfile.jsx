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
    const [selectedInsurance, setSelectedInsurance] = useState('');
    const [selectedClinic, setSelectedClinic] = useState('');
    const [clinicsWithInsurances, setClinicsWithInsurances] = useState([]);
    const [filteredClinics, setFilteredClinics] = useState([]);
  
    
    useEffect(()=>{
        fetchDoctor();
    },[id]);

    // Update filtered clinics when doctor data changes
    useEffect(() => {
        if (doctor && doctor.clinics) {
            setClinicsWithInsurances(doctor.clinics);
            setFilteredClinics(doctor.clinics);
        }
    }, [doctor]);

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
            <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري التحميل ...</p>
          </div>
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

    // Get unique insurances from all clinics
    const getUniqueInsurances = () => {
        if (!clinicsWithInsurances || clinicsWithInsurances.length === 0) return [];
        
        const insuranceMap = new Map();
        clinicsWithInsurances.forEach(clinic => {
            if (clinic.insurances) {
                clinic.insurances.forEach(insurance => {
                    insuranceMap.set(insurance.id, insurance);
                });
            }
        });
        
        return Array.from(insuranceMap.values());
    };

    // Handle insurance selection
    const handleInsuranceSelect = (insuranceId) => {
        setSelectedInsurance(insuranceId);
        setSelectedClinic(''); // Reset clinic selection
        
        if (!insuranceId) {
            // If no insurance selected, show all clinics
            setFilteredClinics(clinicsWithInsurances);
        } else {
            // Filter clinics that have the selected insurance
            const filtered = clinicsWithInsurances.filter(clinic => 
                clinic.insurances && clinic.insurances.some(insurance => insurance.id === insuranceId)
            );
            setFilteredClinics(filtered);
        }
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
                                            <p className="section-subtitle">اختر شركة التأمين ثم العيادة المناسبة لك واحجز موعدك</p>
                                        </div>

                                        {clinicsWithInsurances && clinicsWithInsurances.length > 0 ? (
                                            <div className="clinics-container">
                                                {/* Insurance Selection Dropdown */}
                                                <div className="insurance-selector-container">
                                                    <Form.Label className="modern-label">
                                                        <i className="fas fa-shield-alt me-2"></i>
                                                        اختر شركة التأمين
                                                    </Form.Label>
                                                    <Form.Select 
                                                        value={selectedInsurance} 
                                                        onChange={(e) => handleInsuranceSelect(e.target.value)}
                                                        className="modern-select insurance-selector"
                                                    >
                                                        <option value="">جميع شركات التأمين</option>
                                                        {getUniqueInsurances().map((insurance, index) => (
                                                            <option key={index} value={insurance.id}>
                                                                {insurance.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                                
                                                {/* Modern Clinic Cards Grid */}
                                                {filteredClinics.length > 0 ? (
                                                    <div className="clinics-grid pt-3">
                                                        {filteredClinics.map((clinic, index) => (
                                                        <div key={index} className="clinic-card-container">
                                                            <div className={`clinic-card ${selectedClinic === clinic.id ? 'selected' : ''}`}>
                                                                <div className="clinic-card-header">
                                                                <div className="clinic-icon">
                                                                        {clinic.profile_image_url ? (
                                                                        <img 
                                                                            src={clinic.profile_image_url} 
                                                                            alt="Clinic Logo" 
                                                                            className="clinic-profile-image"
                                                                        />
                                                                        ) : (
                                                                        <i className="fas fa-hospital"></i>
                                                                        )}
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
                                                ) : (
                                                    <div className="empty-state">
                                                        <i className="fas fa-hospital empty-icon"></i>
                                                        <h4 className="empty-title">لا توجد عيادات متاحة</h4>
                                                        <p className="empty-text">
                                                            {selectedInsurance 
                                                                ? "لا توجد عيادات متاحة لهذه شركة التأمين المحددة"
                                                                : "لا توجد عيادات متاحة حالياً"
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                
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
                                                                    العيادة المحددة: <strong>{filteredClinics.find(clinic => clinic.id === selectedClinic)?.name}</strong>
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
