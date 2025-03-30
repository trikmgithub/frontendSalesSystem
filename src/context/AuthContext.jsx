// src/context/AuthContext.jsx - FIXED VERSION
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
      console.log("Raw user from storage:", storedUser);
      
      if (!storedUser || storedUser === 'null') {
        console.log("No valid user in storage");
        return null;
      }
      
      const parsed = JSON.parse(storedUser);
      console.log("Parsed user:", parsed);
      
      if (!parsed || !parsed._id) {
        console.log("Invalid user data", parsed);
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
      console.log("AuthContext initialized with user:", userData);
      setIsLoading(false);
    };

    loadUser();
    
    // Listen for storage changes (e.g. from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log("Storage 'user' changed to:", e.newValue);
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
  };

  // Method to handle successful login
  const handleLoginSuccess = () => {
    closeAllModals();
    
    // Get fresh user data from localStorage
    const userData = getUserFromStorage();
    console.log("Login successful, updating user to:", userData);
    setUserInfo(userData);
    
    // Execute callback if exists
    if (redirectAfterLogin) {
      console.log("Executing post-login callback");
      redirectAfterLogin();
      setRedirectAfterLogin(null);
    }
  };

  // Method to handle OTP verification success
  const handleOtpSuccess = (email) => {
    setVerifiedEmail(email);
    setShowOtpModal(false);
    setShowSignupModal(true);
  };

  // Method to check if user is logged in - IMPROVED to be more robust
  const isLoggedIn = () => {
    // If we're still loading, don't make a decision yet
    if (isLoading) {
      console.log("isLoggedIn check: still loading user data");
      return false;
    }
    
    try {
      // First check the context state
      if (userInfo && userInfo._id) {
        console.log("isLoggedIn check: true (from context state)");
        return true;
      }
      
      // If not in context state, check localStorage directly as a fallback
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const isValid = !!(user && user._id);
      console.log("isLoggedIn fallback check:", isValid, "user from localStorage:", user);
      
      // If we found a valid user in localStorage but not in context, update context
      if (isValid && !userInfo) {
        console.log("Found valid user in localStorage but not in context, updating context");
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
    console.log("Logging out");
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