import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import ClinicRegister from '../../components/Register/ClinicRegister'

const ClinicRegisterPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <ClinicRegister/>
    </div>
  );
};

export default ClinicRegisterPage