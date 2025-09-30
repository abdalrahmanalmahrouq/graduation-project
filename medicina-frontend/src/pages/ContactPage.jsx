import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import ContactHome from '../components/Contact/ContactHome'
import Footer from '../components/Footer/Footer'
import TopPageDetails from '../components/TopPageDetails/TopPageDetails';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div>
      <TopNav />
      <TopPageDetails pageTitle="تواصل معنا"/>
      <ContactHome/>
      <Footer/>
    </div>
  );
};

export default ContactPage
