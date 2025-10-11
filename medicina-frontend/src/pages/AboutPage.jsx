import React, { useEffect } from 'react'
import TopNav from '../components/TopNavigation/TopNav'
import AboutDetails from '../components/About/AboutDetails'
import Footer from '../components/Footer/Footer'
import TopPageDetails from '../components/TopPageDetails/TopPageDetails'

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div dir='rtl'>
      <TopNav />
      <TopPageDetails pageTitle="من نحن"/>
      <AboutDetails/>
      <Footer/>
    </div>
  );
};

export default AboutPage
