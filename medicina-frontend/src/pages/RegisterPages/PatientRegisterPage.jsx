import React, { useEffect } from 'react'
import PatientRegister from '../../components/Register/PatientRegister'
import TopNav from '../../components/TopNavigation/TopNav'

const PatientRegisterPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav />
      <PatientRegister/>
      {/* <Footer/> */}
    </div>
  );
};

export default PatientRegisterPage