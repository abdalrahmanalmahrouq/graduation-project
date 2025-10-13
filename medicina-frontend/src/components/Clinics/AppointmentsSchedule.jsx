import React, {  Fragment, useState, useEffect } from 'react'
import { Card, Container, Row, Spinner } from 'react-bootstrap'
import { useParams, useLocation } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';

function  AppointmentsSchedule  () {
    const { id } = useParams();
    const location = useLocation();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClinic, setSelectedClinic] = useState(null);

    useEffect(()=>{
        fetchDoctor();
    },[id]);

    // Extract clinic parameter from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const clinicId = urlParams.get('clinic');
        if (clinicId && doctor && doctor.clinics) {
            const clinic = doctor.clinics.find(c => c.id === clinicId);
            setSelectedClinic(clinic);
        }
    }, [location.search, doctor]);
   

    const getDefaultImage = () => {
        // You can add a default doctor image here
        return defaultImage;
    };
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
        }
        catch (err) {
            console.error('Error fetching doctor:', err);
            setError('فشل في تحميل بيانات الطبيب');
        }
        finally {
            setLoading(false);
        }
    }

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

    if (!doctor) {
        return <div>Doctor not found</div>;
    }
    return (
      <Fragment>
        <Container className='doctor-profile' >
                <Row >
                    <Card>
                        <Card.Header as="h5" className='doctor-title'>
                            حجز الموعد
                            {selectedClinic && (
                                <span className="ms-3 text-muted">- {selectedClinic.name}</span>
                            )}
                        </Card.Header>
                        <Card.Body className="d-flex align-items-center">
                            <Card.Img
                                variant="top"
                                src={doctor.profile_image_url || getDefaultImage()}
                                className="card-img-clinics"
                                style={{ width: '150px', height: '150px', marginLeft: '20px' }}
                            />
                            <div>
                                <Card.Title className='doctor-title'>{doctor.name}</Card.Title>
                                <Card.Text>
                                    {selectedClinic ? (
                                        <div>
                                            <strong>العيادة المحددة:</strong> {selectedClinic.name}
                                            {selectedClinic.address && (
                                                <div className="text-muted mt-1">
                                                    <i className="fas fa-map-marker-alt me-1"></i>
                                                    {selectedClinic.address}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        doctor.clinics.map(clinic => clinic.name).join(', ')
                                    )}
                                </Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>

                <Row className="pt-5">
                <AppointmentTable  />
                </Row>
        </Container>
      </Fragment>
    )
  }


export default AppointmentsSchedule
