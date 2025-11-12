import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';


const ClinicAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [clinicId, setClinicId] = useState('');
  const navigate = useNavigate();
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    doctor_id: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchClinicData();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (clinicId) {
      fetchAppointments();
    }
  }, [clinicId, filters]);

  const fetchClinicData = async () => {
    try {
      const response = await axios.get('/profile');
      setClinicId(response.data.id);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
      setError('خطأ في جلب بيانات العيادة');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/clinics/doctors');
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/appointments/all-appointments/${clinicId}${queryString ? '?' + queryString : ''}`;
      
      const response = await axios.get(url);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('خطأ في جلب المواعيد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      doctor_id: '',
      date_from: '',
      date_to: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success';
      case 'booked':
        return 'bg-primary';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'متاح';
      case 'booked':
        return 'محجوز';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

 

  const formatTime = (timeString) => {
    return timeString;
  };

  if (isLoading) {
    return (
     <Loading />
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">مواعيد العيادة</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchAppointments}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              تحديث
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">فلترة المواعيد</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">حالة الموعد</label>
                  <select 
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">جميع المواعيد</option>
                    <option value="available">متاح</option>
                    <option value="booked">محجوز</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">الطبيب</label>
                  <select 
                    className="form-select"
                    value={filters.doctor_id}
                    onChange={(e) => handleFilterChange('doctor_id', e.target.value)}
                  >
                    <option value="">جميع الأطباء</option>
                    {doctors.map(doctor => (
                      <option key={doctor.user_id} value={doctor.user_id}>
                        {doctor.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">من تاريخ</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  />
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">إلى تاريخ</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  />
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">&nbsp;</label>
                  <button 
                    className="btn btn-outline-secondary d-block w-100"
                    onClick={clearFilters}
                  >
                    مسح الفلاتر
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Appointments List */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                المواعيد ({appointments.length})
              </h5>
            </div>
            <div className="card-body">
              {appointments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <p className="text-muted mt-3">لا توجد مواعيد</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        
                        
                        <th>الطبيب</th>
                        <th>المريض</th>
                        <th>الوقت</th>
                        <th>اليوم</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                        <td>
                            <div className="d-flex align-items-center">
                                <span>{appointment.doctor?.full_name || 'غير محدد'}</span>
                            </div>
                        </td>
                        <td>
                            {appointment.patient ? (
                              
                              <div className="d-flex align-items-center">
                               
                               <span 
                                className="patient-name-link"
                                onClick={() => navigate(`/patients/by-user-id/${appointment.patient.user_id}`)}  
                              >
                                {appointment.patient.full_name}
                              </span>
                              </div>
                            ) : (
                              <span className="text-muted">غير محدد</span>
                            )}
                          </td>
                          <td>
                            {formatTime(appointment.starting_time)} - {formatTime(appointment.ending_time)}
                          </td>
                          <td>{appointment.day}</td>
                          <td>{appointment.appointment_date}</td>
                          
                          <td>
                            <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                              {getStatusText(appointment.status)}
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
        </div>
      </div>
    </div>
  );
};

export default ClinicAppointments;
