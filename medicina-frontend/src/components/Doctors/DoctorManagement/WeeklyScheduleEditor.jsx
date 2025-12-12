import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../Loading';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { 
  saturday: 'السبت', sunday: 'الأحد', monday: 'الاثنين', tuesday: 'الثلاثاء', 
  wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة' 
};

const WeeklyScheduleEditor = ({ doctorId }) => {
  // Initialize with all days as null so the UI knows what to render immediately
const [schedule, setSchedule] = useState(
  DAYS.reduce((acc, day) => ({ ...acc, [day]: null }), {})
);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`/clinics/doctors/${doctorId}/schedule`);
        
        // 1. Get the raw data
        let incomingSchedule = response.data.schedule;

        // 2. DEBUG: Log it to see exactly what we are getting
        console.log("Raw API Schedule:", incomingSchedule);
        console.log("Type of Schedule:", typeof incomingSchedule);

        // 3. FIX: Parse it if it is a string
        if (typeof incomingSchedule === 'string') {
            try {
                incomingSchedule = JSON.parse(incomingSchedule);
            } catch (e) {
                console.error("Error parsing schedule JSON:", e);
                incomingSchedule = {};
            }
        }

        // 4. Default to empty object if null
        const safeSchedule = incomingSchedule || {};

        // 5. Map to our DAYS array
        const initialSchedule = DAYS.reduce((acc, day) => ({ 
            ...acc, 
            // Check for exact key match, also try lowercase just in case
            [day]: safeSchedule[day] || safeSchedule[day.toLowerCase()] || null 
        }), {});

        setSchedule(initialSchedule);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchSchedule();
    }
  }, [doctorId]);

 

  return (
    <div className="schedule-viewer-card">
      <div className="schedule-grid-header">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          جدول العمل الأسبوعي
        </h2>
        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
            عرض فقط
        </span>
      </div>

      <div className="schedule-grid">
        
        {loading ? (
          <Loading/>
        ): (
          <>
          {DAYS.map(day => {
          const dayData = schedule[day];
          const isWorking = dayData !== null;

          return (
            <div key={day} className={`grid-day-column ${isWorking ? 'active' : ''}`}>
              <div className="grid-day-header">
                {DAY_LABELS[day]}
              </div>
              
              <div className="grid-day-body">
                {isWorking ? (
                  <>
                    <div className="time-slot">
                      {dayData.start_time} - {dayData.end_time}
                    </div>
                    {(dayData.break_start && dayData.break_end) && (
                      <div className="break-slot">
                        استراحة: {dayData.break_start} - {dayData.break_end}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400 font-medium text-sm">عطلة</div>
                )}
              </div>
            </div>
          );
        })}
          </>
        )}
        
      </div>
    </div>
  );
};

export default WeeklyScheduleEditor;