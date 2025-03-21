import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';

/**
 * AuthGuard component for handling route protection and role-based redirection
 * Implements strict route protection according to user roles
 */
const AuthGuard = ({ children, requireStaff = false, requireAdmin = false, requireUser = false }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = userInfo && userInfo !== 'null';
    
    // Separate roles instead of grouping them
    const isStaff = isLoggedIn && userInfo.role === 'STAFF';
    const isAdmin = isLoggedIn && ['ADMIN', 'MANAGER'].includes(userInfo.role);
    
    console.log("AuthGuard checking path:", window.location.pathname);
    console.log("User role:", userInfo?.role);
    console.log("requireAdmin:", requireAdmin, "requireStaff:", requireStaff);
    
    // STRICT ROUTE PROTECTION
    
    // 1. Admin route protection: only ADMIN/MANAGER can access
    if (requireAdmin) {
      if (!isAdmin) {
        console.log("AUTH GUARD: Non-admin attempting to access admin page");
        navigate(routes.home);
        return;
      }
      // Admin users stay on admin pages
      return;
    }
    
    // 2. Staff route protection: only STAFF can access
    if (requireStaff) {
      if (!isStaff) {
        console.log("AUTH GUARD: Non-staff attempting to access staff page");
        navigate(routes.home);
        return;
      }
      // Staff users stay on staff pages
      return;
    }
    
    // 3. Home page redirection for logged-in users
    if (window.location.pathname === '/') {
      if (isAdmin) {
        console.log("AUTH GUARD: Admin on homepage, redirecting to admin dashboard");
        navigate(routes.admin);
        return;
      } else if (isStaff) {
        console.log("AUTH GUARD: Staff on homepage, redirecting to staff dashboard");
        navigate(routes.staff);
        return;
      }
      // Regular users stay on homepage
    }
    
    // 4. If user auth is required but not logged in, redirect to home
    if (requireUser && !isLoggedIn) {
      navigate(routes.home);
      return;
    }
    
  }, [navigate, requireStaff, requireAdmin, requireUser]);
  
  return children;
};

export default AuthGuard;