import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Spinner, Form, Row, Col, Card } from 'react-bootstrap';

const AppointmentTable = ({ doctorId, clinicId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/appointments/available/${doctorId}/${clinicId}`);
        
        if (response.data.appointments) {
          setAppointments(response.data.appointments);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('فشل في تحميل المواعيد المتاحة');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && clinicId) {
      fetchAvailableAppointments();
    } else {
      setLoading(false);
    }
  }, [doctorId, clinicId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UK', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const formatTime = (timeString) => {
    // If time is in HH:MM:SS format, convert to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTimeSlot = (timeString) => {
    const [hours] = timeString.split(':');
    const hour = parseInt(hours);
    
    if (hour >= 6 && hour < 12) return 'morning'; // 6 AM - 12 PM
    if (hour >= 12 && hour < 17) return 'afternoon'; // 12 PM - 5 PM
    if (hour >= 17 && hour < 21) return 'evening'; // 5 PM - 9 PM
    return 'night'; // 9 PM - 6 AM
  };

  // Filter appointments based on selected filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Filter by date
      if (selectedDate && appointment.appointment_date !== selectedDate) {
        return false;
      }

      // Filter by time slot
      if (selectedTimeSlot !== 'all') {
        const timeSlot = getTimeSlot(appointment.starting_time);
        if (timeSlot !== selectedTimeSlot) {
          return false;
        }
      }

      // Filter by search query (day of week)
      if (searchQuery) {
        const day = appointment.day || new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!day.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, selectedDate, selectedTimeSlot, searchQuery]);

  // Get unique dates for filter dropdown
  const uniqueDates = useMemo(() => {
    const dates = appointments.map(apt => apt.appointment_date);
    return [...new Set(dates)].sort();
  }, [appointments]);

  const handleClearFilters = () => {
    setSelectedDate('');
    setSelectedTimeSlot('all');
    setSearchQuery('');
  };

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

  if (error) {
    return (
      <div className="appointment-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="modern-appointment-container">
      {/* Header Section */}
      <Card className="appointment-header-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="appointment-main-title mb-0">
              <i className="fas fa-calendar-alt me-2"></i>
              المواعيد المتاحة
            </h2>
            <span className="appointments-count-badge">
              {filteredAppointments.length} مواعيد
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Filters Section */}
      <Card className="filters-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="filter-label">
                  <i className="fas fa-calendar me-2"></i>
                  التاريخ
                </Form.Label>
                <Form.Select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="modern-select"
                >
                  <option value="">جميع التواريخ</option>
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label className="filter-label">
                  <i className="fas fa-clock me-2"></i>
                  الفترة الزمنية
                </Form.Label>
                <Form.Select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="modern-select"
                >
                  <option value="all">جميع الأوقات</option>
                  <option value="morning">صباحاً (6 ص - 12 م)</option>
                  <option value="afternoon">ظهراً (12 م - 5 م)</option>
                  <option value="evening">مساءً (5 م - 9 م)</option>
                  <option value="night">ليلاً (9 م - 6 ص)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="filter-label">
                  <i className="fas fa-search me-2"></i>
                  بحث باليوم
                </Form.Label>
                <div className="search-input-wrapper">
                  <Form.Control
                    type="text"
                    placeholder="مثال: Sunday, Monday..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="modern-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {(selectedDate || selectedTimeSlot !== 'all' || searchQuery) && (
            <div className="mt-3 text-center">
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="fas fa-redo me-2"></i>
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Appointments Table/Cards Section */}
      <div className="appointments-content">
        {filteredAppointments.length === 0 ? (
          <Card className="no-appointments-card">
            <Card.Body className="text-center py-5">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">لا توجد مواعيد متاحة</h4>
              <p className="text-muted">
                {appointments.length === 0 
                  ? 'لم يتم إضافة أي مواعيد بعد'
                  : 'لا توجد مواعيد تطابق معايير البحث'}
              </p>
              {appointments.length > 0 && (
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={handleClearFilters}
                >
                  مسح الفلاتر
                </button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="d-none d-lg-block">
              <Card className="appointments-table-card">
                <div className="table-responsive">
                  <table className="modern-appointments-table">
                    <thead>
                      <tr>
                        <th>
                          <i className="fas fa-calendar-day me-2"></i>
                          اليوم
                        </th>
                        <th>
                          <i className="fas fa-calendar me-2"></i>
                          التاريخ
                        </th>
                        <th>
                          <i className="fas fa-clock me-2"></i>
                          وقت البداية
                        </th>
                        <th>
                          <i className="fas fa-clock me-2"></i>
                          وقت النهاية
                        </th>
                        <th>
                          <i className="fas fa-hourglass-half me-2"></i>
                          المدة
                        </th>
                        <th className="text-center">الإجراء</th>
                      </tr>
                    </thead>
                   
                    <tbody>
                      {filteredAppointments.map((appointment) => {
                        const startTime = new Date(`2000-01-01 ${appointment.starting_time}`);
                        const endTime = new Date(`2000-01-01 ${appointment.ending_time}`);
                        const duration = Math.round((endTime - startTime) / 60000);
                        
                        return (
                          <tr key={appointment.id} className="appointment-row">
                            <td>
                              <span className="day-badge">
                                {appointment.day || new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                            </td>
                            <td className="date-cell">
                              {formatDate(appointment.appointment_date)}
                            </td>
                            <td className="time-cell">
                              <span className="time-badge start-time">
                                {formatTime(appointment.starting_time)}
                              </span>
                            </td>
                            <td className="time-cell">
                              <span className="time-badge end-time">
                                {formatTime(appointment.ending_time)}
                              </span>
                            </td>
                            <td className="duration-cell">
                              <span className="duration-badge">
                                {duration} دقيقة
                              </span>
                            </td>
                            <td className="action-cell text-center">
                              <button className="book-appointment-btn">
                                <i className="fas fa-calendar-check me-2"></i>
                                حجز الموعد
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile View - Cards */}
            <div className="d-lg-none">
              <Row className="g-3">
                {filteredAppointments.map((appointment) => {
                  const startTime = new Date(`2000-01-01 ${appointment.starting_time}`);
                  const endTime = new Date(`2000-01-01 ${appointment.ending_time}`);
                  const duration = Math.round((endTime - startTime) / 60000);
                  
                  return (
                    <Col xs={12} key={appointment.id}>
                      <Card className="appointment-mobile-card">
                        <Card.Body>
                          <div className="appointment-mobile-header">
                            <span className="day-badge-mobile">
                              {appointment.day || new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                            <span className="date-badge-mobile">
                              {formatDate(appointment.appointment_date)}
                            </span>
                          </div>
                          
                          <div className="appointment-mobile-details">
                            <div className="detail-row">
                              <i className="fas fa-clock  me-2"></i>
                              <span className="detail-label">من:</span>
                              <span className="detail-value">{formatTime(appointment.starting_time)}</span>
                            </div>
                            <div className="detail-row">
                              <i className="fas fa-clock me-2"></i>
                              <span className="detail-label">إلى:</span>
                              <span className="detail-value">{formatTime(appointment.ending_time)}</span>
                            </div>
                            <div className="detail-row">
                              <i className="fas fa-hourglass-half text-warning me-2"></i>
                              <span className="detail-label">المدة:</span>
                              <span className="detail-value">{duration} دقيقة</span>
                            </div>
                          </div>
                          
                          <button className="book-appointment-btn-mobile w-100 mt-3">
                            <i className="fas fa-calendar-check me-2"></i>
                            حجز الموعد
                          </button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentTable;
