// src/pages/Profile/Favorites.jsx
import React, { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './styles/ProfileShared.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import FavoritesList from './components/FavoritesList/FavoritesList';
import Toast from './components/common/Toast/Toast';
import { FavoritesContext } from '~/context/FavoritesContext';
import { CartContext } from '~/context/CartContext';

const cx = classNames.bind(styles);

const Favorites = () => {
  const { favoriteItems, removeFromFavorites } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);
  const [selectedTab, setSelectedTab] = useState('favorites');
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
          avatar: user.avatar || null
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);
  
  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };
  
  // Close toast notification
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };
  
  // Handle add to cart
  const handleAddToCart = (item) => {
    addToCart(item);
    showToast(`Đã thêm "${item.name}" vào giỏ hàng`, 'success');
  };
  
  // Handle remove from favorites
  const handleRemoveFromFavorites = (itemId) => {
    removeFromFavorites(itemId);
    showToast('Đã xóa sản phẩm khỏi danh sách yêu thích', 'info');
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
            <h2>Danh sách yêu thích</h2>
          </div>
          
          <div className={cx('cardBody')}>
            <FavoritesList 
              favoriteItems={favoriteItems}
              onAddToCart={handleAddToCart}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;