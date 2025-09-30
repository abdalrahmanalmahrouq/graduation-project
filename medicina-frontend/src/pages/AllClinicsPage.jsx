import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import AllClinics from '../components/Clinics/AllClinics'

const AllClinicsPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav/>
      <AllClinics/>
    </div>
  );
};

export default AllClinicsPage
