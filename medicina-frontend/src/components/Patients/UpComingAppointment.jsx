import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../Loading';
import AppointmentCalendar from '../Appointments/AppointmentCalendar';
import TimeSlotSelector from '../Appointments/TimeSlotSelector';

const UpComingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [loadingWorkingDays, setLoadingWorkingDays] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // Fetch booked appointments from today onwards using patient appointments endpoint
      // The endpoint auto-detects patient_id from auth, but we can also pass it explicitly
      const response = await axios.get('patients/appointments', {
        params: {
          status: 'booked',
          starting_date: todayStr
        }
      });

      if (response.data && response.data.appointments) {
        // Filter for future appointments (including today)
        const todayDate = new Date(todayStr);
        todayDate.setHours(0, 0, 0, 0);

        const upcomingAppointments = response.data.appointments
          .filter(apt => {
            const aptDate = new Date(apt.appointment_date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= todayDate;
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
            doctorImage: apt.doctor?.profile_image_url || '/logo2.png',
            status: 'upcoming',
            appointment_id: apt.id, // Appointment record ID
            available_appointment_id: apt.appointment_id, // Available appointment slot ID (for rescheduling)
            doctor_id: apt.doctor?.user_id,
            clinic_id: apt.clinic?.user_id
          }))
          .sort((a, b) => {
            // Sort by date, then by time
            const dateCompare = new Date(a.appointmentDate) - new Date(b.appointmentDate);
            if (dateCompare !== 0) return dateCompare;
            return a.appointmentStartingTime.localeCompare(b.appointmentStartingTime);
          });

        setAppointments(upcomingAppointments);
      }
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setError('فشل في تحميل المواعيد القادمة');
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

  const fetchWorkingDaysForReschedule = async (doctorId, clinicId) => {
    try {
      setLoadingWorkingDays(true);
      
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 90);
      
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const fromDate = formatLocalDate(today);
      const toDate = formatLocalDate(futureDate);

      const response = await axios.get('appointments/available', {
        params: {
          doctor_id: doctorId,
          clinic_id: clinicId,
          from_date: fromDate,
          to_date: toDate
        }
      });

      if (response.data && response.data.available && Array.isArray(response.data.available) && response.data.available.length > 0) {
        const daysSet = new Set();
        
        response.data.available.forEach(slot => {
          if (slot.appointment_date) {
            const dayName = getDayName(slot.appointment_date);
            daysSet.add(dayName);
          }
        });
        
        const days = Array.from(daysSet);
        setWorkingDays(days);
      } else {
        setWorkingDays([]);
      }
    } catch (err) {
      console.error('Error fetching working days:', err);
      setWorkingDays([]);
    } finally {
      setLoadingWorkingDays(false);
    }
  };

  const getDayName = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(null);
    setSelectedTimeSlot(null);
    setRescheduleError(null);
    setWorkingDays([]);
    setShowTimeSlots(false);
    setShowRescheduleModal(true);
    
    // Fetch working days when modal opens
    if (appointment.doctor_id && appointment.clinic_id) {
      fetchWorkingDaysForReschedule(appointment.doctor_id, appointment.clinic_id);
    }
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedAppointment || !rescheduleDate || !selectedTimeSlot) {
      setRescheduleError('يرجى اختيار تاريخ ووقت جديد');
      return;
    }

    try {
      setRescheduleLoading(true);
      setRescheduleError(null);

      const response = await axios.patch('appointments/reschedule', {
        id: selectedAppointment.id,
        appointment_date: rescheduleDate,
        appointment_id: selectedTimeSlot.appointment_id
      });

      if (response.data) {
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
        setRescheduleDate(null);
        setSelectedTimeSlot(null);
        setWorkingDays([]);
        setShowTimeSlots(false);
        // Refresh the appointments list
        fetchUpcomingAppointments();
      }
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      const errorMsg = err.response?.data?.message || 'فشل في إعادة جدولة الموعد';
      setRescheduleError(errorMsg);
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);

      const response = await axios.patch('appointments/cancel', {
        id: selectedAppointment.id
      });

      if (response.data) {
        setShowCancelModal(false);
        setSelectedAppointment(null);
        // Refresh the appointments list
        fetchUpcomingAppointments();
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      const errorMsg = err.response?.data?.message || 'فشل في إلغاء الموعد';
      alert(errorMsg);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRescheduleSlotSelect = (slot) => {
    // This will be called when a time slot is selected
    setSelectedTimeSlot(slot);
    setRescheduleError(null);
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
    return 'status-upcoming';
  };

  const getStatusText = (status) => {
    return 'قادم';
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
          <h2>المواعيد القادمة</h2>
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
        <h2>المواعيد القادمة</h2>
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
                  <div className="past-doctor-details ">   
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
                <span className="text-muted fw-bold">معرف الموعد: {appointment.id} </span>
                  <div className="past-date-info">
                    <span className="past-date">{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="past-time-info">
                    <span className="past-time">{formatTime(appointment.appointmentStartingTime)} -</span>
                    <span className="past-time">{formatTime(appointment.appointmentEndingTime)}</span>
                    <span className="past-period">{appointment.period}</span>
                  </div>
                </div>
                
              </div>

              {/* Action Buttons */}
              <div className="past-appointment-actions">
                <button 
                  className="upcoming-btn-reschedule"
                  onClick={() => handleReschedule(appointment)}
                >
                  إعادة جدولة
                </button>
                <button 
                  className="upcoming-btn-cancel"
                  onClick={() => handleCancel(appointment)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="past-no-appointments">
          <p>لا توجد مواعيد قادمة</p>
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal 
        show={showRescheduleModal} 
        onHide={() => {
          setShowRescheduleModal(false);
          setSelectedAppointment(null);
          setRescheduleDate(null);
          setSelectedTimeSlot(null);
          setRescheduleError(null);
          setWorkingDays([]);
          setShowTimeSlots(false);
        }}
        size="lg"
        centered
        dir="rtl"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <i className="fas fa-calendar-alt text-primary me-2"></i>
            إعادة جدولة الموعد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedAppointment && (
            <>
              

              {rescheduleError && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {rescheduleError}
                </Alert>
              )}

              {loadingWorkingDays ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                  <Loading />
                </div>
              ) : showTimeSlots && rescheduleDate ? (
                <div>
                  <Button
                    variant="outline-secondary"
                    className="mb-3"
                    onClick={() => {
                      setShowTimeSlots(false);
                      setRescheduleDate(null);
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <i className="fas fa-arrow-right me-2"></i>
                    العودة للتقويم
                  </Button>
                  <TimeSlotSelector
                    doctorId={selectedAppointment.doctor_id}
                    clinicId={selectedAppointment.clinic_id}
                    selectedDate={rescheduleDate}
                    onSlotSelect={handleRescheduleSlotSelect}
                    onBookingSuccess={null}
                    selectionOnly={true}
                  />
                </div>
              ) : (
                <AppointmentCalendar
                  workingDays={workingDays}
                  selectedDate={rescheduleDate}
                  onDateSelect={(date) => {
                    setRescheduleDate(date);
                    setSelectedTimeSlot(null); // Reset time slot when date changes
                    setRescheduleError(null);
                    setShowTimeSlots(true); // Show time slots when date is selected
                  }}
                  minDate={(() => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  })()}
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowRescheduleModal(false);
              setSelectedAppointment(null);
              setRescheduleDate(null);
              setSelectedTimeSlot(null);
              setRescheduleError(null);
              setWorkingDays([]);
              setShowTimeSlots(false);
            }}
            disabled={rescheduleLoading}
          >
            إلغاء
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRescheduleConfirm}
            disabled={rescheduleLoading || !rescheduleDate || !selectedTimeSlot}
          >
            {rescheduleLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                جاري المعالجة...
              </>
            ) : (
              <>
                <i className="fas fa-check me-2"></i>
                تأكيد إعادة الجدولة
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal 
        show={showCancelModal} 
        onHide={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
        centered
        dir="rtl"
      >
        <Modal.Header className="border-0">
          <Modal.Title>
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            تأكيد إلغاء الموعد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="fas fa-calendar-times fa-4x text-danger"></i>
                </div>
                <h5>هل أنت متأكد من إلغاء هذا الموعد؟</h5>
                <p className="text-muted mb-0">لا يمكن التراجع عن هذا الإجراء</p>
              </div>
            
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowCancelModal(false);
              setSelectedAppointment(null);
            }}
            disabled={cancelLoading}
          >
            إلغاء
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelConfirm}
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                جاري المعالجة...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-2"></i>
                نعم، إلغاء الموعد
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpComingAppointment;
