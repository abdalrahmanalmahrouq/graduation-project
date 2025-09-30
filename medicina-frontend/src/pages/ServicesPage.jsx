import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import Services from '../components/Services/Services'
import Footer from '../components/Footer/Footer'
import TopPageDetails from '../components/TopPageDetails/TopPageDetails';

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav />
      <TopPageDetails pageTitle="خدماتنا"/>
      <Services/>
      <Footer/>
    </div>
  );
};

export default ServicesPage
