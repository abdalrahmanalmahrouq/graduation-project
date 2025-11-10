import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultimage from "../../assets/img/profpic.png"
const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/patients/medical-records");
      setRecords(response.data.medicalRecords.data || []);
      if (response.data.medicalRecords.data.length > 0) {
        setExpandedRecordId(response.data.medicalRecords.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "حدث خطأ أثناء تحميل السجلات الطبية",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (recordId) => {
    setExpandedRecordId((prev) => (prev === recordId ? null : recordId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UK");
  };

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      setMessage({ type: "error", text: "لا يوجد ملف متاح" });
      return;
    }
    window.open(fileUrl, "_blank");
  };

 

  return (
    <div className="patient-medical-records-container">
  <header className="records-header">
    <div className="records-header-left">
      <i className="fa-solid fa-notes-medical records-icon pt-"></i>
      <div>
        <h1 className="records-title">السجلات الطبية</h1>
        <p className="records-subtitle">عرض السجلات الطبية والتشخيصات لكل موعد</p>
      </div>
    </div>

   
    {records.length > 0 && (
      <div className="records-count">
        <span className="count-number">{records.length}</span>
        <span className="count-label">سجل</span>
      </div>
    )}
  </header>

        {loading ? (
            <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري التحميل ...</p>
            </div>
        ) : records.length === 0 ? (
            /* Empty State */
            <div className="patient-lab-results-empty-state">
            <div className="empty-state-icon">
                <i className="fa-solid fa-notes-medical"></i>
            </div>
            <h3>لا توجد سجلات طبية</h3>
            <p>لا توجد سجلات طبية متاحة في الوقت الحالي</p>
            </div>
        ) : (
            /* Records List */
            <div className="records-list">
            {records.map((record) => (
                <div
                key={record.id}
                className={`record-card ${expandedRecordId === record.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(record.id)}
                >
                {/* summary */}
                <div className="record-summary">
                    <div className="record-avatar">
                    <img
                        src={
                        record.doctor?.user?.profile_image
                            ? `/storage/${record.doctor.user.profile_image}`
                            : defaultimage
                        }
                        alt="Doctor"
                    />
                    </div>
                    <div className="record-basic">
                    <h3>{record.doctor?.full_name || "طبيب غير معروف"}</h3>
                    <p>{record.appointment?.clinic?.clinic_name || "عيادة غير محددة"}</p>
                    <p> معرف الموعد: {record.appointment?.id || "معرف الموعد غير معروف"}</p>
                    </div>
                    <div className="record-date">
                    <i className="fa-solid fa-calendar-days me-2"></i>
                    {formatDate(record.appointment?.appointment_date)}
                    </div>
                </div>

                {/* expanded details */}
                {expandedRecordId === record.id && (
                    <div className="record-details">
                    <div className="detail-block">
                        <h4>التشخيص</h4>
                        <p>{record.consultation || "لا يوجد"}</p>
                    </div>

                    {record.prescription && (
                        <div className="detail-block">
                        <h4>الوصفة الطبية</h4>
                        <p>{record.prescription}</p>
                        </div>
                    )}

                    {record.lab_result && (
                        <div className="detail-block">
                        <h4>عنوان الفحص</h4>
                        <p>{record.lab_result.examination_title || "لا يوجد"}</p>

                        <h4 className="mt-2">الملاحظات</h4>
                        <p>{record.lab_result.notes || "لا يوجد"}</p>

                        <h4 className="mt-2">نتيجة الفحص</h4>
                        <button
                            className="btn-view"
                            onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(record.lab_result.file_url);
                            }}
                        >
                            <i className="fa-solid fa-file-arrow-down me-1"></i> عرض نتيجة الفحص
                        </button>
                        </div>
                    )}
                    </div>
                )}
                </div>
            ))}
            </div>
        )}
        </div>

  );
};

export default PatientMedicalRecords;
