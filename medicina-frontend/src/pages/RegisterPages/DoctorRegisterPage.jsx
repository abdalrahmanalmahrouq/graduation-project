import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import DoctorRegister from '../../components/Register/DoctorRegister'

const DoctorRegisterPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <DoctorRegister/>
    </div>
  );
};

export default DoctorRegisterPage