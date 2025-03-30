// src/components/Auth/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, openLogin } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // If not logged in, show a toast notification
    if (!isLoggedIn()) {
      toast.error('Vui lòng đăng nhập để tiếp tục', {
        position: 'top-center',
        autoClose: 3000,
      });
      
      // Show login popup
      openLogin(() => {
        // This will run after successful login
        toast.success('Đăng nhập thành công!', {
          position: 'top-center',
          autoClose: 2000,
        });
      });
    }
  }, [isLoggedIn, openLogin]);

  // If not logged in, redirect to home page
  if (!isLoggedIn()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the protected component if user is logged in
  return children;
};

export default ProtectedRoute;