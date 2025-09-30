import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import DoctorLogin from '../../components/Login/DoctorLogin'

const DoctorLoginPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <DoctorLogin/>
    </div>
  );
};

export default DoctorLoginPage