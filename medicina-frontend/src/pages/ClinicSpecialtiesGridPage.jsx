import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import ClinicSpecialtiesGrid from '../components/Clinics/ClinicSpecialtiesGrid'
import Footer from '../components/Footer/Footer'
import TopPageDetails from '../components/TopPageDetails/TopPageDetails'

const ClinicSpecialtiesGridPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav />
      <TopPageDetails pageTitle="التخصصات"/>
      <ClinicSpecialtiesGrid/>
      <Footer/>
    </div>
  );
};

export default ClinicSpecialtiesGridPage
