import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import PatientLogin from '../../components/Login/PatientLogin'

const PatientLoginPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav />
      <PatientLogin />
    </div>
  );
};

export default PatientLoginPage