import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../Loading';
import AppointmentCalendar from '../../Appointments/AppointmentCalendar';
import TimeSlotSelector from '../../Appointments/TimeSlotSelector';

const ClinicCreateAppointmentModal = ({ isOpen, onClose, doctorId, doctorPrivateId, doctorName, clinicId, onSuccess }) => {
  const [workingDays, setWorkingDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1); // 1 = patient & date, 2 = time slot

  // Helper to normalize a single day's data:
  // - null / undefined / empty object => null (non‑working day)
  // - any object with at least one time value => the same object
  const normalizeDay = (rawDay) => {
    if (!rawDay || typeof rawDay !== 'object') return null;

    const { start_time, end_time, break_start, break_end } = rawDay;
    const hasAnyTime = !!(start_time || end_time || break_start || break_end);

    return hasAnyTime ? rawDay : null;
  };

  useEffect(() => {
    if (!isOpen || !doctorId) return;

    const fetchWorkingDays = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/clinics/doctors/${doctorId}/schedule`);
        let incomingSchedule = response.data.schedule;

        if (typeof incomingSchedule === 'string') {
          try {
            incomingSchedule = JSON.parse(incomingSchedule);
          } catch (e) {
            console.error('Error parsing schedule JSON:', e);
            incomingSchedule = {};
          }
        }

        const safeSchedule = incomingSchedule || {};
        // Extract working days (days that are not null after normalization)
        const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const working = days.filter(day => {
          const rawDay = safeSchedule[day] || safeSchedule[day?.toLowerCase()];
          const normalized = normalizeDay(rawDay);
          return normalized !== null;
        });
        setWorkingDays(working);
      } catch (err) {
        console.error('Error fetching doctor schedule:', err);
        setError('حدث خطأ أثناء تحميل جدول الطبيب.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingDays();
  }, [isOpen, doctorId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedSlot(null);
      setPatientId('');
      setError('');
      setMessage({ type: '', text: '' });
      setStep(1);
    }
  }, [isOpen]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError('');
    setMessage({ type: '', text: '' });
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError('');
    setMessage({ type: '', text: '' });
  };

  const handleNextStep = () => {
    setError('');
    setMessage({ type: '', text: '' });

    // Validate required fields for step 1
    if (!patientId.trim()) {
      setError('يرجى إدخال معرف المريض');
      return;
    }

    if (!selectedDate) {
      setError('يرجى اختيار تاريخ من التقويم');
      return;
    }

    setStep(2);
  };

  const handleBackStep = () => {
    setError('');
    setMessage({ type: '', text: '' });
    setStep(1);
  };

  const handleSubmit = async () => {
    setError('');
    setMessage({ type: '', text: '' });

    // Validation
    if (!patientId.trim()) {
      setError('يرجى إدخال معرف المريض');
      return;
    }

    if (!selectedDate) {
      setError('يرجى اختيار تاريخ');
      return;
    }

    if (!selectedSlot) {
      setError('يرجى اختيار وقت الموعد');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/appointments/create', {
        appointment_id: selectedSlot.appointment_id,
        patient_id: patientId.trim(),
        appointment_date: selectedDate
      });

      setMessage({ 
        type: 'success', 
        text: 'تم إنشاء الموعد بنجاح وانتظار موافقة المريض' 
      });

      // Reset form after short delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل في إنشاء الموعد. يرجى المحاولة مرة أخرى.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay">
      <div className="modern-modal-content" style={{ maxWidth: '900px', width: '95%' }}>
        <div className="modern-modal-header">
          <h2 className="modern-modal-title">
            إنشاء موعد جديد للمريض - {doctorName && <span className="text-brand ms-1">({doctorName})</span>}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modern-modal-body">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          {message.text && (
            <div className={`${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} p-3 rounded-lg mb-4 text-sm font-medium`}>
              {message.text}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-4 space-x-4 space-x-reverse">
            <div className={`flex items-center ${step === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${step === 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                1
              </span>
              <span className="mr-2 text-sm font-medium">بيانات المريض والتاريخ</span>
            </div>
            <div className="h-px flex-1 bg-gray-200 mx-2"></div>
            <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${step === 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                2
              </span>
              <span className="mr-2 text-sm font-medium">اختيار وقت الموعد</span>
            </div>
          </div>

          {step === 1 && (
            <>
              {/* Patient ID Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معرف المريض (User ID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل معرف المريض"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={saving}
                />
              </div>

              {/* Calendar Selection */}
              <div className="row">
                <div className="col-lg-12 mb-2">
                  <p className="text-sm text-gray-600 mb-2">
                    يرجى اختيار التاريخ المناسب من التقويم أولاً، ثم الانتقال للخطوة التالية لاختيار وقت الموعد.
                  </p>
                </div>
                <div className="col-lg-12">
                  {loading ? (
                    <Loading />
                  ) : (
                    <AppointmentCalendar
                      workingDays={workingDays}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      minDate={(() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Summary of selected patient and date */}
              <div className="mb-4 p-3 rounded-lg bg-blue-50 text-sm text-blue-700 flex flex-wrap justify-between items-center">
                <div className="mb-2 md:mb-0">
                  <span className="font-medium">معرف المريض:</span>{' '}
                  <span className="font-mono">{patientId}</span>
                </div>
                <div>
                  <span className="font-medium">تاريخ الموعد:</span>{' '}
                  <span>{selectedDate}</span>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="row">
                <div className="col-lg-12">
                  {selectedDate && doctorId && clinicId ? (
                    <TimeSlotSelector
                      doctorId={doctorPrivateId}
                      clinicId={clinicId}
                      selectedDate={selectedDate}
                      onSlotSelect={handleSlotSelect}
                      selectionOnly={true}
                    />
                  ) : (
                    <div className="time-slot-selector-card">
                      <div className="card-body text-center py-5">
                        <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                        <p className="text-muted">يرجى العودة للخطوة الأولى لاختيار التاريخ</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modern-modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>
            إلغاء
          </button>

          {step === 2 && (
            <button
              onClick={handleBackStep}
              className="btn-light me-2"
              disabled={saving}
            >
              رجوع
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={handleNextStep}
              className="btn-primary"
              disabled={
                saving ||
                loading ||
                !patientId.trim() ||
                !selectedDate ||
                workingDays.length === 0
              }
            >
              التالي
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn-primary" 
              disabled={saving || loading || !selectedSlot || !patientId.trim() || !selectedDate || workingDays.length === 0}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  إنشاء الموعد
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicCreateAppointmentModal;

