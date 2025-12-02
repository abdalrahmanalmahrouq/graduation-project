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
  const [clinicLogo, setClinicLogo] = useState('');
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    doctor_id: '',
    date_from: '',
    date_to: ''
  });

  // 1. Initial Load
  useEffect(() => {
    fetchClinicData();
    fetchDoctors();
  }, []);

  // 2. Fetch Appointments when Clinic ID is set or Filters change
  useEffect(() => {
    if (clinicId) {
      fetchAppointments();
    }
  }, [clinicId, filters]);

  // --- API Functions ---

  const fetchClinicData = async () => {
    try {
      const response = await axios.get('/profile');
      // Ensure we get the Clinic's User ID (e.g., 'clinic1') to use in the URL
      setClinicId(response.data.id); 
      setClinicLogo(response.data.profile_image_url || '');
    } catch (error) {
      console.error('Error fetching clinic data:', error);
      setError('خطأ في جلب بيانات العيادة');
    }
  };

  const fetchDoctors = async () => {
    try {
      // UPDATED API ENDPOINT
      const response = await axios.get('/clinics/get-doctors');
      // UPDATED DATA ACCESS: Resource returns { data: [...] }
      setDoctors(response.data.data || []); 
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      queryParams.append('clinic_id', clinicId); // Must send clinic_id
      if (filters.status) queryParams.append('status', filters.status)
      
      // Only append filters that have values
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.doctor_id) queryParams.append('doctor_id', filters.doctor_id);
      if (filters.date_from) queryParams.append('date_from', filters.date_from);
      if (filters.date_to) queryParams.append('date_to', filters.date_to);
      
     const queryString = queryParams.toString();
     const url = `/appointments/search?${queryString}`;

      const response = await axios.get(url);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('خطأ في جلب المواعيد');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      doctor_id: '',
      date_from: '',
      date_to: ''
    });
  };

  // --- Helpers ---

  const getStatusBadgeClass = (status) => {
    const map = {
      available: 'bg-success',
      booked: 'bg-primary',
      completed: 'bg-info',
      cancelled: 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const map = {
      available: 'متاح',
      booked: 'محجوز',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return map[status] || status;
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '--:--';
  };

  if (isLoading && !clinicId) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
            <h2 className="mb-0 fw-bold text-dark" >سجل مواعيد العيادة</h2>
            <img src={clinicLogo} alt="Clinic Appointments" className='profile-pic  ms-3' style={{width: '60px', height: '60px'}} />
            </div>
            <button 
              className="btn btn-primary px-4"
              onClick={fetchAppointments}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              تحديث البيانات
            </button>
          </div>

          {/* Filters Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-secondary"><i className="bi bi-funnel me-2"></i>فلترة البحث</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-bold">حالة الموعد</label>
                  <select 
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">الكل</option>
                    <option value="booked">محجوز (Booked)</option>
                    <option value="completed">مكتمل (Completed)</option>
                    <option value="cancelled">ملغي (Cancelled)</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-bold">الطبيب</label>
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
                  <label className="form-label text-muted small fw-bold">من تاريخ</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  />
                </div>
                
                <div className="col-md-2">
                  <label className="form-label text-muted small fw-bold">إلى تاريخ</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  />
                </div>
                
                <div className="col-md-2 d-flex align-items-end">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    مسح
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger shadow-sm border-0" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          {/* Appointments Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-secondary">
                <i className="bi bi-list-ul me-2"></i>
                قائمة المواعيد <span className="badge bg-light text-dark ms-2">{appointments.length}</span>
              </h5>
            </div>
            
            <div className="card-body p-0">
              {isLoading ? (
                 <div className="p-5"><Loading /></div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted opacity-50">
                    <i className="fas fa-calendar-times fa-3x"></i>
                  </div>
                  <h5 className="text-muted">لا توجد مواعيد مطابقة للفلاتر</h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4">الطبيب</th>
                        <th className="py-3">المريض</th>
                        <th className="py-3">اليوم والتاريخ</th>
                        <th className="py-3">الوقت</th>
                        <th className="py-3 text-center">الحالة</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">
                                {appointment.doctor?.full_name || 'غير محدد'}
                            </div>
                            <small className="text-muted" style={{fontSize: '0.75rem'}}>
                                ID: {appointment.doctor?.user_id}
                            </small>
                          </td>
                          <td>
                            {appointment.patient ? (
                                <span 
                                    className="text-brand text-decoration-underline fw-bold"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => navigate(`/patients/by-user-id/${appointment.patient.user_id}`)}
                                >
                                    {appointment.patient.full_name}
                                </span>
                            ) : (
                                <span className="text-muted fst-italic">--</span>
                            )}
                          </td>
                          <td>
                            <div className="fw-bold">{appointment.appointment_date}</div>
                            <div className="text-muted small">{appointment.day}</div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                                {formatTime(appointment.starting_time)} - {formatTime(appointment.ending_time)}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`badge rounded-pill ${getStatusBadgeClass(appointment.status)} px-3 py-2`}>
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