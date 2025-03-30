// src/components/Auth/AuthModals.jsx
import React from 'react';
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