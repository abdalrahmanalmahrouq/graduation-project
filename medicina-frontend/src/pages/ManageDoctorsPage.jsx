import React from 'react'
import Sidebar from '../components/SideBar'
import ToolBar from '../components/ToolBar'
import DoctorList from '../components/DoctorCard'

export default function ManageDoctorsPage() {
 
  return (
    <div className="app-container" dir='rtl'>
      <Sidebar className='sidebar'/>
      <ToolBar className='toolbar'/>
      <main  className='content-area'>
        <DoctorList/>
      </main>
    </div>
  )
}
