import React from 'react';

const AppointmentTable = () => {
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      day: 'Sunday',
      date: '01/13/2025',
      startTime: '9:00PM',
      endTime: '9:45PM',
      status: 'available'
    },
    {
      id: 2,
      day: 'Sunday',
      date: '01/13/2025',
      startTime: '10:00PM',
      endTime: '10:45PM',
      status: 'available'
    },
    {
      id: 3,
      day: 'Sunday',
      date: '01/13/2025',
      startTime: '11:00PM',
      endTime: '11:45PM',
      status: 'booked'
    }
  ];

  return (
    <div className="appointment-container" dir='ltr'>
      <div className="appointment-header">
        <h2 className="appointment-title font-brand ">
          <span >جدول الطبيب</span></h2>
      </div>
      
      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr className="appointment-table-header-row">
              <th className="appointment-table-header">Day</th>
              <th className="appointment-table-header">Date</th>
              <th className="appointment-table-header">Start Time</th>
              <th className="appointment-table-header">End Time</th>
              <th className="appointment-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="appointment-table-row">
                <td className="appointment-table-cell">{appointment.day}</td>
                <td className="appointment-table-cell">{appointment.date}</td>
                <td className="appointment-table-cell">{appointment.startTime}</td>
                <td className="appointment-table-cell">{appointment.endTime}</td>
                <td className="appointment-table-cell">
                  {appointment.status === 'available' ? (
                    <button className="appointment-book-button">
                      حجز
                    </button>
                  ) : (
                    <button className="appointment-unavailable-button">
                      غير متوفر
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
