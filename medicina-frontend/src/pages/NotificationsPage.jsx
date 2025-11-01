import React from 'react';
import SideBar from '../components/SideBar';
import ToolBar from '../components/ToolBar';
import Notifications from '../components/Notifications/Notifications';

const NotificationsPage = () => {
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
      <main className="content-area">
        <Notifications />
      </main>
      {/* Mobile sidebar overlay */}
      <div className="mobile-sidebar-overlay" onClick={closeMobileSidebar}></div>
    </div>
  );
};

export default NotificationsPage;

