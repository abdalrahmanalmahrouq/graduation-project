import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MedicalRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [appointment, setAppointment] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [selectedLabResultId, setSelectedLabResultId] = useState(null);
  const [consultation, setConsultation] = useState("");
  const [prescription, setPrescription] = useState("");
  const [existingRecord, setExistingRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        const { data } = await axios.get(
          `/appointment/${appointmentId}/medical-record/create`
        );
        setAppointment(data?.appointment || null);
        const results = data?.lab_results || [];
        setLabResults(results);
        if (results.length && !selectedLabResultId) {
          setSelectedLabResultId(results[0].id);
        }

        // If appointment already completed, try to load the saved record for read-only view
        if ((data?.appointment?.status || "") === "completed") {
          await fetchExistingRecordForAppointment(String(appointmentId));
        }
      } catch (err) {
        console.error("Failed to load medical record data:", err);
        setMessage({
          type: "error",
          text:
            err.response?.data?.message || "فشل في تحميل بيانات الموعد والفحوصات",
        });
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) fetchData();
  }, [appointmentId]);

  const fetchExistingRecordForAppointment = async (apptId) => {
    try {
      // try first few pages to find the record; backend paginates 10 per page
      let page = 1;
      let found = null;
      const maxPages = 5;
      while (page <= maxPages && !found) {
        const res = await axios.get(`/medical-records?page=${page}`);
        const payload = res.data?.data || {};
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.data)
          ? payload.data
          : [];
        found = items.find((r) => {
          const appt = r.appointment || {};
          return String(appt.id) === String(apptId);
        });

        // Stop if last page reached
        const lastPage = payload?.last_page || page; // if no paginate meta
        if (page >= lastPage) break;
        page += 1;
      }

      if (found) {
        setExistingRecord(found);
        if (found.consultation) setConsultation(found.consultation);
        if (found.prescription) setPrescription(found.prescription);
        if (found.lab_result_id) setSelectedLabResultId(found.lab_result_id);
      } else {
        setMessage((m) => ({ ...m, type: m.type || "info", text: m.text || "لم يتم العثور على سجل طبي محفوظ لهذا الموعد" }));
      }
    } catch (err) {
      console.error("Failed to load existing medical record:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-UK");
    } catch (_) {
      return String(dateString);
    }
  };

  const handleOpenFile = (result) => {
    const fileUrl = result?.file_url;
    if (!fileUrl) return;
    window.open(fileUrl, "_blank");
  };

  const handleSaveAndFinish = async () => {
    // Don't allow edits when appointment is already completed
    const isCompleted = appointment?.status === "completed";
    if (isCompleted) {
      setMessage({ type: "error", text: "تم إنهاء الموعد بالفعل. لا يمكن التعديل." });
      return;
    }
    if (!consultation.trim()) {
      setMessage({ type: "error", text: "الاستشارة مطلوبة" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // Create medical record
      await axios.post(`/appointment/${appointmentId}/medical-record`, {
        consultation: consultation.trim(),
        prescription: prescription.trim() || null,
        lab_result_id: selectedLabResultId || null,
      });

      // Finish appointment
      await axios.put(`/appointments/finish/${appointmentId}`);

      setMessage({ type: "success", text: "تم حفظ السجل وإنهاء الموعد" });

      // Go back to previous page after a short delay
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error("Save/Finish failed:", err);
      const msg =
        err.response?.data?.message ||
        "فشل حفظ السجل الطبي أو إنهاء الموعد";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const Header = () => {
    const isCompleted = appointment?.status === "completed";
    return (
      <div className="medical-record-header">
        <div className="header-left">
          <div className="icon-circle">
            <i className="fa-solid fa-file-medical medicina-theme-icon"></i>
          </div>
          <div className="title-wrap">
            <h1 className="title">السجل الطبي للموعد</h1>
            <p className="subtitle">
              {isCompleted
                ? "تم إنهاء هذا الموعد — العرض فقط"
                : "راجع نتائج المختبر ثم احفظ السجل"}
            </p>
          </div>
        </div>
        <div className="header-actions">
          {isCompleted && (
            <span className="status-badge pl-3">
              <i className="bi bi-check2-circle"></i> مكتمل
            </span>
          )}
          <button className="btn-action btn-action--secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-right-short"></i> رجوع
          </button>
        </div>
      </div>
    );
  };

  const AppointmentSummary = () => (
    <div className="appointment-summary">
      <div className="summary-item">
        <span className="label"><i className="bi bi-person"></i> المريض</span>
        <span className="value pr-2">{appointment?.patient?.full_name || "-"}</span>
      </div>
      <div className="summary-item">
        <span className="label"><i className="bi bi-calendar3"></i> التاريخ</span>
        <span className="value pr-2">{appointment?.appointment_date || "-"}</span>
      </div>
      <div className="summary-item">
        <span className="label"><i className="bi bi-clock"></i> الوقت</span>
        <span className="value pr-2">
          {appointment?.starting_time} - {appointment?.ending_time}
        </span>
      </div>
    </div>
  );

  return (
    <div className="medical-record-container">
      

      {message.text && (
        <div
          className={`alert alert-${
            message.type === "success" ? "success" : "danger"
          } mx-1 mt-3`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {loading ? (
            <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري التحميل ...</p>
            </div>
        ) : (
        <>
          <Header />
          <AppointmentSummary />

          <div className="medical-record-content">
            <div className="lab-results-section">
              <div className="lab-results-section-header">
                <h3>
                  <i className="fa-solid fa-flask pl-2"></i> نتائج المختبر المرتبطة
                </h3>
                {labResults.length > 0 && (
                  <span className="badge bg-brand">{labResults.length}</span>
                )}
              </div>

              {labResults.length === 0 ? (
                <div className="empty-block">
                  <i className="bi bi-inboxes"></i>
                  <p>لا توجد نتائج مختبر معتمدة لهذا الموعد</p>
                </div>
              ) : (
                <div className="lab-result-list pt-10">
                  {labResults.map((result) => {
                    const isCompleted = appointment?.status === "completed";
                    return (
                    <label key={result.id} className={`lab-result-card ${selectedLabResultId === result.id ? "selected" : ""} ${isCompleted ? "is-readonly" : ""} pt-2`}>
                      <input
                        type="radio"
                        name="lab_result"
                        value={result.id}
                        checked={selectedLabResultId === result.id}
                        onChange={() => setSelectedLabResultId(result.id)}
                        disabled={isCompleted}
                      />
                      <div className="card-content">
                        <div className="card-icon">
                          <i className="fa-solid fa-file-medical"></i>
                        </div>
                        <div className="card-info">
                          <div className="title-row">
                            <h4 className="result-title">{result.examination_title || "فحص"}</h4>
                            <span className="date">{formatDate(result.approved_at)}</span>
                          </div>
                          {result.notes && (
                            <p className="notes">{result.notes}</p>
                          )}
                          {result.file_url && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenFile(result);
                              }}
                              style={{ transition: 'all 0.3s ease', background: 'var(--accent-color)', color: 'var(--surface-color)' }}
                            >
                              <i className="bi bi-file-earmark-arrow-down"></i> عرض الملف
                            </button>
                          )}
                        </div>
                      </div>
                    </label>
                  );})}
                </div>
              )}
              </div>

            <div className="record-form-section">
              <div className="lab-results-section-header">
                <h3>
                  <i className="fa-solid fa-stethoscope pl-2"></i> تفاصيل السجل الطبي
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">الاستشارة الطبية <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={consultation}
                    onChange={(e) => setConsultation(e.target.value)}
                    disabled={appointment?.status === "completed"}
                    placeholder="اكتب ملخص الاستشارة والتشخيص"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الوصفة الطبية</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    disabled={appointment?.status === "completed"}
                    placeholder="أدوية أو توصيات إضافية (اختياري)"
                  />
                </div>
              </div>

              <div className="actions-row">
                <button
                  className="btn-action btn-action--secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  <i className="bi bi-arrow-right"></i> رجوع
                </button>
                {appointment?.status !== "completed" && (
                  <button
                    className="btn-action btn-action--medicina"
                    type="button"
                    onClick={handleSaveAndFinish}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle"></i> حفظ السجل وإنهاء الموعد
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalRecord;