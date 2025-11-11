import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const DoctorAllAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/doctors/get-all-patients-appointments-with-medical-record"); // <-- your API endpoint
        if (data?.success) {
          setAppointments(data.appointments || []);

          // Extract unique clinics for filter dropdown
          const uniqueClinics = [
            ...(await axios.get('/doctors/get-clinics')).data.clinics.map((c) => c.clinic_name),
          
          ].filter(Boolean);
          setClinics(uniqueClinics);
        } else {
          setError("فشل في تحميل البيانات");
        }
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل المواعيد");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleOpenPatientProfile = (appointment) => {
    if (appointment?.patient?.user_id) {
      navigate(`/patients/by-user-id/${appointment.patient.user_id}`);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesStatus =
        statusFilter === "all" ? true : a.status === statusFilter;
      const matchesClinic =
        clinicFilter === "all"
          ? true
          : a.clinic?.clinic_name === clinicFilter;
      return matchesStatus && matchesClinic;
    });
  }, [appointments, statusFilter, clinicFilter]);

  return (
    <div className="doctor-appointments-page">
      <header className="page-header">
        <div>
          <h2>
            <i className="bi bi-calendar-week " style={{fontSize: '2rem', color:'var(--heading-color)'}}></i> 
            <span style={{fontSize: '2rem', fontWeight: '700', color:'var(--heading-color)', marginRight: '10px'}}>جميع المواعيد</span>
          </h2>
          <p className="doctor-all-appointments__subtitle">عرض كل المواعيد الخاصة بالطبيب عبر جميع العيادات</p>
        </div>
      </header>

      {/* Filters */}
      <div className="doctor-all-appointments__filters-bar">
        <div className="doctor-all-appointments__filter">
          <label>حالة الموعد</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="booked">محجوزة</option>
            <option value="completed">مكتملة</option>
            <option value="cancelled">ملغاة</option>
          </select>
        </div>

        <div className="doctor-all-appointments__filter">
          <label>اسم العيادة</label>
          <select
            value={clinicFilter}
            onChange={(e) => setClinicFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            {clinics.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
       <div className="text-center py-5">
       <div className="spinner-border text-primary" role="status">
         <span className="visually-hidden">جاري التحميل...</span>
       </div>
       <p className="mt-3 text-muted">جاري التحميل ...</p>
    </div>
      ) : error ? (
        <div className="alert-block alert-block--danger">{error}</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-block">
          <i className="bi bi-calendar-x"></i>
          <p>لا توجد مواعيد مطابقة</p>
        </div>
      ) : (
        <div className="doctor-all-appointments__list">
          {filteredAppointments.map((a) => (
            <div className="doctor-all-appointments-card" key={a.id}>
              <div className="doctor-all-appointments-card__header">
                <div className="doctor-all-appointments-card__identity">
                  <div className="doctor-all-appointments-card__avatar">
                    {a.patient?.user?.profile_image ? (
                      <img
                        src={`/storage/${a.patient.user.profile_image}`}
                        alt="Patient"
                      />
                    ) : (
                      <i className="bi bi-person"></i>
                    )}
                  </div>
                  <div className="doctor-all-appointments-card__identity-text">
                    <h4 onClick={() => handleOpenPatientProfile(a)} style={{cursor: 'pointer', color: 'var(--accent-color)'}}>{a.patient?.full_name || "مريض غير معروف"}</h4>
                    <p>{a.clinic?.clinic_name || "عيادة غير محددة"}</p>
                  </div>
                </div>
                <span className={`doctor-all-appointments-card__status-pill doctor-all-appointments-card__status-${a.status}`}>
                  {a.status === "booked"
                    ? "محجوز"
                    : a.status === "completed"
                    ? "مكتمل"
                    : "ملغي"}
                </span>
              </div>

              <div className="doctor-all-appointments-card__body">
                <div className="doctor-all-appointments-card__info-row">
                  <i className="bi bi-clock"></i>
                  <span>
                    {a.starting_time} - {a.ending_time}
                  </span>
                </div>
                <div className="doctor-all-appointments-card__info-row">
                  <i className="bi bi-calendar3"></i>
                  <span dir="ltr">{a.appointment_date}</span>
                </div>
                {a.medical_record && (
                  <div className="doctor-all-appointments-card__info-row">
                    <i className="bi bi-file-medical"></i>
                    <span>تم إضافة سجل طبي</span>
                  </div>
                )}
              </div>

              <div className="doctor-all-appointments-card__footer">
                <button
                  className="btn-action btn-action--primary"
                  onClick={() =>
                    navigate(`/doctor/appointments/${a.id}/medical-record`)
                  }
                >
                  <i className="bi bi-eye"></i> عرض السجل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAllAppointments;
