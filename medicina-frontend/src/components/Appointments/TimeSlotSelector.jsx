import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../Loading';

const TimeSlotSelector = ({ doctorId, clinicId, selectedDate, onSlotSelect, onBookingSuccess, selectionOnly = false }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (selectedDate && doctorId && clinicId) {
      fetchTimeSlots();
    } else {
      setSlots([]);
    }
    setSelectedSlot(null);
    setMessage({ type: '', text: '' });
  }, [selectedDate, doctorId, clinicId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('appointments/available', {
        params: {
          doctor_id: doctorId,
          clinic_id: clinicId,
          from_date: selectedDate,
          to_date: selectedDate
        }
      });

     
      if (response.data) {
        // Check if API returned an error message
        if (response.data.message && response.data.message.includes('not exist')) {
          setError('الطبيب والعيادة غير مرتبطين');
          setSlots([]);
          return;
        }
        
        if (response.data.message && response.data.message.includes('No available')) {
          // No slots available is not an error, just empty state
          setError(null);
          setSlots([]);
          return;
        }

        if (response.data.available && Array.isArray(response.data.available)) {
          // Filter slots for the selected date (API should already return only this date, but filter to be safe)
          const dateSlots = response.data.available.filter(
            slot => slot.appointment_date === selectedDate
          );
          
          // Sort by starting_time
          dateSlots.sort((a, b) => {
            const timeA = a.starting_time || '';
            const timeB = b.starting_time || '';
            return timeA.localeCompare(timeB);
          });
          
          
          setSlots(dateSlots);
          
          if (dateSlots.length === 0) {
            setError(null); // Don't show error if no slots, just show empty state
          }
        } else {
        
          setSlots([]);
        }
      } else {
        setSlots([]);
      }
    } catch (err) {
     
      const errorMessage = err.response?.data?.message || 'فشل في تحميل الأوقات المتاحة';
      setError(errorMessage);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setMessage({ type: '', text: '' });
    if (onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'يجب تسجيل الدخول أولاً لحجز الموعد' });
      return;
    }

    // Get patient ID from user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      setMessage({ type: 'error', text: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    let patientId;
    try {
      const user = JSON.parse(userData);
      if (user.role !== 'patient') {
        setMessage({ type: 'error', text: 'يجب تسجيل الدخول كـ مريض لحجز الموعد' });
        return;
      }
      patientId = user.id;
    } catch (err) {
      setMessage({ type: 'error', text: 'خطأ في بيانات المستخدم' });
      return;
    }

    try {
      setBooking(true);
      setMessage({ type: '', text: '' });


      const response = await axios.post('appointments/create', {
        appointment_id: selectedSlot.appointment_id,
        patient_id: patientId,
        appointment_date: selectedDate
      });

      setMessage({ 
        type: 'success', 
        text:  'تم حجز الموعد بنجاح!' || response.data.message
      });
      
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }

      // Refresh slots after booking
      setTimeout(() => {
        fetchTimeSlots();
        setSelectedSlot(null);
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل في حجز الموعد. يرجى المحاولة مرة أخرى';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setBooking(false);
    }
  };

  if (!selectedDate) {
    return (
      <Card className="time-slot-selector-card">
        <Card.Body className="text-center py-5">
          <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
          <p className="text-muted">يرجى اختيار تاريخ من التقويم</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="time-slot-selector-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            الأوقات المتاحة - {new Date(selectedDate).toLocaleDateString('en-UK')}
          </h5>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'danger' : 'success'} className="mb-3">
            {message.text}
          </Alert>
        )}

        {loading ? (
          <Loading />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : slots.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-calendar-times fa-2x text-muted mb-2"></i>
            <p className="text-muted">لا توجد أوقات متاحة في هذا التاريخ</p>
          </div>
        ) : (
          <>
            <Row className="g-3 mb-3">
              {slots.map((slot, index) => (
                <Col xs={6} md={4} lg={3} key={index}>
                  <button
                    className={`time-slot-btn ${
                      selectedSlot?.appointment_id === slot.appointment_id ? 'selected' : ''
                    }`}
                    onClick={() => handleSlotClick(slot)}
                    disabled={booking}
                  >
                    <div className="time-slot-time">{formatTime(slot.starting_time)}</div>
                    {slot.ending_time && (
                      <div className="time-slot-end">
                        - {formatTime(slot.ending_time)}
                      </div>
                    )}
                  </button>
                </Col>
              ))}
            </Row>

            {selectedSlot && (
              <div className="booking-confirmation mt-3">
                <Card className="bg-light">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>الوقت المحدد:</strong>{' '}
                        {formatTime(selectedSlot.starting_time)}
                        {selectedSlot.ending_time && (
                          <> - {formatTime(selectedSlot.ending_time)}</>
                        )}
                      </div>
                      {!selectionOnly && (
                        <Button
                          variant="primary"
                          onClick={handleBookAppointment}
                          disabled={booking}
                        >
                          {booking ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              جاري الحجز...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-calendar-check me-2"></i>
                              تأكيد الحجز
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TimeSlotSelector;

