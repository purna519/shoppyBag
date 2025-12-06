import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode JWT to get user role
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    if (role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute;
