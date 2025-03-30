// src/components/AuthGuard.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';

function AuthGuard({ children, requireAdmin = false, requireStaff = false }) {
  const { userInfo, isLoggedIn } = useAuth();
  const location = useLocation();
  
  // Check if user is logged in and has required role
  useEffect(() => {
    // If this is a protected route that requires admin or staff, check if the user has the required role
    if (requireAdmin || requireStaff) {
      if (!isLoggedIn()) {
        toast.error('Bạn cần đăng nhập để truy cập trang này', {
          position: 'top-center'
        });
      } else if (requireAdmin && userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER') {
        toast.error('Bạn không có quyền truy cập trang này', {
          position: 'top-center'
        });
      } else if (requireStaff && userInfo?.role !== 'STAFF' && userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER') {
        toast.error('Bạn không có quyền truy cập trang này', {
          position: 'top-center'
        });
      }
    }
  }, [isLoggedIn, userInfo, requireAdmin, requireStaff]);

  // If admin route and not admin, redirect to home page
  if (requireAdmin && (!isLoggedIn() || (userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER'))) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If staff route and not staff, redirect to home page
  if (requireStaff && (!isLoggedIn() || (userInfo?.role !== 'STAFF' && userInfo?.role !== 'ADMIN' && userInfo?.role !== 'MANAGER'))) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default AuthGuard;