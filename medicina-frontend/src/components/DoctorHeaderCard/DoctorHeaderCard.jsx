import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import defaultImage from '../../assets/img/profpic.png';

const DoctorHeaderCard = ({ 
    doctor, 
    showStats = true, 
    showSpecialty = true,
    showClinics = true,
    selectedClinic = null, // Specific clinic to show instead of all clinics
    className = "",
    imageSize = "large" // "small", "medium", "large"
}) => {
    const getDefaultImage = () => {
        return defaultImage;
    };

    const getImageSizeClass = () => {
        switch (imageSize) {
            case "small":
                return "profile-avatar-small";
            case "medium":
                return "profile-avatar-medium";
            case "large":
            default:
                return "profile-avatar doctor-profile-image";
        }
    };

    const getHeaderSizeClass = () => {
        switch (imageSize) {
            case "small":
                return "doctor-profile-header-small";
            case "medium":
                return "doctor-profile-header-medium";
            case "large":
            default:
                return "doctor-profile-header";
        }
    };

    const getNameSizeClass = () => {
        switch (imageSize) {
            case "small":
                return "doctor-name-small";
            case "medium":
                return "doctor-name-medium";
            case "large":
            default:
                return "doctor-name";
        }
    };

    if (!doctor) {
        return null;
    }

    return (
        <div className={`modern-profile-card doctor-header-card ${className}`}>
            <div className={`profile-header ${getHeaderSizeClass()}`}>
                <div className="profile-avatar-container">
                    <img
                        src={doctor.profile_image_url || getDefaultImage()}
                        alt={doctor.name}
                        className={getImageSizeClass()}
                    />
                </div>
                <div className="profile-title">
                    <h1 className={`user-name ${getNameSizeClass()} text-center`}>
                        {doctor.name}
                    </h1>
                    {showSpecialty && doctor.specialization && (
                        <p className="doctor-specialty">
                            {doctor.specialization}
                        </p>
                    )}
                    {showClinics && (
                        <div className="doctor-clinics">
                            {selectedClinic ? (
                                <div className="selected-clinic-info">
                                    
                                    <span className="clinic-name">
                                    <i className="fas fa-hospital me-1"></i>
                                        {selectedClinic.name}
                                        </span>
                                  
                                </div>
                            ) : null}
                        </div>
                    )}
                    {showStats && (
                        <div className="doctor-stats">
                            {doctor.clinics && doctor.clinics.length > 0 && (
                                <Badge bg="primary" className="me-2">
                                    <i className="fas fa-hospital me-1"></i>
                                    {doctor.clinics.length} عيادة
                                </Badge>
                            )}
                            <Badge bg="success">
                                <i className="fas fa-star me-1"></i>
                                متاح للحجز
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// PropTypes for better type checking and documentation
DoctorHeaderCard.propTypes = {
    doctor: PropTypes.shape({
        name: PropTypes.string.isRequired,
        specialization: PropTypes.string,
        profile_image_url: PropTypes.string,
        clinics: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            address: PropTypes.string,
        })),
    }).isRequired,
    showStats: PropTypes.bool,
    showSpecialty: PropTypes.bool,
    showClinics: PropTypes.bool,
    selectedClinic: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        address: PropTypes.string,
    }),
    className: PropTypes.string,
    imageSize: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default DoctorHeaderCard;
