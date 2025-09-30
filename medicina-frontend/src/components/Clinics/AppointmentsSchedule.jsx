import React, {  Fragment } from 'react'
import { Card, Container, Row } from 'react-bootstrap'
import { clinicsData } from '../../data/clinicsData'; 
import { Link, useParams } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';


const allDoctors = Object.values(clinicsData).flat();

function  AppointmentsSchedule  () {
    const { id } = useParams();
    const doctorId = parseInt(id, 10); // Convert id from string to number
    const doctor = allDoctors.find(d => d.id === doctorId);

    if (!doctor) {
        return <div>Doctor not found</div>;
    }
    return (
      <Fragment>
        <Container className='doctor-profile' >
                <Row >
                    <Card>
                        <Card.Header as="h5" className='doctor-title'>حجز الموعد</Card.Header>
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
