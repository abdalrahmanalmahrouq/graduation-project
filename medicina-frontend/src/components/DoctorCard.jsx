import React, { useState } from 'react'
import { clinicsData } from '../data/clinicsData';


const DoctorCard = ({ doctor, onManage }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-image-container">
        <div className="relative">
          <img 
            src={doctor.img} 
            alt={doctor.name}
            className="doctor-image"
          />
          <div className="doctor-status">
            <div className="doctor-status-dot"></div>
          </div>
        </div>
      </div>
      
      <h3 className="doctor-name">{doctor.name}</h3>
      <p className="doctor-specialty">{doctor.specialty || doctor.clinic}</p>
      
      <button 
        onClick={() => onManage(doctor)}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would fetch doctor data from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock doctor object (in real app, this would come from API)
      const newDoctor = {
        id: Date.now(), // Temporary ID
        name: `د. طبيب جديد ${doctorId}`,
        clinic: 'عيادة الأطفال',
        img: '/default-doctor.jpg', // Default image
        specialty: 'طبيب أطفال',
        doctorId: doctorId
      };
      
      onAddDoctor(newDoctor);
      setDoctorId('');
      onClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
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
          <div className="add-doctor-form-group">
            <label className="add-doctor-form-label">
              رقم الطبيب
            </label>
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="add-doctor-form-input"
              placeholder="أدخل رقم الطبيب"
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
  const [doctors, setDoctors] = useState(clinicsData.kids);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleManage = (doctor) => {
    console.log('Managing doctor:', doctor);
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  // Function to get dynamic grid layout based on number of cards
  const getGridLayout = () => {
    const totalCards = doctors.length + 1; // +1 for add button
    
    // Calculate padding based on number of cards
    let paddingTop = '2rem'; // Base padding
    
    if (totalCards <= 6) {
      paddingTop = '2rem'; // Extra padding for 3+ rows
    } else if (totalCards <= 9) {
      paddingTop = '30rem'; // Medium padding for 2 rows
    }else{
      paddingTop = '55rem';
    }
    
    return {
      paddingTop: paddingTop
    };
  };

  const handleAddDoctor = (newDoctor) => {
    setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
  };

  const gridLayout = getGridLayout();

  return (
    <div 
      className="doctor-list-grid" 
      style={{ paddingTop: gridLayout.paddingTop }}
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

