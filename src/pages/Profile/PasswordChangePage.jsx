// src/pages/Profile/PasswordChangePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './styles/ProfileShared.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import PasswordChange from './components/PasswordChange/PasswordChange';
import Toast from './components/common/Toast/Toast';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const PasswordChangePage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatar: null
  });

  // Load user data from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.email) {
        setEmail(user.email);
        setUserData({
          fullName: user.name || '',
          email: user.email,
          avatar: user.avatar || null
        });
      } else {
        // If we couldn't get the email from the user object in localStorage,
        // extract it from the token as a fallback
        try {
          const token = localStorage.getItem('access_token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload.email) {
              setEmail(payload.email);
            }
          }
        } catch (error) {
          console.error('Error extracting email from token:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Show success toast
  const handleSuccess = (message) => {
    setToast({ show: true, message, type: 'success' });
  };

  // Show error toast
  const handleError = (message) => {
    setToast({ show: true, message, type: 'error' });
  };

  // Close toast
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate(routes.profile);
  };

  return (
    <div className={cx('pageContainer')}>
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        selectedTab={selectedTab} 
        userInfo={userData} 
      />
      
      {/* Main Content */}
      <div className={cx('mainContent')}>
        <PasswordChange 
          email={email} 
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default PasswordChangePage;