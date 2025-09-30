import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  const token = localStorage.getItem('token');
  const role = user?.role || 'guest';

  // If not logged and route doesn't allow guest -> go to login
  if (!user && !allowedRoles.includes('guest')) {
    // If token exists but user not stored yet you may show a loading indicator
    if (token && !user) return <p>Loading user...</p>;
    return <Navigate to="/" replace />;
  }

  // If role not allowed -> unauthorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // allowed
  return children;
};

export default ProtectedRoute;
