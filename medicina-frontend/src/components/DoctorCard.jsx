import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultImage from '../assets/img/profpic.png';
import axios from 'axios';


const DoctorCard = ({ doctor, onManage }) => {
  const navigate = useNavigate();
  // Use real profile image if available, otherwise use default
  const profileImage = doctor.profile_image_url || defaultImage;
  
  const handleManage = async () => {
    try {
      // Get clinic_id from the authenticated user's profile
      const profileResponse = await axios.get('/profile');
      const clinicId = profileResponse.data.id;
      
      // Navigate to doctor management page
      
      navigate(`/manage/doctor/${doctor.doctorId}/${clinicId}`);
    } catch (error) {
      console.error('Error getting clinic ID:', error);
      // Fallback to just doctor ID if profile fetch fails
      navigate(`/manage/doctor/${doctor.doctorId}`);
    }
  };
  
  return (
    <div className="doctor-card">
      <div className="doctor-image-container">
        <div className="relative">
          <img 
            src={profileImage} 
            alt={doctor.name}
            className="doctor-image"                                                                                                                      
              onError={(e) => {
              // Fallback to default image if profile image fails to load
              e.target.src = defaultImage;
            }}
          />
          <div className="doctor-status">
            <div className="doctor-status-dot"></div>
          </div>
        </div>
      </div>
      
      <h3 className="add-doctor-name">{doctor.name}</h3>
      <p className="doctor-specialty">{doctor.specialty || doctor.clinic}</p>
      
      <button 
        onClick={handleManage}
        className="doctor-manage-btn"
      >
        إدارة الطبيب
      </button>
    </div>
  );
};


const AddDoctorButton = ({ onAdd }) => {
  return (
    <div className="add-doctor-button" onClick={onAdd}>
      <div className="add-doctor-icon">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span className="add-doctor-text">إضافة طبيب</span>
      <span className="add-doctor-subtitle">انقر لإضافة طبيب جديد</span>
    </div>
  );
};


const AddDoctorDialog = ({ isOpen, onClose, onAddDoctor }) => {
  const [doctorId, setDoctorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/clinics/add-doctor', {
        doctor_id: doctorId
      });
      
      // Create doctor object for the UI (we'll get the full doctor data from the response)
      const newDoctor = {
        id: Date.now(), // Temporary ID
        name: `طبيب ${doctorId}`, // Temporary name, will be updated when we refresh
        clinic: 'غير محدد',
        img: defaultImage, // Default image
        profile_image_url: null, // Will be updated when we refresh
        specialty: 'غير محدد',
        doctorId: doctorId
      };
      
      onAddDoctor(newDoctor);
      setDoctorId('');
      onClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors?.doctor_id) {
        setError(error.response.data.errors.doctor_id[0]);
      } else {
        setError('فشل في إضافة الطبيب');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-doctor-dialog">
      <div className="add-doctor-dialog-content">
        <div className="add-doctor-dialog-header">
          <h2 className="add-doctor-dialog-title">إضافة طبيب جديد</h2>
          <button
            onClick={onClose}
            className="add-doctor-dialog-close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-doctor-form">
          {error && (
            <div className="add-doctor-error">
              {error}
            </div>
          )}
          
          <div className="add-doctor-form-group">
            <label className="add-doctor-form-label">
              رقم الطبيب
            </label>
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="add-doctor-form-input"
              placeholder="أدخل رقم الطبيب (مثال: bfe8101)"
              required
            />
          </div>
          
          <div className="add-doctor-form-buttons">
            <button
              type="button"
              onClick={onClose}
              className="add-doctor-cancel-btn"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading || !doctorId.trim()}
              className="add-doctor-submit-btn"
            >
              {isLoading ? 'جاري الإضافة...' : 'إضافة الطبيب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clinic's doctors on component mount
  useEffect(() => {
    fetchClinicDoctors();
  }, []);

  const fetchClinicDoctors = async () => {
    try {
      const response = await axios.get('/clinics/doctors');
      const clinicDoctors = response.data.doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.full_name,
        clinic: doctor.specialization,
        img: doctor.profile_image_url || '/default-doctor.jpg', // Use real profile image or default
        profile_image_url: doctor.profile_image_url, // Store the profile image URL
        specialty: doctor.specialization,
        doctorId: doctor.user_id,
        clinicId: doctor.pivot.clinic_id
      }));
      setDoctors(clinicDoctors);
    } catch (error) {
      console.error('Error fetching clinic doctors:', error);
      // Don't fallback to mock data - show empty state
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = (doctor) => {
    console.log('Managing doctor:', doctor);
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  // Function to get dynamic grid layout based on number of cards
 

  const handleAddDoctor = (newDoctor) => {
    setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
    // Refresh the clinic's doctors list
    fetchClinicDoctors();
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
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

  // Show empty state if no doctors
  if (doctors.length === 0) {
    return (
      <div className="doctor-list-empty">
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="empty-state-title">لا يوجد أطباء في الوقت الحالي</h3>
          <p className="empty-state-message">يمكنك إضافة أطباء جدد باستخدام زر "إضافة طبيب" أدناه</p>
          
          <AddDoctorButton onAdd={handleAdd} />
        </div>
        
        <AddDoctorDialog 
          isOpen={isAddDialogOpen}
          onClose={handleCloseDialog}
          onAddDoctor={handleAddDoctor}
        />
      </div>
    );
  }

  return (
    <div 
      className="doctor-list-grid" 
    >
      {doctors.map((doctor) => (
        <DoctorCard 
          key={doctor.id} 
          doctor={doctor} 
          onManage={handleManage} 
        />
      ))}
      
      <AddDoctorButton onAdd={handleAdd} />
      
      <AddDoctorDialog 
        isOpen={isAddDialogOpen}
        onClose={handleCloseDialog}
        onAddDoctor={handleAddDoctor}
      />
    </div>
  );
};


export default DoctorList;

