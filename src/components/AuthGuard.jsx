import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';

/**
 * AuthGuard component for handling route protection and role-based redirection
 * Wrap your route components with this to enforce authentication rules
 */
const AuthGuard = ({ children, requireStaff = false, requireUser = false }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = userInfo && userInfo !== 'null';
    const isStaff = isLoggedIn && userInfo.role && ['STAFF', 'MANAGER', 'ADMIN'].includes(userInfo.role);
    
    // If staff is required but user is not staff, redirect to home
    if (requireStaff && !isStaff) {
      navigate(routes.home);
      return;
    }
    
    // If staff user accesses any non-staff route, redirect to staff page
    if (isStaff && !requireStaff) {
      navigate(routes.staff);
      return;
    }
    
    // If user auth is required but not logged in, redirect to home
    if (requireUser && !isLoggedIn) {
      navigate(routes.home);
      return;
    }
    
  }, [navigate, requireStaff, requireUser]);
  
  return children;
};

export default AuthGuard;