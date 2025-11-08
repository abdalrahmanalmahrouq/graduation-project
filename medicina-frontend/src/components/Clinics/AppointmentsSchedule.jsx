import React, {  Fragment, useState, useEffect } from 'react'
import { Card, Container, Row, Spinner,Col } from 'react-bootstrap'
import { useParams, useLocation } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';
import DoctorHeaderCard from '../DoctorHeaderCard';

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
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
                </div>
                <p className="mt-3 text-muted">جاري التحميل ...</p>
            </div>
        );
    }

    if (!doctor) {
        return <div>Doctor not found</div>;
    }
    return (
      <Fragment>
        <Container className='doctor-profile' >
                 {/* Modern Doctor Header Card */}
                 <Row className="mb-4">
                    <Col>
                        <DoctorHeaderCard 
                            doctor={doctor}
                            showStats={false}
                            showSpecialty={true}
                            selectedClinic={selectedClinic}
                            imageSize="large"
                        />
                    </Col>
                </Row>

                <Row className="pt-5">
                <AppointmentTable 
                    doctorId={doctor?.id} 
                    clinicId={selectedClinic?.id} 
                />
                </Row>
        </Container>
      </Fragment>
    )
  }


export default AppointmentsSchedule
