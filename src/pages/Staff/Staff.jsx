// src/pages/Staff/Staff.jsx
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Staff.module.scss';
import { logoutAxios } from '~/services/authAxios';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '~/pages/ProductManagement/ProductManagement';
import OrderManagement from '~/pages/OrderManagement/OrderManagement';

const cx = classNames.bind(styles);

function StaffPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  const handleLogout = async () => {
    try {
      await logoutAxios();
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // Check user role on component mount
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');

    if (!userInfo || userInfo === 'null') {
      navigate('/');
      return;
    }

    if (!['STAFF', 'MANAGER', 'ADMIN'].includes(userInfo.role)) {
      navigate('/');
      return;
    }

    setUserData(userInfo);
  }, [navigate]);

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
          <span>Order Management</span>
        </button>
        <button
          className={cx('tabButton', { active: activeTab === 'products' })}
          onClick={() => setActiveTab('products')}
        >
          <span>Product Management</span>
        </button>
      </div>

      <div className={cx('adminContent')}>
        {/* Orders Tab Content */}
        {activeTab === 'orders' && <OrderManagement />}

        {/* Products Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
      </div>
    </div>
  );
}

export default StaffPage;