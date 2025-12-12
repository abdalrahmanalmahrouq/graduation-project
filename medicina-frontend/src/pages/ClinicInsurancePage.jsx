import React from 'react';
import SideBar from '../components/SideBar';
import ToolBar from '../components/ToolBar';
import ClinicInsuranceManagement from '../components/Clinics/ClinicInsuranceManagement/ClinicInsuranceManagement';

const ClinicInsurancePage = () => {
  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    if (sidebar && overlay) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }
  };

  return (
    <div className="app-container" dir='rtl'>
      <SideBar className='sidebar' />
      <ToolBar className='toolbar'/>
      <div className="content-area" style={{ padding: '4rem' }}>
        <ClinicInsuranceManagement />
      </div>
      {/* Mobile sidebar overlay */}
      <div className="mobile-sidebar-overlay" onClick={closeMobileSidebar}></div>
    </div>
  );
};

export default ClinicInsurancePage;
