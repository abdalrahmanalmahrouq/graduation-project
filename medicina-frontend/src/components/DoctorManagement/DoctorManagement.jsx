import React, { useState, useEffect } from 'react';
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

      {/* Filter Dropdown */}
      <div className="appointment-filter-container">
        <select 
          className="appointment-filter-dropdown"
          value={activeFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="available">المواعيد المتاحة</option>
          <option value="booked">المواعيد المحجوزة</option>
          <option value="completed">المواعيد المكتملة</option>
          <option value="cancelled">المواعيد الملغية</option>
        </select>
      </div>

      {/* Appointments List */}
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
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={handleDeleteAppointment}
                onModify={handleModifyAppointment}
                showActions={activeFilter === 'available'}
              />
            ))}
          </div>
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

export default DoctorManagement;
