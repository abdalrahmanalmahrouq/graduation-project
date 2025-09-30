import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import ClinicLogin from '../../components/Login/ClinicLogin'

const ClinicLoginPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <ClinicLogin/>
    </div>
  );
};

export default ClinicLoginPage