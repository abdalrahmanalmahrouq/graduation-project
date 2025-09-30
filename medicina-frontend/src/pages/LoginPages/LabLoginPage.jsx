import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import LabLogin from '../../components/Login/LabLogin'

const LabLoginPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <LabLogin/>
    </div>
  );
};

export default LabLoginPage