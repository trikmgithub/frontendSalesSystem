// src/components/Auth/AuthGuard.jsx - FIXED VERSION
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';

function AuthGuard({ children, requireAdmin = false, requireStaff = false }) {
  const { userInfo, isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Check if user is logged in and has required role
  useEffect(() => {
    // Wait until auth state is loaded
    if (isLoading) {
      return;
    }
    
    let isAuthorized = true;
    
    // If this is a protected route that requires admin or staff, check if the user has the required role
    if (requireAdmin || requireStaff) {
      if (!isLoggedIn()) {
        toast.error('Bạn cần đăng nhập để truy cập trang này', {
          position: 'top-center'
        });
        isAuthorized = false;
      } else if (requireAdmin && userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER') {
        toast.error('Bạn không có quyền truy cập trang này', {
          position: 'top-center'
        });
        isAuthorized = false;
      } else if (requireStaff && userInfo?.role !== 'STAFF' && userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER') {
        toast.error('Bạn không có quyền truy cập trang này', {
          position: 'top-center'
        });
        isAuthorized = false;
      }
    }
    
    setAuthorized(isAuthorized);
    setChecking(false);
    
  }, [isLoading, isLoggedIn, userInfo, requireAdmin, requireStaff]);

  // If still checking authorization, show nothing or a loading indicator
  if (isLoading || checking) {
    // You could return a loading spinner here if you want
    return null;
  }

  // If not authorized, redirect to home page
  if (!authorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default AuthGuard;