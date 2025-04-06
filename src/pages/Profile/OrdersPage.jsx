// src/pages/Profile/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './styles/ProfileShared.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import OrderList from './components/OrderList/OrderList';
import Toast from './components/common/Toast/Toast';
import { getUserOrdersAxios } from '~/services/cartAxios';

const cx = classNames.bind(styles);

const OrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatar: null
  });

  // Load user data from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserData({
          fullName: user.name || '',
          email: user.email || '',
          userId: user._id || '',
          avatar: user.avatar || null
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Fetch user orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userData._id) {
          throw new Error('User ID not found');
        }
        
        const response = await getUserOrdersAxios(userData._id);
        
        if (response.error) {
          throw new Error(response.message || 'Failed to load order data');
        }
        
        if (response && response.data) {
          // Add validation to ensure expected structure
          const validatedOrders = validateOrderData(response.data);
          setOrders(validatedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to load order data. Please try again.');
        showToast('Không thể tải đơn hàng, vui lòng thử lại sau', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Safely parse order data to prevent rendering errors
  const validateOrderData = (orders) => {
    // Check if orders is an array
    if (!Array.isArray(orders)) {
      console.error('Orders is not an array:', orders);
      return [];
    }
    
    // Process each order to ensure it has the expected structure
    return orders.map(order => {
      // Ensure items is an array
      const items = Array.isArray(order.items) ? order.items.map(item => {
        // Extract item details safely
        return {
          _id: item._id || '',
          itemId: item.itemId,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        };
      }) : [];
      
      return {
        ...order,
        items,
        purchaseDate: order.purchaseDate || new Date().toISOString(),
        totalAmount: Number(order.totalAmount) || 0,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod || 'cod'
      };
    });
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Close toast notification
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
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
        <div className={cx('card')}>
          <div className={cx('cardHeader')}>
            <h2>Đơn hàng của tôi</h2>
          </div>
          
          <div className={cx('cardBody')}>
            <OrderList 
              orders={orders}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;