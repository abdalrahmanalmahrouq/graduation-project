import React, { Fragment, useState } from 'react';
import { Button, Card, Container, Nav, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { clinicsData } from '../../data/clinicsData'; // Assuming clinicsData is imported

// Flatten all doctors into one array:
const allDoctors = Object.values(clinicsData).flat();

function DoctorProfile() {
    const { id } = useParams();
    const doctorId = parseInt(id, 10); // Convert id from string to number
    const doctor = allDoctors.find(d => d.id === doctorId);

       // Always call useState at the top level of your component
       const [activeTab, setActiveTab] = useState("overview"); // Default to "overview"

    if (!doctor) {
        return <div>Doctor not found</div>;
    }

 
    // Handle tab change logic
    const handleTabSelect = (selectedKey) => {
        setActiveTab(selectedKey); // This updates the active tab
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
                                src={doctor.img}
                                className="card-img-clinics"
                                style={{ width: '150px', height: '150px', marginLeft: '20px' }}
                            />
                            <div>
                                <Card.Title className='doctor-title'>{doctor.name}</Card.Title>
                                <Card.Text>{doctor.clinic}</Card.Text>
                                <Link to={"/doctor/appointment/schedule/"+doctor.id}> <Button variant="primary">حجز موعد</Button></Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>

                <Row className='pt-5'>
                    <Card>
                        <Card.Header>
                            <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabSelect}>
                                <Nav.Item>
                                    <Nav.Link eventKey="overview">نظرة عامة</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="locations">المواقع</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {activeTab === "overview" && (
                                <>
                                    <Card.Title className='doctor-title'>عن الطبيب</Card.Title>
                                    <Card.Text className='doctor-description'>
                                        {doctor.aboutMe}
                                    </Card.Text>
                                </>
                            )}

                            {activeTab === "locations" && (
                                <>
                                    <Card.Title className='doctor-title'>المواقع</Card.Title>
                                    <div className='doctor-description'>
                                        <ul>
                                            {/* Displaying doctor's locations dynamically */}
                                            {doctor.locations ? doctor.locations.map((location, index) => (
                                                <li key={index}>{location}</li>
                                            )) : <li>لا توجد مواقع متاحة</li>}
                                        </ul>
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
