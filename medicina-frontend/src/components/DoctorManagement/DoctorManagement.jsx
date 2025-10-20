import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../../assets/img/profpic.png';


const DoctorManagement = () => {
  const { doctorId, clinicId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('available');
  // extra UI filters (client-side)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('Managing doctor:', doctorId, 'for clinic:', clinicId);
    fetchDoctorData();
    fetchAppointments();
  }, [doctorId, clinicId]);

  useEffect(() => {
    if (doctor) {
      fetchAppointments();
    }
  }, [activeFilter]);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(`/doctors/profile/${doctorId}`);
      console.log('Doctor data received:', response.data);
      const doctorData = response.data.doctor;
      
      // Check if the doctor is associated with this clinic
      let currentClinicId = clinicId;
      if (!currentClinicId) {
        const profileResponse = await axios.get('/profile');
        currentClinicId = profileResponse.data.id;
      }
      
      const isDoctorInClinic = doctorData.clinics.some(clinic => clinic.id === currentClinicId);
      if (!isDoctorInClinic) {
        setError('ليس لديك صلاحية لإدارة هذا الطبيب');
        return;
      }
      
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      setError('فشل في تحميل بيانات الطبيب');
    }
  };

  const fetchAppointments = async (filterType = activeFilter) => {
    try {
      let response;
      let currentClinicId = clinicId;
      
      if (!currentClinicId) {
        // Fallback: get clinic ID from profile and use it
        const profileResponse = await axios.get('/profile');
        currentClinicId = profileResponse.data.id;
      }
      
      // Use the appropriate endpoint based on filter type
      response = await axios.get(`/appointments/${filterType}/${doctorId}/${currentClinicId}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('فشل في تحميل المواعيد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    setIsLoading(true);
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      setError(''); // Clear any previous errors
      
      // Get clinic_id from URL parameters or profile
      let currentClinicId = clinicId;
      if (!currentClinicId) {
        const profileResponse = await axios.get('/profile');
        currentClinicId = profileResponse.data.id;
      }
      
      const appointmentPayload = {
        doctor_id: doctorId,
        clinic_id: currentClinicId,
        appointment_date: appointmentData.date,
        day: appointmentData.day,
        starting_time: appointmentData.startingTime,
        ending_time: appointmentData.endingTime
      };
      
      console.log('Creating appointment with payload:', appointmentPayload);
      const response = await axios.post('/appointments/create', appointmentPayload);
      console.log('Create appointment response:', response.data);
      
      // Add the new appointment to the list
      setAppointments(prev => [...prev, response.data.appointment]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('فشل في إنشاء الموعد');
      }
    }
  };

  // Helpers for client-side filtering
  const getTimeSlot = (timeString) => {
    const [hours] = (timeString || '').split(':');
    const hour = parseInt(hours || '0');
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (selectedDate && apt.appointment_date !== selectedDate) return false;
      if (selectedTimeSlot !== 'all') {
        const slot = getTimeSlot(apt.starting_time);
        if (slot !== selectedTimeSlot) return false;
      }
      if (searchQuery) {
        const day = apt.day || new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!day.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [appointments, selectedDate, selectedTimeSlot, searchQuery]);

  const uniqueDates = useMemo(() => {
    const dates = appointments.map((a) => a.appointment_date);
    return [...new Set(dates)].sort();
  }, [appointments]);

  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, appointmentId: null });

  const handleDeleteAppointment = (appointmentId) => {
    setDeleteDialog({ isOpen: true, appointmentId });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/appointments/${deleteDialog.appointmentId}`);
      setAppointments(prev => prev.filter(apt => apt.id !== deleteDialog.appointmentId));
      setDeleteDialog({ isOpen: false, appointmentId: null });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('فشل في حذف الموعد');
      setDeleteDialog({ isOpen: false, appointmentId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, appointmentId: null });
  };

  const handleModifyAppointment = async (appointmentId, updatedData) => {
    try {
      setError(''); // Clear any previous errors
      
      // Map frontend field names to backend field names
      const mappedData = {
        appointment_date: updatedData.date,
        day: updatedData.day,
        starting_time: updatedData.startingTime,
        ending_time: updatedData.endingTime
      };
      
      console.log('Updating appointment:', appointmentId, mappedData);
      const response = await axios.put(`/appointments/${appointmentId}`, mappedData);
      console.log('Update response:', response.data);
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? response.data.appointment : apt)
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('فشل في تحديث الموعد');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="doctor-management-error">
        <div className="error-message">{error || 'لم يتم العثور على الطبيب'}</div>
        <button onClick={() => navigate('/manage/doctors')} className="back-button">
          العودة إلى قائمة الأطباء
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-management">
      <div className="doctor-management-header">
        <button 
          onClick={() => navigate('/manage/doctors')} 
          className="back-button"
        >
          ← العودة إلى قائمة الأطباء
        </button>
        <h1 className="page-title-1">إدارة الطبيب</h1>
      </div>

      {error && (
        <div className="error-message-container">
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="error-close-btn">×</button>
          </div>
        </div>
      )}

      {/* Doctor Info Container */}
      <div className="doctor-info-container">
        <div className="doctor-info">
          <div className="doctor-image-section">
            <img 
              src={doctor.profile_image_url || defaultImage} 
              alt={doctor.name}
              className="doctor-profile-image"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="doctor-details">
            <h2 className="manage-doctor-name">{doctor.name}</h2>
            <p className="doctor-specialty-1">{doctor.specialization}</p>
            <p className="doctor-experiance">ID: {doctor.id}</p>
          </div>
        </div>
        {activeFilter === 'available' && (
          <div className="add-appointment-section">
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="add-appointment-btn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              إضافة موعد
            </button>
          </div>
        )}
      </div>

      {/* Filters box (integrated status selector) */}
      <div className="filters-card mb-4 modern-appointment-container">
        <div className="appointment-form">
          {/* Desktop Filters */}
          <div className="d-none d-lg-block">
            <div className="form-row" style={{ gap: '16px', alignItems: 'flex-end', display: 'flex', flexWrap: 'nowrap' }}>
              <div className="form-group" style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="filter-label">
                  <i className="fas fa-filter me-2"></i>
                  حالة الموعد
                </label>
                <div className="search-input-wrapper">
                  <select
                    value={activeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="modern-select"
                  >
                    <option value="available">المواعيد المتاحة</option>
                    <option value="booked">المواعيد المحجوزة</option>
                    <option value="completed">المواعيد المكتملة</option>
                    <option value="cancelled">المواعيد الملغية</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="filter-label">
                  <i className="fas fa-calendar me-2"></i>
                  التاريخ
                </label>
                <div className="search-input-wrapper">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="modern-select"
                  >
                    <option value="">جميع التواريخ</option>
                    {uniqueDates.map((date) => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="filter-label">
                  <i className="fas fa-clock me-2"></i>
                  الفترة الزمنية
                </label>
                <div className="search-input-wrapper">
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="modern-select"
                  >
                    <option value="all">جميع الأوقات</option>
                    <option value="morning">صباحاً (6 ص - 12 م)</option>
                    <option value="afternoon">ظهراً (12 م - 5 م)</option>
                    <option value="evening">مساءً (5 م - 9 م)</option>
                    <option value="night">ليلاً (9 م - 6 ص)</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="filter-label">
                  <i className="fas fa-search me-2"></i>
                  بحث باليوم
                </label>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="مثال: Sunday, Monday..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="modern-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="مسح البحث"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="d-lg-none">
            <div className="row g-2">
              <div className="col-12">
                <label className="filter-label">
                  <i className="fas fa-filter me-2"></i>
                  حالة الموعد
                </label>
                <select
                  value={activeFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="form-control"
                >
                  <option value="available">المواعيد المتاحة</option>
                  <option value="booked">المواعيد المحجوزة</option>
                  <option value="completed">المواعيد المكتملة</option>
                  <option value="cancelled">المواعيد الملغية</option>
                </select>
              </div>
              <div className="col-6">
                <label className="filter-label">
                  <i className="fas fa-calendar me-2"></i>
                  التاريخ
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control"
                >
                  <option value="">جميع التواريخ</option>
                  {uniqueDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="filter-label">
                  <i className="fas fa-clock me-2"></i>
                  الفترة الزمنية
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="form-control"
                >
                  <option value="all">جميع الأوقات</option>
                  <option value="morning">صباحاً</option>
                  <option value="afternoon">ظهراً</option>
                  <option value="evening">مساءً</option>
                  <option value="night">ليلاً</option>
                </select>
              </div>
              <div className="col-12">
                <label className="filter-label">
                  <i className="fas fa-search me-2"></i>
                  بحث باليوم
                </label>
                <input
                  type="text"
                  placeholder="مثال: Sunday, Monday..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {(selectedDate || selectedTimeSlot !== 'all' || searchQuery) && (
            <div className="mt-3 text-center">
              <button
                type="button"
                className="clear-filters-btn"
                onClick={() => { setSelectedDate(''); setSelectedTimeSlot('all'); setSearchQuery(''); }}
              >
                <i className="fas fa-redo me-2"></i>
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-section">
        <h3 className="manage-section-title">
          {activeFilter === 'available' && 'المواعيد المتاحة'}
          {activeFilter === 'booked' && 'المواعيد المحجوزة'}
          {activeFilter === 'completed' && 'المواعيد المكتملة'}
          {activeFilter === 'cancelled' && 'المواعيد الملغية'}
        </h3>
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>
              {activeFilter === 'available' && 'لا توجد مواعيد متاحة حالياً'}
              {activeFilter === 'booked' && 'لا توجد مواعيد محجوزة حالياً'}
              {activeFilter === 'completed' && 'لا توجد مواعيد مكتملة حالياً'}
              {activeFilter === 'cancelled' && 'لا توجد مواعيد ملغية حالياً'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="d-none d-lg-block">
              <div className="appointments-table-card">
                <div className="table-responsive">
                  <table className="modern-appointments-table">
                    <thead>
                      <tr>
                        <th>اليوم</th>
                        <th>التاريخ</th>
                        <th>وقت البداية</th>
                        <th>وقت النهاية</th>
                        {activeFilter !== 'available' && (<th>المريض</th>)}
                        <th>الحالة</th>
                        <th className="text-center" style={{ paddingRight: '80px' }}>الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appointment) => (
                        <AppointmentRow
                          key={appointment.id}
                          appointment={appointment}
                          onDelete={handleDeleteAppointment}
                          onModify={handleModifyAppointment}
                          showActions={activeFilter === 'available'}
                          showPatientColumn={activeFilter !== 'available'}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="d-lg-none">
              <div className="row g-3">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="col-12">
                    <AppointmentMobileCard
                      appointment={appointment}
                      onDelete={handleDeleteAppointment}
                      onModify={handleModifyAppointment}
                      showActions={activeFilter === 'available'}
                      showPatientColumn={activeFilter !== 'available'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Appointment Dialog */}
      <AddAppointmentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddAppointment}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onDelete, onModify, showActions = true }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: appointment.appointment_date,
    day: appointment.day,
    startingTime: appointment.starting_time,
    endingTime: appointment.ending_time
  });

  // Function to get day name from date
  const getDayName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  // Handle date change and auto-set day
  const handleDateChange = (dateValue) => {
    const dayName = getDayName(dateValue);
    setEditData(prev => ({
      ...prev,
      date: dateValue,
      day: dayName
    }));
  };

  const handleSave = () => {
    // Validate that required fields are not empty
    if (!editData.date || !editData.startingTime || !editData.endingTime) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    console.log('Saving appointment with data:', editData);
    onModify(appointment.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      date: appointment.appointment_date,
      day: appointment.day,
      startingTime: appointment.starting_time,
      endingTime: appointment.ending_time
    });
    setIsEditing(false);
  };

  return (
    <div className="appointment-card">
      {isEditing ? (
        <div className="appointment-edit-form">
          <div className="form-row">
            <input
              type="date"
              value={editData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              value={editData.day}
              readOnly
              placeholder="سيتم ملؤه تلقائياً"
              className="form-input"
              style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-row">
            <input
              type="time"
              value={editData.startingTime}
              onChange={(e) => setEditData({...editData, startingTime: e.target.value})}
              className="form-input"
            />
            <input
              type="time"
              value={editData.endingTime}
              onChange={(e) => setEditData({...editData, endingTime: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">حفظ</button>
            <button onClick={handleCancel} className="cancel-btn">إلغاء</button>
          </div>
        </div>
      ) : (
        <>
          <div className="appointment-info">
            <div className="appointment-date">
              <strong>التاريخ:</strong> {appointment.appointment_date}
            </div>
            <div className="appointment-day">
              <strong>اليوم:</strong> {appointment.day || 'غير محدد'}
            </div>
            <div className="appointment-time">
              <strong>الوقت:</strong> {appointment.starting_time} - {appointment.ending_time}
            </div>
            {appointment.patient && (
              <div className="appointment-patient">
                <strong>المريض:</strong>{' '}
                <span 
                  className="patient-name-link"
                  onClick={() => navigate(`/patients/by-user-id/${appointment.patient.user_id}`)}  
                >
                  {appointment.patient.full_name}
                </span>
              </div>
            )}
            <div className="appointment-status">
              <span className={`status-badge status-${appointment.status}`}>
                {appointment.status === 'available' && 'متاح'}
                {appointment.status === 'booked' && 'محجوز'}
                {appointment.status === 'completed' && 'مكتمل'}
                {appointment.status === 'cancelled' && 'ملغي'}
              </span>
            </div>
          </div>
          {showActions && (
            <div className="appointment-actions">
              <button 
                onClick={() => setIsEditing(true)}
                className="modify-btn"
              >
                تعديل
              </button>
              <button 
                onClick={() => onDelete(appointment.id)}
                className="delete-btn"
              >
                حذف
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Table Row version for appointments
const AppointmentRow = ({ appointment, onDelete, onModify, showActions = true, showPatientColumn = false }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: appointment.appointment_date,
    day: appointment.day,
    startingTime: appointment.starting_time,
    endingTime: appointment.ending_time
  });

  const getDayName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  const handleDateChange = (dateValue) => {
    const dayName = getDayName(dateValue);
    setEditData(prev => ({
      ...prev,
      date: dateValue,
      day: dayName
    }));
  };

  const handleSave = () => {
    if (!editData.date || !editData.startingTime || !editData.endingTime) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    onModify(appointment.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      date: appointment.appointment_date,
      day: appointment.day,
      startingTime: appointment.starting_time,
      endingTime: appointment.ending_time
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="appointment-row editing">
        <td>
          <input
            type="text"
            value={editData.day}
            readOnly
            className="form-input"
            style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
          />
        </td>
        <td>
          <input
            type="date"
            value={editData.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="form-input"
          />
        </td>
        <td>
          <input
            type="time"
            value={editData.startingTime}
            onChange={(e) => setEditData({ ...editData, startingTime: e.target.value })}
            className="form-input"
          />
        </td>
        <td>
          <input
            type="time"
            value={editData.endingTime}
            onChange={(e) => setEditData({ ...editData, endingTime: e.target.value })}
            className="form-input"
          />
        </td>
        <td>
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status === 'available' && 'متاح'}
            {appointment.status === 'booked' && 'محجوز'}
            {appointment.status === 'completed' && 'مكتمل'}
            {appointment.status === 'cancelled' && 'ملغي'}
          </span>
        </td>
        <td className="text-center">
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">حفظ</button>
            <button onClick={handleCancel} className="cancel-btn">إلغاء</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="appointment-row">
      <td>
        <span className="day-badge">
          {appointment.day || new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long' })}
        </span>
      </td>
      <td className="date-cell">{appointment.appointment_date}</td>
      <td className="time-cell">
        <span className="time-badge start-time">{appointment.starting_time}</span>
      </td>
      <td className="time-cell">
        <span className="time-badge end-time">{appointment.ending_time}</span>
      </td>
      {showPatientColumn && (
        <td>
          {appointment.patient ? (
            <span
              className="patient-name-link"
              onClick={() => navigate(`/patients/by-user-id/${appointment.patient.user_id}`)}
              style={{ cursor: 'pointer', color: '#0d6efd' }}
            >
              {appointment.patient.full_name}
            </span>
          ) : (
            <span className="text-muted">—</span>
          )}
        </td>
      )}
      <td>
        <span className={`status-badge status-${appointment.status}`}>
          {appointment.status === 'available' && 'متاح'}
          {appointment.status === 'booked' && 'محجوز'}
          {appointment.status === 'completed' && 'مكتمل'}
          {appointment.status === 'cancelled' && 'ملغي'}
        </span>
      </td>
      <td className="action-cell text-center">
        {showActions ? (
          <div className="appointment-actions">
            <button onClick={() => setIsEditing(true)} className="modify-btn">تعديل</button>
            <button onClick={() => onDelete(appointment.id)} className="delete-btn">حذف</button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
    </tr>
  );
};

// Add Appointment Dialog Component
const AddAppointmentDialog = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: '',
    day: '',
    startingTime: '',
    endingTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Function to get day name from date
  const getDayName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  // Handle date change and auto-set day
  const handleDateChange = (dateValue) => {
    const dayName = getDayName(dateValue);
    setFormData(prev => ({
      ...prev,
      date: dateValue,
      day: dayName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onAdd(formData);
      setFormData({
        date: '',
        day: '',
        startingTime: '',
        endingTime: ''
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-appointment-dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>إضافة موعد جديد</h3>
          <button onClick={onClose} className="close-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>التاريخ</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>اليوم</label>
            <input
              type="text"
              value={formData.day}
              readOnly
              placeholder="سيتم ملؤه تلقائياً"
              className="form-input"
              style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>وقت البداية</label>
              <input
                type="time"
                value={formData.startingTime}
                onChange={(e) => setFormData({...formData, startingTime: e.target.value})}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>وقت النهاية</label>
              <input
                type="time"
                value={formData.endingTime}
                onChange={(e) => setFormData({...formData, endingTime: e.target.value})}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'جاري الإضافة...' : 'إضافة الموعد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-dialog">
      <div className="delete-dialog-content">
        <div className="delete-dialog-header">
          <div className="delete-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="delete-dialog-title">تأكيد الحذف</h3>
        </div>
        
        <div className="delete-dialog-body">
          <p className="delete-message">
            هل أنت متأكد من حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
        </div>
        
        <div className="delete-dialog-actions">
          <button 
            onClick={onCancel}
            className="delete-cancel-btn"
          >
            إلغاء
          </button>
          <button 
            onClick={onConfirm}
            className="delete-confirm-btn"
          >
            حذف الموعد
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile Card Component for appointments
const AppointmentMobileCard = ({ appointment, onDelete, onModify, showActions = true, showPatientColumn = false }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: appointment.appointment_date,
    day: appointment.day,
    startingTime: appointment.starting_time,
    endingTime: appointment.ending_time
  });

  const getDayName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  const handleDateChange = (dateValue) => {
    const dayName = getDayName(dateValue);
    setEditData(prev => ({
      ...prev,
      date: dateValue,
      day: dayName
    }));
  };

  const handleSave = () => {
    if (!editData.date || !editData.startingTime || !editData.endingTime) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    onModify(appointment.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      date: appointment.appointment_date,
      day: appointment.day,
      startingTime: appointment.starting_time,
      endingTime: appointment.ending_time
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="appointment-mobile-card">
        <div className="appointment-mobile-header">
          <span className="day-badge-mobile">تعديل الموعد</span>
        </div>
        <div className="appointment-mobile-details">
          <div className="detail-row">
            <span className="detail-label">التاريخ:</span>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="detail-row">
            <span className="detail-label">اليوم:</span>
            <input
              type="text"
              value={editData.day}
              readOnly
              className="form-control"
              style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>
          <div className="detail-row">
            <span className="detail-label">وقت البداية:</span>
            <input
              type="time"
              value={editData.startingTime}
              onChange={(e) => setEditData({ ...editData, startingTime: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="detail-row">
            <span className="detail-label">وقت النهاية:</span>
            <input
              type="time"
              value={editData.endingTime}
              onChange={(e) => setEditData({ ...editData, endingTime: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-actions mt-3">
          <button onClick={handleSave} className="btn btn-success btn-sm me-2">حفظ</button>
          <button onClick={handleCancel} className="btn btn-secondary btn-sm">إلغاء</button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-mobile-card">
      <div className="appointment-mobile-header">
        <span className="day-badge-mobile">
          {appointment.day || new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long' })}
        </span>
        <span className="date-badge-mobile">{appointment.appointment_date}</span>
      </div>
      
      <div className="appointment-mobile-details">
        <div className="detail-row">
          <i className="fas fa-clock me-2"></i>
          <span className="detail-label">من:</span>
          <span className="detail-value">{appointment.starting_time}</span>
        </div>
        <div className="detail-row">
          <i className="fas fa-clock me-2"></i>
          <span className="detail-label">إلى:</span>
          <span className="detail-value">{appointment.ending_time}</span>
        </div>
        {showPatientColumn && appointment.patient && (
          <div className="detail-row">
            <i className="fas fa-user me-2"></i>
            <span className="detail-label">المريض:</span>
            <span 
              className="detail-value patient-name-link"
              onClick={() => navigate(`/patients/by-user-id/${appointment.patient.user_id}`)}
              style={{ cursor: 'pointer', color: '#0d6efd' }}
            >
              {appointment.patient.full_name}
            </span>
          </div>
        )}
        <div className="detail-row">
          <i className="fas fa-info-circle me-2"></i>
          <span className="detail-label">الحالة:</span>
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status === 'available' && 'متاح'}
            {appointment.status === 'booked' && 'محجوز'}
            {appointment.status === 'completed' && 'مكتمل'}
            {appointment.status === 'cancelled' && 'ملغي'}
          </span>
        </div>
      </div>
      
      {showActions && (
        <div className="appointment-actions mt-3">
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn btn-primary btn-sm me-2"
          >
            تعديل
          </button>
          <button 
            onClick={() => onDelete(appointment.id)} 
            className="btn btn-danger btn-sm"
          >
            حذف
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
