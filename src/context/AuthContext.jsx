// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for showing login/signup modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a separate function to check localStorage and get user data
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser || storedUser === 'null') {
        return null;
      }
      
      const parsed = JSON.parse(storedUser);
      
      if (!parsed || !parsed._id) {
        return null;
      }
      
      return parsed;
    } catch (err) {
      console.error("Error getting user from storage:", err);
      return null;
    }
  };

  // Load user info from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      const userData = getUserFromStorage();
      setUserInfo(userData);
      setIsLoading(false);
    };

    loadUser();
    
    // Listen for storage changes (e.g. from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Method to open login modal
  const openLogin = (callback = null) => {
    if (callback) {
      setRedirectAfterLogin(() => callback);
    }
    setShowSignupModal(false);
    setShowOtpModal(false);
    setShowLoginModal(true);
  };

  // Method to open signup modal
  const openSignup = () => {
    setShowLoginModal(false);
    setShowOtpModal(true); // We start with OTP verification before signup
  };

  // Method to close all modals
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowOtpModal(false);
    // Reset verified email when closing all modals to avoid stale data
    setVerifiedEmail('');
  };

  // Method to handle successful login
  const handleLoginSuccess = () => {
    closeAllModals();
    
    // Get fresh user data from localStorage
    const userData = getUserFromStorage();
    setUserInfo(userData);
    
    // Execute callback if exists
    if (redirectAfterLogin) {
      redirectAfterLogin();
      setRedirectAfterLogin(null);
    }
  };

  // Method to handle OTP verification success
  const handleOtpSuccess = (email) => {
    // First set the verified email
    setVerifiedEmail(email);
    
    // Then close OTP modal
    setShowOtpModal(false);
    
    // Important: add a small delay before opening signup modal to ensure proper UI transition
    setTimeout(() => {
      // Finally show signup modal
      setShowSignupModal(true);
      console.log('Opening signup modal with verified email:', email);
    }, 100);
  };

  // Method to check if user is logged in
  const isLoggedIn = () => {
    // If we're still loading, don't make a decision yet
    if (isLoading) {
      return false;
    }
    
    try {
      // First check the context state
      if (userInfo && userInfo._id) {
        return true;
      }
      
      // If not in context state, check localStorage directly as a fallback
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const isValid = !!(user && user._id);
      
      // If we found a valid user in localStorage but not in context, update context
      if (isValid && !userInfo) {
        setUserInfo(user);
      }
      
      return isValid;
    } catch (err) {
      console.error("Error in isLoggedIn check:", err);
      return false;
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.setItem('user', 'null');
    setUserInfo(null);
    
    // Set cart and favorites to null string
    localStorage.setItem('cartItems', 'null');
    localStorage.setItem('favoriteItems', 'null');
    
    // Redirect to homepage
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      showLoginModal,
      showSignupModal,
      showOtpModal,
      verifiedEmail,
      userInfo,
      isLoading,
      openLogin,
      openSignup,
      closeAllModals,
      handleLoginSuccess,
      handleOtpSuccess,
      isLoggedIn,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};