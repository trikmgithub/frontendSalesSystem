// src/pages/Admin/AdminDashboard.jsx (Updated with Quiz Management tab)
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminDashboard.module.scss';
import { logoutAxios } from '~/services/authAxios';
import Dashboard from '~/components/ManagementTabs/Dashboard/Dashboard';
import ProductManagement from '~/components/ManagementTabs/ProductManagement/ProductManagement';
import UserManagement from '~/components/ManagementTabs/UserManagement/UserManagement';
import BrandManagement from '~/components/ManagementTabs/BrandManagement/BrandManagement';
import OrderManagement from '~/components/ManagementTabs/OrderManagement/OrderManagement';
import QuizManagement from '~/components/ManagementTabs/QuizManagement/QuizManagement';
import { 
  FaChartBar, 
  FaBox, 
  FaUsers, 
  FaTag, 
  FaShoppingCart,
  FaQuestion
} from 'react-icons/fa';

const cx = classNames.bind(styles);

function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Default to dashboard tab

  // Simplified logout handler - Uses logoutAxios which handles everything
  const handleLogout = async () => {
    try {
      await logoutAxios();
      // No need for additional code - logoutAxios handles everything
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Load user data on component mount
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
          className={cx('tabButton', { active: activeTab === 'dashboard' })}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartBar />
          <span>Dashboard</span>
        </button>
        
        <button
          className={cx('tabButton', { active: activeTab === 'users' })}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers />
          <span>User Management</span>
        </button>
        
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

        <button
          className={cx('tabButton', { active: activeTab === 'quiz' })}
          onClick={() => setActiveTab('quiz')}
        >
          <FaQuestion />
          <span>Quiz Management</span>
        </button>
      </div>

      <div className={cx('adminContent')}>
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        
        {/* Users Tab Content */}
        {activeTab === 'users' && <UserManagement />}
        
        {/* Orders Tab Content */}
        {activeTab === 'orders' && <OrderManagement />}
        
        {/* Products Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
        
        {/* Brands Tab Content */}
        {activeTab === 'brands' && <BrandManagement />}
        
        {/* Quiz Tab Content */}
        {activeTab === 'quiz' && <QuizManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;