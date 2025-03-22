// src/pages/Staff/Staff.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Staff.module.scss';
import { logoutAxios } from '~/services/authAxios';
import ProductManagement from '~/layouts/ManagementTabs/ProductManagement/ProductManagement';
import OrderManagement from '~/layouts/ManagementTabs/OrderManagement/OrderManagement';
import BrandManagement from '~/layouts/ManagementTabs/BrandManagement/BrandManagement'; // Add this import
import { FaBox, FaShoppingCart, FaTag } from 'react-icons/fa'; // Add icons for better visual cues

const cx = classNames.bind(styles);

function StaffPage() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', or 'brands'

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
        <h1 className={cx('adminTitle')}>Staff Dashboard</h1>
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
          className={cx('tabButton', { active: activeTab === 'orders' })}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingCart />
          <span>Order Management</span>
        </button>
        <button
          className={cx('tabButton', { active: activeTab === 'products' })}
          onClick={() => setActiveTab('products')}
        >
          <FaBox />
          <span>Product Management</span>
        </button>
        <button
          className={cx('tabButton', { active: activeTab === 'brands' })}
          onClick={() => setActiveTab('brands')}
        >
          <FaTag />
          <span>Brand Management</span>
        </button>
      </div>

      <div className={cx('adminContent')}>
        {/* Orders Tab Content */}
        {activeTab === 'orders' && <OrderManagement />}

        {/* Products Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
        
        {/* Brands Tab Content */}
        {activeTab === 'brands' && <BrandManagement />}
      </div>
    </div>
  );
}

export default StaffPage;