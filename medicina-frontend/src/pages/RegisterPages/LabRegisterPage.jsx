import React, { useEffect } from 'react'
import TopNav from '../../components/TopNavigation/TopNav'
import LabRegister from '../../components/Register/LabRegister'

const LabRegisterPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <LabRegister/>
    </div>
  );
};

export default LabRegisterPage