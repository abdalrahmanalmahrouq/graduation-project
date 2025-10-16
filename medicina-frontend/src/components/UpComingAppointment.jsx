import React, { useState } from 'react';


const UpComingAppointment = () => {
  // Hardcoded data - will be replaced with database data later
  const [appointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Mohammad Aziz',
      clinicName: 'ophthalmologist Alzayed Clinic',
      appointmentDate: '2024-01-15',
      appointmentTime: '9:00',
      period: 'ص',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'upcoming'
    },
    {
      id: 2,
      doctorName: 'Dr. Sarah Ahmed',
      clinicName: 'Cardiology Medical Center',
      appointmentDate: '2024-01-16',
      appointmentTime: '2:30',
      period: 'م',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'upcoming'
    },
    {
      id: 3,
      doctorName: 'Dr. Ahmed Hassan',
      clinicName: 'Dermatology Specialized Clinic',
      appointmentDate: '2024-01-18',
      appointmentTime: '11:00',
      period: 'ص',
      doctorImage: '/src/assets/img/doctor-placeholder.jpg',
      status: 'upcoming'
    }
  ]);

  const handleReschedule = (appointmentId) => {
    console.log('Reschedule appointment:', appointmentId);
    // TODO: Implement reschedule logic
  };

  const handleCancel = (appointmentId) => {
    console.log('Cancel appointment:', appointmentId);
    // TODO: Implement cancel logic
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

  return (
    <div className="upcoming-appointments">
      <div className="upcoming-appointments-header">
        <h2>المواعيد القادمة</h2>
        <div className="upcoming-appointments-count">
          <span>{appointments.length} موعد</span>
        </div>
      </div>

      <div className="upcoming-appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="upcoming-appointment-card">
            <div className="upcoming-appointment-content">
              {/* Doctor Image */}
              <div className="upcoming-doctor-image">
                <img 
                  src={appointment.doctorImage} 
                  alt={appointment.doctorName}
                  onError={(e) => {
                    e.target.src = '/logo2.png'; // Fallback image
                  }}
                />
              </div>

              {/* Appointment Info */}
              <div className="upcoming-appointment-info">
                <div className="upcoming-doctor-details">
                  <h3 className="upcoming-doctor-name">{appointment.doctorName}</h3>
                  <p className="upcoming-clinic-name">{appointment.clinicName}</p>
                </div>
                
                <div className="upcoming-appointment-datetime">
                  <div className="upcoming-date-info">
                    <span className="upcoming-date">{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="upcoming-time-info">
                    <span className="upcoming-time">{appointment.appointmentTime}</span>
                    <span className="upcoming-period">{appointment.period}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="upcoming-appointment-actions">
                <button 
                  className="upcoming-btn-reschedule"
                  onClick={() => handleReschedule(appointment.id)}
                >
                  إعادة جدولة
                </button>
                <button 
                  className="upcoming-btn-cancel"
                  onClick={() => handleCancel(appointment.id)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="upcoming-no-appointments">
          <p>لا توجد مواعيد قادمة</p>
        </div>
      )}
    </div>
  );
};

export default UpComingAppointment;
