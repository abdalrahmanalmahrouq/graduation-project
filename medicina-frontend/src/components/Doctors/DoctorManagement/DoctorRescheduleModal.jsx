import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../Loading';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { 
  saturday: 'السبت', 
  sunday: 'الأحد', 
  monday: 'الاثنين', 
  tuesday: 'الثلاثاء', 
  wednesday: 'الأربعاء', 
  thursday: 'الخميس', 
  friday: 'الجمعة' 
};

const DoctorRescheduleModal = ({ isOpen, onClose, publicDoctorId, privateDoctorId, doctorName, onSuccess }) => {
  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: null }), {})
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    if (!isOpen || !publicDoctorId) return;

    const fetchSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/clinics/doctors/${publicDoctorId}/schedule`);
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
        const initialSchedule = DAYS.reduce(
          (acc, day) => ({
            ...acc,
            [day]: normalizeDay(safeSchedule[day] || safeSchedule[day?.toLowerCase()] || null),
          }),
          {}
        );
        setSchedule(initialSchedule);
      } catch (err) {
        console.error('Error fetching doctor schedule:', err);
        setError('حدث خطأ أثناء تحميل جدول الطبيب.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [isOpen, publicDoctorId]);

  const handleDayToggle = (day) => {
    setSchedule((prev) => {
      if (prev[day]) return { ...prev, [day]: null };
      return {
        ...prev,
        [day]: {
          start_time: '09:00',
          end_time: '17:00',
          break_start: '13:00',
          break_end: '14:00',
        },
      };
    });
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.post('/clinics/re-schedule-doctor-weekly-schedule', {
        doctor_id: privateDoctorId,
        weekly_schedule: schedule,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error rescheduling weekly schedule:', err);
      setError('فشل في تحديث جدول الطبيب. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay">
      <div className="modern-modal-content">
        <div className="modern-modal-header">
          <h2 className="modern-modal-title">
            تعديل الجدول الأسبوعي للطبيب {doctorName && <span className="text-brand ms-1">({doctorName})</span>}
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

          {loading ? (
            <div className="py-6 flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="schedule-container">
              <p className="text-sm text-gray-600 mb-3">
                قم بتفعيل الأيام التي يعمل بها الطبيب وتحديث ساعات العمل والاستراحة.
              </p>

              {DAYS.map((day) => {
                const isWorking = schedule[day] !== null;
                const dayData = schedule[day] || {};

                return (
                  <div key={day} className={`day-row ${isWorking ? 'active' : ''}`}>
                    <div className="day-header">
                      <div className="day-label">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            checked={isWorking}
                            onChange={() => handleDayToggle(day)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span>{DAY_LABELS[day]}</span>
                      </div>
                      <span className={`text-sm ${isWorking ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isWorking ? 'يعمل' : 'عطلة'}
                      </span>
                    </div>

                    {isWorking && (
                      <div className="time-inputs-grid">
                        <div className="time-field">
                          <label className="time-label">بداية الدوام</label>
                          <input
                            type="time"
                            className="time-input"
                            value={dayData.start_time || ''}
                            onChange={(e) => handleTimeChange(day, 'start_time', e.target.value)}
                          />
                        </div>
                        <div className="time-field">
                          <label className="time-label">نهاية الدوام</label>
                          <input
                            type="time"
                            className="time-input"
                            value={dayData.end_time || ''}
                            onChange={(e) => handleTimeChange(day, 'end_time', e.target.value)}
                          />
                        </div>
                        <div className="time-field">
                          <label className="time-label">بداية الاستراحة</label>
                          <input
                            type="time"
                            className="time-input"
                            value={dayData.break_start || ''}
                            onChange={(e) => handleTimeChange(day, 'break_start', e.target.value)}
                          />
                        </div>
                        <div className="time-field">
                          <label className="time-label">نهاية الاستراحة</label>
                          <input
                            type="time"
                            className="time-input"
                            value={dayData.break_end || ''}
                            onChange={(e) => handleTimeChange(day, 'break_end', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modern-modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>
            إلغاء
          </button>
          <button onClick={handleSubmit} className="btn-primary" disabled={saving || loading}>
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRescheduleModal;



