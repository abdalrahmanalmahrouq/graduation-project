import React, { useState, useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const AppointmentCalendar = ({ workingDays, selectedDate, onDateSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Arabic day names
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Convert English day names to Arabic
  const dayNameMap = {
    'sunday': 'الأحد',
    'monday': 'الإثنين',
    'tuesday': 'الثلاثاء',
    'wednesday': 'الأربعاء',
    'thursday': 'الخميس',
    'friday': 'الجمعة',
    'saturday': 'السبت'
  };

  // Get working day numbers (0 = Sunday, 6 = Saturday)
  const workingDayNumbers = useMemo(() => {
    const dayMap = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    
    if (!workingDays || workingDays.length === 0) {
     
      return [];
    }
    
    const numbers = workingDays.map(day => {
      const dayLower = day.toLowerCase();
      return dayMap[dayLower];
    }).filter(d => d !== undefined);
    
  
    return numbers;
  }, [workingDays]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDateObj = minDate ? new Date(minDate) : today;

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Start from Sunday (0) of the week containing the first day
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      // Use local date formatting to avoid timezone issues
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dateObj = new Date(current);
      dateObj.setHours(0, 0, 0, 0);
      
      const isPast = dateObj < minDateObj;
      const isCurrentMonth = current.getMonth() === currentMonth.getMonth() && current.getFullYear() === currentMonth.getFullYear();
      const dayOfWeekNum = current.getDay();
      const isWorkingDay = workingDayNumbers.length > 0 ? workingDayNumbers.includes(dayOfWeekNum) : false;
      // Only make selectable if it's a working day, not past, and in current month
      const isSelectable = !isPast && isWorkingDay && isCurrentMonth;
      const isSelected = selectedDate === dateStr;

      days.push({
        date: dateStr,
        day: current.getDate(),
        isCurrentMonth,
        isPast,
        isWorkingDay,
        isSelectable,
        isSelected,
        dateObj
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth, workingDayNumbers, selectedDate, minDateObj]);

  const handleDateClick = (day) => {
    if (day.isSelectable && day.isWorkingDay) {
      onDateSelect(day.date);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <Card className="appointment-calendar-card mb-4">
      <Card.Body>
        {/* Calendar Header */}
        <div className="calendar-header mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-sm btn-outline-secondary calendar-nav-btn"
              onClick={goToPreviousMonth}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <h4 className="calendar-month-title mb-0">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              className="btn btn-sm btn-outline-secondary calendar-nav-btn"
              onClick={goToNextMonth}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>

        {/* Day Names Header */}
        <Row className="calendar-days-header mb-2">
          {dayNames.map((dayName, index) => (
            <Col key={index} className="text-center p-2">
              <strong className="text-muted">{dayName}</strong>
            </Col>
          ))}
        </Row>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${
                !day.isCurrentMonth ? 'other-month' : ''
              } ${day.isPast ? 'past-day' : ''} ${
                day.isSelectable ? 'selectable' : 'disabled'
              } ${day.isSelected ? 'selected' : ''} ${
                day.isWorkingDay ? 'working-day' : 'non-working-day'
              }`}
              onClick={() => handleDateClick(day)}
              title={day.isSelectable ? 'انقر للاختيار' : day.isPast ? 'تاريخ سابق' : 'غير متاح'}
            >
              <span className="calendar-day-number">{day.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="calendar-legend mt-3 d-flex justify-content-center flex-wrap gap-3">
          <div className="legend-item">
            <span className="legend-color working-day"></span>
            <span className="legend-text">أيام العمل</span>
          </div>
          <div className="legend-item">
            <span className="legend-color disabled"></span>
            <span className="legend-text">غير متاح</span>
          </div>
          <div className="legend-item">
            <span className="legend-color selected"></span>
            <span className="legend-text">محدد</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCalendar;

