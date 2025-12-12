import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import SpecialtyDoctorsList from '../components/Doctors/SpecialtyDoctorsList'

const SpecialtyDoctorsListPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <SpecialtyDoctorsList/>
    </div>
  );
};

export default SpecialtyDoctorsListPage
