import React, { useState } from 'react';


const PastAppointment = () => {
  // Hardcoded data - will be replaced with database data later
  const [appointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Mohammad Aziz',
      clinicName: 'ophthalmologist Alzayed Clinic',
      appointmentDate: '2023-12-10',
      appointmentTime: '9:00',
      period: 'ص',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'completed',
   
    },
    {
      id: 2,
      doctorName: 'Dr. Sarah Ahmed',
      clinicName: 'Cardiology Medical Center',
      appointmentDate: '2023-12-05',
      appointmentTime: '2:30',
      period: 'م',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'completed',
    
    },
    
    {
      id: 4,
      doctorName: 'Dr. Omar Khalil',
      clinicName: 'General Medicine Clinic',
      appointmentDate: '2023-11-15',
      appointmentTime: '4:00',
      period: 'م',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'cancelled',
     
    }
  ]);

  const handleViewReport = (appointmentId) => {
    console.log('View medical report for appointment:', appointmentId);
    // TODO: Implement view report logic
  };

  const handleBookAgain = (appointmentId) => {
    console.log('Book again with same doctor:', appointmentId);
    // TODO: Implement book again logic
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('ar-SA', options);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return '';
    }
  };

  return (
    <div className="past-appointments">
      <div className="past-appointments-header">
        <h2>المواعيد السابقة</h2>
        <div className="past-appointments-count">
          <span>{appointments.length} موعد</span>
        </div>
      </div>

      <div className="past-appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className={`past-appointment-card ${getStatusClass(appointment.status)}`}>
            <div className="past-appointment-content">
              {/* Doctor Image */}
              <div className="past-doctor-image">
                <img 
                  src={appointment.doctorImage} 
                  alt={appointment.doctorName}
                  onError={(e) => {
                    e.target.src = '/logo2.png'; // Fallback image
                  }}
                />
              </div>

              {/* Appointment Info */}
              <div className="past-appointment-info">
                <div className="past-doctor-details">
                  <h3 className="past-doctor-name">{appointment.doctorName}</h3>
                  <p className="past-clinic-name">{appointment.clinicName}</p>
                  <div className="past-appointment-status">
                    <span className={`past-status-badge ${getStatusClass(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
                
                <div className="past-appointment-datetime">
                  <div className="past-date-info">
                    <span className="past-date">{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="past-time-info">
                    <span className="past-time">{appointment.appointmentTime}</span>
                    <span className="past-period">{appointment.period}</span>
                  </div>
                </div>

                {/* Diagnosis/Notes */}
                {appointment.diagnosis && (
                  <div className="past-appointment-diagnosis">
                    <p className="past-diagnosis-text">{appointment.diagnosis}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="past-appointment-actions">
                {appointment.status === 'completed' && (
                  <>
                    <button 
                      className="past-btn-view-report"
                      onClick={() => handleViewReport(appointment.id)}
                    >
                      عرض التقرير
                    </button>
                    <button 
                      className="past-btn-book-again"
                      onClick={() => handleBookAgain(appointment.id)}
                    >
                      حجز مرة أخرى
                    </button>
                  </>
                )}
                {appointment.status === 'cancelled' && (
                  <button 
                    className="past-btn-book-again"
                    onClick={() => handleBookAgain(appointment.id)}
                  >
                    حجز مرة أخرى
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="past-no-appointments">
          <p>لا توجد مواعيد سابقة</p>
        </div>
      )}
    </div>
  );
};

export default PastAppointment;

