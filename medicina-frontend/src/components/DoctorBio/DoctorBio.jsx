import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import editbanner from '../../assets/img/theme/edit.png';
import arrowbanner from '../../assets/img/theme/arrow.png';
import biobanner from '../../assets/img/theme/bio.png'; 

const DoctorBio = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBio, setIsLoadingBio] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadBio();
  }, []);

  const loadBio = async () => {
    try {
      setIsLoadingBio(true);
      const response = await axios.get('/doctors/get-bio');
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Error loading bio:', error);
      // If bio doesn't exist yet, that's fine - just start with empty string
      setBio('');
    } finally {
      setIsLoadingBio(false);
    }
  };

  const handleInputChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Simple validation
    if (bio.trim().length === 0) {
      setMessage({ type: 'error', text: 'Bio cannot be empty' });
      setIsLoading(false);
      return;
    }

    if (bio.trim().length > 1000) {
      setMessage({ type: 'error', text: 'Bio cannot exceed 1000 characters' });
      setIsLoading(false);
      return;
    }

    try {
      // Check if bio exists to determine whether to add or update
      const existingBio = await axios.get('/doctors/get-bio').catch(() => ({ data: { bio: null } }));
      
      if (existingBio.data.bio) {
        // Update existing bio
        await axios.post('/doctors/update-bio', {
          bio: bio.trim()
        });
      } else {
        // Add new bio
        await axios.post('/doctors/add-bio', {
          bio: bio.trim()
        });
      }

      setMessage({ type: 'success', text: 'Bio saved successfully!' });
      
      // Redirect back to account page after 2 seconds
      setTimeout(() => {
        navigate(`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'doctor'}/account`);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save bio. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading component
  if (isLoadingBio) {
    return (
      <div className="user-account-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your bio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-account-container">
      <div className="user-account-wrapper">
        <div className="modern-profile-card" id="doctorBioCard">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-title text-center">
              <h2 className="user-name">Doctor Bio</h2>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Bio Form */}
          <div className="profile-content">
            <div className="bio-form-container">
              <div className="info-field modern-field bio-field-full-width">
                <div className="field-icon">
                 <img src={biobanner} alt="" style={{width: '40px', height: '40px'}}/>
                </div>
                <div className="field-content">
                  <label className="field-label">Bio Description</label>
                  <textarea
                    value={bio}
                    onChange={handleInputChange}
                    className="field-input bio-textarea"
                    placeholder="Enter your professional bio and description..."
                    rows="8"
                    maxLength="1000"
                  />
                  <div className="character-count">
                    {bio.length}/1000 characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button 
              onClick={handleSubmit} 
              className="modern-btn primary-btn"
              disabled={isLoading}
            >
              <span className="btn-icon pb-1">
                <img src={editbanner} alt="Save" style={{width: '20px', height: '20px'}}/>
              </span>
              {isLoading ? 'Saving...' : 'Save Bio'}
            </button>
            
            <button 
              onClick={() => navigate(`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'doctor'}/account`)} 
              className="modern-btn secondary-btn"
            >
              <span className="btn-icon pb-1">
                <img src={arrowbanner} alt="Arrow" style={{width: '20px', height: '20px'}}/>
              </span>
              Back to Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBio;
