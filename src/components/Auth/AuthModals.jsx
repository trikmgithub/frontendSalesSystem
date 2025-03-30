// src/components/Auth/AuthModals.jsx
import React, { useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';
import LoginForm from '~/components/Header/LoginPopup';
import SignupForm from '~/components/Header/SignupPopup';
import OtpForm from '~/components/Header/OtpForm';

function AuthModals() {
  const { 
    showLoginModal, 
    showSignupModal, 
    showOtpModal,
    verifiedEmail,
    closeAllModals,
    openLogin,
    openSignup,
    handleLoginSuccess,
    handleOtpSuccess
  } = useAuth();

  // Debug logging - remove in production
  useEffect(() => {
    console.log('Auth Modal States:', { 
      showLoginModal, 
      showSignupModal, 
      showOtpModal,
      verifiedEmail 
    });
  }, [showLoginModal, showSignupModal, showOtpModal, verifiedEmail]);

  return (
    <>
      {showLoginModal && (
        <LoginForm
          onClose={closeAllModals}
          onShowSignup={openSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showOtpModal && (
        <OtpForm
          onClose={closeAllModals}
          onShowLogin={openLogin}
          onVerificationSuccess={handleOtpSuccess}
        />
      )}

      {showSignupModal && (
        <SignupForm
          onClose={closeAllModals}
          onShowLogin={openLogin}
          verifiedEmail={verifiedEmail}
        />
      )}
    </>
  );
}

export default AuthModals;