import React, { useState, useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import AppointmentsSchedule from '../components/Clinics/AppointmentsSchedule'
import Footer from '../components/Footer/Footer'
import Sidebar from '../components/SideBar';
import ToolBar from '../components/ToolBar';

const AppointmentsSchedulePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0);
    const user = localStorage.getItem('token');
    if(user){
      setIsLoggedIn(true);
    }
  }, []);

  const loggedInLayout = (
    <div className='app-container' dir='rtl'>
      <Sidebar className='sidebar' />
      <ToolBar className='toolbar' />
      <main className='content-area authenticated-doctor-profile'>
        <AppointmentsSchedule/>
      </main>
    </div>
  );

  const guestLayout = (
    <div className='topnav-without-background' dir='rtl'>
      <TopNav/>
      <div className="guest-doctor-profile">
      <AppointmentsSchedule/>
      </div>
      <Footer/>
    </div>
  );

  return (
    <>
      {isLoggedIn ? loggedInLayout : guestLayout}
    </>
  );
};

export default AppointmentsSchedulePage