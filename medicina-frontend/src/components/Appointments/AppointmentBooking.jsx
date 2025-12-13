import React, { useState, useEffect } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotSelector from './TimeSlotSelector';
import Loading from '../Loading';

const AppointmentBooking = ({ doctorId, clinicId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const isPatient = userData ? JSON.parse(userData).role === 'patient' : false;

  useEffect(() => {
    
    if (doctorId && clinicId) {
      fetchWorkingDays();
    } else {
      
      setLoading(false);
    }
  }, [doctorId, clinicId]);

  const fetchWorkingDays = async () => {
    try {
      setLoading(true);
      setError(null);

     

      // Strategy 1: Fetch available appointments with a wide date range (90 days)
      // This will return slots for all dates where the doctor works
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 90);
      
      // Use local date formatting to avoid timezone issues
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const fromDate = formatLocalDate(today);
      const toDate = formatLocalDate(futureDate);

      try {
        
       
        const response = await axios.get('appointments/available', {
          params: {
            doctor_id: doctorId,
            clinic_id: clinicId,
            from_date: fromDate,
            to_date: toDate
          }
        });

        // Check if API returned an error message
        if (response.data?.message) {
          if (response.data.message.includes('does not exist')) {
            setError('الطبيب والعيادة غير مرتبطين. يرجى التأكد من إضافة الطبيب للعيادة.');
            setWorkingDays([]);
            return;
          }
          if (response.data.message.includes('No available appointments')) {
            setError('لا توجد مواعيد متاحة. يرجى التأكد من إعداد جدول الطبيب في العيادة.');
            setWorkingDays([]);
            return;
          }
        }

        if (response.data && response.data.available && Array.isArray(response.data.available) && response.data.available.length > 0) {
          // Extract unique days from available appointments
          const daysSet = new Set();
          
          response.data.available.forEach(slot => {
            if (slot.appointment_date) {
              const dayName = getDayName(slot.appointment_date);
              daysSet.add(dayName);
            }
          });
          
          const days = Array.from(daysSet);
          
          if (days.length > 0) {
            
            setWorkingDays(days);
            return;
          }
        }

        // If we get here, no slots were found
        
        setError('لا توجد مواعيد متاحة في النطاق الزمني المحدد.');
        setWorkingDays([]);
        
      } catch (apiError) {
           
        // Handle specific API errors
        if (apiError.response?.status === 400) {
          const errorMsg = apiError.response.data?.message || 'خطأ في الطلب';
          if (errorMsg.includes('does not exist')) {
            setError('الطبيب والعيادة غير مرتبطين. يرجى التأكد من إضافة الطبيب للعيادة.');
          } else {
            setError(errorMsg);
          }
        } else if (apiError.response?.status === 404) {
          setError('الطبيب أو العيادة غير موجودين.');
        } else {
          setError('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
        }
        
        setWorkingDays([]);
      }
      
    } catch (err) {
      
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      setWorkingDays([]);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString) => {
    // Parse date string as local date (YYYY-MM-DD format)
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBookingSuccess = (data) => {
    // Show success message and redirect after a delay
    setTimeout(() => {
      navigate('/patient/upcoming-appointments');
    }, 2000);
  };

  const handleLoginRedirect = () => {
    // Persist current booking context so the patient can resume after login
    const redirectPath = `${location.pathname}${location.search}`;
    const pendingBooking = {
      doctorId,
      clinicId,
      selectedDate,
    };
    try {
      localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
    } catch (e) {
      console.warn('Could not save pending booking context', e);
    }
    navigate(`/login/patient?redirect=${encodeURIComponent(redirectPath)}`);
  };

  if (loading) {
    return <Loading />;
  }

  // Show login prompt for guests
  if (!isLoggedIn || !isPatient) {
    return (
      <Card className="m-4">
        <Card.Body className="text-center py-5">
          <i className="fas fa-lock fa-3x text-brand mb-3"></i>
          <h4>تسجيل الدخول مطلوب</h4>
          <p className="text-muted mb-4">
            يجب تسجيل الدخول كـ مريض لحجز الموعد
          </p>
          <Button variant="primary" size="lg" onClick={handleLoginRedirect}>
            <i className="fas fa-sign-in-alt me-2"></i>
            تسجيل الدخول
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="appointment-booking-container">
      <Card className="booking-header-card mb-4">
        <Card.Body>
          <h2 className="booking-title mb-0">
            <i className="fas fa-calendar-check me-2"></i>
            حجز موعد
          </h2>
          <p className="text-muted mb-0 mt-2">
            اختر التاريخ والوقت المناسب لك
          </p>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {workingDays.length === 0 && !loading && !error && (
        <Alert variant="warning" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          لا توجد أيام عمل محددة للطبيب في هذه العيادة. يرجى التأكد من إعداد جدول الطبيب.
        </Alert>
      )}

      <div className="row">
        <div className="col-lg-6 mb-4">
          <AppointmentCalendar
            workingDays={workingDays}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const day = String(today.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            })()}
          />
        </div>
        <div className="col-lg-6">
          <TimeSlotSelector
            doctorId={doctorId}
            clinicId={clinicId}
            selectedDate={selectedDate}
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;

