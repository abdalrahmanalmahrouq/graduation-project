import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import { Link } from 'react-router-dom';
import { color } from 'framer-motion';

const DoctorAppointmentsList = ({ doctorId }) => {
  const [activeStatus, setActiveStatus] = useState('booked'); // booked, completed, cancelled, no_show
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clinicId, setClinicId] = useState(null);

  // 1. First, get the logged-in Clinic's User ID
  useEffect(() => {
    const fetchClinicId = async () => {
      try {
        const response = await axios.get('/profile'); // Assuming this returns logged-in user info
        setClinicId(response.data.id); // Assuming 'id' is the clinic's user_id (e.g. "clinic1")
      } catch (err) {
        console.error("Failed to fetch clinic profile", err);
        setError("فشل في تحديد هوية العيادة");
        setLoading(false);
      }
    };
    fetchClinicId();
  }, []);

  // 2. Fetch Appointments when status or clinicId changes
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!clinicId || !doctorId) return;

      setLoading(true);
      setError('');
      try {
        // Map frontend status to your specific API endpoints
        // Note: You defined specific routes: /appointments/booked, /appointments/completed
        const endpointMap = {
          'booked': '/appointments/booked',
          'completed': '/appointments/completed',
          'cancelled': '/appointments/cancelled',
          'no_show': '/appointments/no_show'
        };

        const endpoint = endpointMap[activeStatus];

        const response = await axios.get(endpoint, {
          params: {
            doctor_id: doctorId,
            clinic_id: clinicId
            // You can add starting_date / ending_date here if you add a date picker later
          }
        });

        setAppointments(response.data.appointments || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("فشل في تحميل المواعيد");
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchAppointments();
    }
  }, [activeStatus, clinicId, doctorId]);

  // Helper to translate status
  const getStatusLabel = (status) => {
    const labels = {
      booked: 'محجوز',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      no_show: 'لم يحضر'
    };
    return labels[status] || status;
  };

  // Helper to format day name
  const formatDay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(date);
  };

  if (error) {
    return (
        <div className="p-6 text-center bg-red-50 rounded-xl border border-red-100 text-red-600">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">إعادة المحاولة</button>
        </div>
    );
  }

  return (
    <div className="appointments-container">
      {/* 1. Filters Bar */}
      <div className="filters-bar">
        <button 
          className={`status-filter-btn ${activeStatus === 'booked' ? 'active' : ''}`}
          onClick={() => setActiveStatus('booked')}
        >
          <i className="fas fa-calendar-check me-2"></i>
          المواعيد القادمة (Booked)
        </button>
        <button 
          className={`status-filter-btn ${activeStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveStatus('completed')}
        >
          <i className="fas fa-check-circle me-2"></i>
          المكتملة (Completed)
        </button>
        <button 
          className={`status-filter-btn ${activeStatus === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveStatus('cancelled')}
        >
          <i className="fas fa-ban me-2"></i>
          الملغية (Cancelled)
        </button>
        <button 
          className={`status-filter-btn ${activeStatus === 'no_show' ? 'active' : ''}`}
          onClick={() => setActiveStatus('no_show')}
        >
          <i className="fas fa-user-times me-2"></i>
          لم يحضر (No-Show)
        </button>
      </div>

      {/* 2. Content Area */}
      <div className="table-content">
        {loading ? (
            <div className="p-12"><Loading /></div>
        ) : appointments.length === 0 ? (
            <div className="empty-state p-12 text-center">
                <div className="text-gray-300 mb-4 text-5xl">
                    <i className="fas fa-calendar-times"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-700">لا توجد مواعيد</h3>
                <p className="text-gray-500">لا توجد مواعيد بهذه الحالة حالياً لهذا الطبيب.</p>
            </div>
        ) : (
            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>المريض</th>
                            <th>التاريخ</th>
                            <th>اليوم</th>
                            <th>الوقت</th>
                            <th>الحالة</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>
                                    <div className="patient-cell">
                                        <Link to={`/patients/by-user-id/${appt.patient?.user_id}`} style={{textDecoration:'underline'}}>
                                          <span className="text-brand">{appt.patient?.full_name || 'زائر'}</span>
                                        </Link>
                                       
                                    </div>
                                </td>
                                <td>
                                    <div className="date-badge">
                                        <i className="far fa-calendar-alt text-blue-500"></i>
                                        {appt.appointment_date}
                                    </div>
                                </td>
                                <td className="font-medium text-gray-600">
                                    {formatDay(appt.appointment_date)}
                                </td>
                                <td>
                                    <span className="time-range-badge">
                                        {appt.starting_time?.substring(0,5)} - {appt.ending_time?.substring(0,5)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${appt.status}`}>
                                        {getStatusLabel(appt.status)}
                                    </span>
                                </td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsList;