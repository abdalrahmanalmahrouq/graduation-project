import React from 'react'; 
import { useParams, Navigate } from 'react-router-dom'; 
import UserAccountPage from '../pages/AccountPages/UserAccountPage';

const RoleAccountRoute = () => { 
  const { role: roleParam } = useParams(); 
  const raw = localStorage.getItem('user'); 
  const user = raw ? JSON.parse(raw) : null; 

  // not logged in, redirect to the login page for the role in the URL
  if (!user) return <Navigate to={`/login/${roleParam}`} replace />; 

  // the logged in user's role doesn't match the :role param -> unauthorized
  if (user.role !== roleParam) { 
    return <Navigate to="/unauthorized" replace />; 
  }

  // render the account page
  return <UserAccountPage />; 
};

export default RoleAccountRoute; 
