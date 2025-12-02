import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';
import { Row, Col, Nav } from 'react-bootstrap'; // Ensure react-bootstrap is installed

// Sub-Components
import DoctorHeaderCard from '../DoctorHeaderCard/DoctorHeaderCard'; 
import WeeklyScheduleEditor from './WeeklyScheduleEditor';
import DoctorAppointmentsList from './DoctorAppointmentsList';



const DoctorManagement = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  // State for Tabs
  const [activeTab, setActiveTab] = useState('schedule'); 
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`/doctors/profile/${doctorId}`);
        setDoctor(response.data.doctor);
      } catch (err) {
        console.error("Error:", err);
        setError('لم يتم العثور على بيانات الطبيب');
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctorProfile();
  }, [doctorId]);

  if (loading) return <Loading />;
  
  if (error || !doctor) {
      return (
        <div className="p-5 text-center">
            <h4 className="text-danger">{error}</h4>
            <button onClick={() => navigate('/manage/doctors')} className="btn btn-link">عودة للقائمة</button>
        </div>
      );
  }

  return (
    <div className="doctor-management-page ">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-4">
          <button 
            onClick={() => navigate('/manage/doctors')} 
            className="text-gray-500 hover:text-blue-600 flex items-center gap-2 transition no-underline"
          >
            <i className="fas fa-arrow-right"></i>
            <span>عودة للقائمة</span>
          </button>
        </div>

        {/* 1. Doctor Header Banner */}
        <Row className="mb-4">
            <Col>
                <DoctorHeaderCard 
                    doctor={doctor}
                    showStats={false}
                    showInfo={true}
                    showSpecialty={true}
                    imageSize="large"
                />
            </Col>
        </Row>

        {/* 2. Modern Profile Card with Tabs */}
        <Row>
            <Col>
                <div className="modern-profile-card">
                    {/* Tabs Navigation */}
                    <div className="modern-tabs-container">
                        <Nav 
                            variant="pills" 
                            activeKey={activeTab} 
                            onSelect={(k) => setActiveTab(k)} 
                            className="modern-nav-tabs"
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="schedule" className="modern-nav-link">
                                    <i className="fas fa-calendar-alt me-2"></i>
                                    جدول العمل الأسبوعي
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="appointments" className="modern-nav-link">
                                    <i className="fas fa-calendar-check me-2"></i>
                                    إدارة المواعيد
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    {/* Tab Content Area */}
                    <div className="profile-content">
                        {activeTab === "schedule" && (
                            <div className="schedule-section animate-fadeIn">
                                <div className="section-header">
                                    <h3 className="section-title-doctor">
                                        <i className="fas fa-clock me-2"></i>
                                        أوقات الدوام
                                    </h3>
                                    <p className="section-subtitle">عرض وتعديل جدول عمل الطبيب في العيادة</p>
                                </div>
                                
                                {/* The Schedule Editor Component */}
                                <WeeklyScheduleEditor doctorId={doctorId} />
                            </div>
                        )}

                        {activeTab === "appointments" && (
                            <div className="appointments-section animate-fadeIn">
                                <div className="section-header">
                                    <h3 className="section-title-doctor">
                                        <i className="fas fa-list-alt me-2"></i>
                                        سجل المواعيد
                                    </h3>
                                    <p className="section-subtitle">عرض المواعيد المحجوزة والسابقة</p>
                                </div>

                                {/* Placeholder for appointments */}
                                <DoctorAppointmentsList doctorId={doctor.id}/>
                            </div>
                        )}
                    </div>
                </div>
            </Col>
        </Row>

      </div>
    </div>
  );
};

export default DoctorManagement;