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
      const userData = getUserFromStorage();
      setUserInfo(userData);
      console.log("AuthContext initialized with user:", userData);
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

  // Method to check if user is logged in - only returns true if we have userInfo with _id
  const isLoggedIn = () => {
    const isLoggedInResult = !!(userInfo && userInfo._id);
    console.log("isLoggedIn check:", isLoggedInResult, "userInfo:", userInfo);
    return isLoggedInResult;
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