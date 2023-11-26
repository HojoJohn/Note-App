import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../Auth/AuthService';



const ProtectedRoute = () => {
  const isAuthenticated = AuthService.isAuthenticated(); // Checks if the user is authenticated

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
