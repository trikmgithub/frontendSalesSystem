// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminDashboard.module.scss';
import { logoutAxios } from '~/services/authAxios';
import ProductManagement from '~/pages/ProductManagement/ProductManagement';
import UserManagement from '~/pages/UserManagement/UserManagement';
import { FaBox, FaUsers } from 'react-icons/fa';

const cx = classNames.bind(styles);

function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  // Simplified logout handler - Uses logoutAxios which handles everything
  const handleLogout = async () => {
    try {
      await logoutAxios();
      // No need for additional code - logoutAxios handles everything
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Load user data on component mount - NO REDIRECTION LOGIC
  useEffect(() => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');

    // Just set user data without any redirection
    if (userInfo && userInfo !== 'null') {
      setUserData(userInfo);
    }
  }, []);

  return (
    <div className={cx('adminContainer')}>
      <div className={cx('adminHeader')}>
        <h1 className={cx('adminTitle')}>Admin Dashboard</h1>
        {userData && (
          <div className={cx('userInfo')}>
            <span className={cx('userName')}>Welcome, {userData.name}</span>
            <span className={cx('userRole')}>{userData.role}</span>
            <button className={cx('logoutButton')} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className={cx('tabNavigation')}>
        <button
          className={cx('tabButton', { active: activeTab === 'products' })}
          onClick={() => setActiveTab('products')}
        >
          <FaBox />
          <span>Product Management</span>
        </button>
        
        <button
          className={cx('tabButton', { active: activeTab === 'users' })}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers />
          <span>User Management</span>
        </button>
      </div>

      <div className={cx('adminContent')}>
        {/* Products Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
        
        {/* Users Tab Content */}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;