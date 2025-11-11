import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const tabs = [
  { key: "booked", label: "محجوزة", icon: "bi bi-calendar-check" },
  { key: "completed", label: "مكتملة", icon: "bi bi-check2-circle" },
  { key: "cancelled", label: "ملغاة", icon: "bi bi-x-circle" },
];

const DoctorClinicAppointments = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("booked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message,setMessage]=useState({ type: '', text:''});

  // Load doctor info and clinic name once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/profile");
        setDoctorId(profileRes.data?.id || "");
      } catch (err) {
        console.error("Error loading profile:", err);
      }

      try {
        const cached = localStorage.getItem("doctor_clinics_cache");
        if (cached) {
          const list = JSON.parse(cached);
          const found = list.find((c) => String(c.user_id) === String(clinicId));
          if (found) setClinicName(found.clinic_name);
        }
      } catch (err) {
        console.error("Error loading clinic name:", err);
      }
    };

    fetchData();
  }, [clinicId]);

  // Fetch appointments whenever doctorId, clinicId, or status changes
  useEffect(() => {
    if (!doctorId || !clinicId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`/appointments/${status}/${doctorId}/${clinicId}`);
        setAppointments(data?.appointments || []);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setError("فشل في تحميل المواعيد");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, clinicId, status]);

  const handleOpenPatientProfile = (appointment) => {
    if (appointment?.patient?.user_id) {
      navigate(`/patients/by-user-id/${appointment.patient.user_id}`);
    }
  };

  const handleFinishAppointment = (appointment) => {
    if (!appointment?.id) return;
    // Navigate to medical record creation page before finishing
    navigate(`/doctor/appointments/${appointment.id}/medical-record`);
  };

  return (
    <div className="doctor-appointments" data-theme="light">
      <header className="doctor-appointments__header">
        <div className="doctor-appointments__title">
          <i className="bi bi-hospital"></i>
          <h2>{clinicName || "عيادة"}</h2>
          <span className="doctor-appointments__subtitle">مواعيدي في هذه العيادة</span>
        </div>
        <button className="btn-action btn-action--secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-right-short"></i> رجوع
        </button>
      </header>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tabs__item ${status === t.key ? "is-active" : ""}`}
            onClick={() => setStatus(t.key)}
          >
            <i className={t.icon}></i> <span>{t.label}</span>
          </button>
        ))}
      </div>

      {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
      )}

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
      ) : appointments.length === 0 ? (
        <div className="empty-block">
          <i className="bi bi-calendar-x"></i>
          <p>لا توجد مواعيد</p>
        </div>
      ) : (
        <div className="appointment-grid">
          {appointments.map((a) => (
            <div className="appointment-card" key={a.id}>
              <div className="appointment-card__header">
                <div className="appointment-card__identity">
                  <div className="avatar-circle">
                    <span>{a.patient?.user?.profile_image ? <img src={`/storage/${a.patient?.user?.profile_image}`}  className="avatar-image" alt="Patient" /> : <i className="bi bi-person"></i>}</span>
                  </div>
                  <div className="identity-text">
                    <div
                      onClick={() => handleOpenPatientProfile(a)}
                      style={{cursor: 'pointer', color: 'var(--accent-color)', textDecoration: 'underline'}}
                    >
                      {a.patient?.full_name || "غير محدد"}
                    </div>
                    <div className="date" dir="ltr">{a.appointment_date}</div>
                  </div>
                </div>
                <span className={`status-pill status-pill--${a.status}`}>
                  {status === "booked"
                    ? "محجوز"
                    : status === "completed"
                    ? "مكتمل"
                    : "ملغي"}
                </span>
              </div>

              <div className="appointment-card__body">
                <div className="info">
                  <div className="info__item">
                    <div className="info__label">
                      <i className="bi bi-clock"></i> الوقت
                    </div>
                    <div className="info__value">
                      {a.starting_time} - {a.ending_time}
                    </div>
                  </div>
                  <div className="info__item">
                    <div className="info__label">
                      <i className="bi bi-calendar3"></i> اليوم
                    </div>
                    <div className="info__value">{a.day || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="appointment-card__footer">
                {status === "booked" && (
                  <>
                    <button
                      className="btn-action btn-action--secondary"
                      onClick={() => navigate(`/doctor/appointments/${a.id}/medical-record`)}
                    >
                      <i className="bi bi-file-medical"></i> السجل الطبي
                    </button>
                    <button
                      className="btn-action btn-action--medicina"
                      onClick={() => handleFinishAppointment(a)}
                    >
                      <i className="bi bi-check2"></i> إنهاء الموعد
                    </button>
                  </>
                )}
                {status === "completed" && (
                  <button
                    className="btn-action btn-action--primary"
                    onClick={() => navigate(`/doctor/appointments/${a.id}/medical-record`)}
                  >
                    <i className="bi bi-eye"></i> عرض السجل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorClinicAppointments;
