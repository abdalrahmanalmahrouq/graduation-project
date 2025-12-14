import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import defaultImage from '../../assets/img/profpic.png';
const PastAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPastAppointments();
  }, []);

  const fetchPastAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      console.log('Fetching past appointments for date:', todayStr);

      // Fetch completed, cancelled, and no_show appointments using patient appointments endpoint
      // The endpoint auto-detects patient_id from auth
      // Don't use ending_date filter - get all and filter on frontend
      const [completedResponse, cancelledResponse, noShowResponse] = await Promise.all([
        axios.get('patients/appointments', {
          params: {
            status: 'completed'
          }
        }).catch(err => {
          console.error('Error fetching completed:', err);
          return { data: { appointments: [] } };
        }),
        axios.get('patients/appointments', {
          params: {
            status: 'cancelled'
          }
        }).catch(err => {
          console.error('Error fetching cancelled:', err);
          return { data: { appointments: [] } };
        }),
        axios.get('patients/appointments', {
          params: {
            status: 'no_show'
          }
        }).catch(err => {
          console.error('Error fetching no_show:', err);
          return { data: { appointments: [] } };
        })
      ]);

      console.log('Completed response:', completedResponse.data);
      console.log('Cancelled response:', cancelledResponse.data);
      console.log('No-show response:', noShowResponse.data);

      // Check if responses have the expected structure
      if (!completedResponse.data || !cancelledResponse.data) {
        console.warn('Unexpected response structure:', { completedResponse, cancelledResponse });
        setError('استجابة غير متوقعة من الخادم');
        setLoading(false);
        return;
      }

      const allPastAppointments = [
        ...(completedResponse.data?.appointments || []),
        ...(cancelledResponse.data?.appointments || []),
        ...(noShowResponse.data?.appointments || [])
      ];

      console.log('All past appointments before filtering:', allPastAppointments);
      console.log('Total appointments found:', allPastAppointments.length);

      // Since we're fetching completed/cancelled/no_show appointments,
      // they are inherently "past" appointments regardless of date
      // We can optionally filter by date if needed, but for now show all
      const pastAppointments = allPastAppointments
        .filter(apt => {
          // Only filter out appointments without a date
          if (!apt.appointment_date) return false;
          return true;
        })
        .map(apt => ({
          id: apt.id,
          doctorName: apt.doctor?.full_name || 'طبيب غير معروف',
          clinicName: apt.clinic?.clinic_name || 'عيادة غير معروفة',
          clinicAddress: apt.clinic?.address || 'عيادة غير معروفة',
          appointmentDate: apt.appointment_date,
          appointmentStartingTime: apt.starting_time || '',
          appointmentEndingTime: apt.ending_time || '',
          period: getTimePeriod(apt.starting_time),
          doctorImage: apt.doctor?.profile_image_url || defaultImage,
          status: apt.status,
          appointment_id: apt.id,
          doctor_id: apt.doctor?.user_id,
          doctor_id2: apt.doctor?.id,
          clinic_id: apt.clinic?.user_id
        }))
        .sort((a, b) => {
          // Sort by date descending (most recent first)
          const dateCompare = new Date(b.appointmentDate) - new Date(a.appointmentDate);
          if (dateCompare !== 0) return dateCompare;
          return b.appointmentStartingTime.localeCompare(a.appointmentStartingTime);
        });

      console.log('Filtered past appointments:', pastAppointments);
      setAppointments(pastAppointments);
    } catch (err) {
      console.error('Error fetching past appointments:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'فشل في تحميل المواعيد السابقة';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getTimePeriod = (timeString) => {
    if (!timeString) return 'ص';
    const [hours] = timeString.split(':');
    const hour = parseInt(hours);
    return hour >= 12 ? 'م' : 'ص';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}`;
  };

  const handleViewReport = (appointmentId) => {
    // Navigate to medical records page or show report
    navigate(`/patient/medical-records`);
  };

  const handleBookAgain = (appointment) => {
    // Navigate to booking page with doctor and clinic info
    if (appointment.doctor_id && appointment.clinic_id) {
      navigate(`/doctor/profile/${appointment.doctor_id2}`);
    } else {
      alert('لا يمكن الحجز مرة أخرى - معلومات الطبيب أو العيادة غير متوفرة');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('ar-UK', options);
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
      case 'no_show': return 'لم يحضر';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="past-appointments">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="past-appointments">
        <div className="past-appointments-header">
          <h2>المواعيد السابقة</h2>
        </div>
        <div className="past-error" style={{ padding: '2rem', textAlign: 'center', color: '#f44336' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
                    e.target.src = defaultImage; // Fallback image
                  }}
                />
              </div>

              {/* Appointment Info */}
              <div className="past-appointment-info">
                <div className="past-doctor-details">
                  <h3 className="past-doctor-name">{appointment.doctorName}</h3>
                  <p className="past-clinic-name">{appointment.clinicName}</p>
                  <p className="past-clinic-address">{appointment.clinicAddress}</p>
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
                    <span className="past-time">{formatTime(appointment.appointmentStartingTime)} - {formatTime(appointment.appointmentEndingTime)}</span>
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
                      onClick={() => handleBookAgain(appointment)}
                    >
                      حجز مرة أخرى
                    </button>
                  </>
                )}
                {appointment.status === 'cancelled' && (
                  <button 
                    className="past-btn-book-again"
                    onClick={() => handleBookAgain(appointment)}
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

