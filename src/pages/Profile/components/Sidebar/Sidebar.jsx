// src/pages/Profile/components/Sidebar/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import routes from '~/config/routes';
import { useAuth } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const Sidebar = ({ selectedTab, userInfo = {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleTabChange = (tab) => {
    switch (tab) {
      case 'profile':
        navigate(routes.profile);
        break;
      case 'orders':
        navigate(routes.ordersPage);
        break;
      case 'favorites':
        navigate(routes.favorites);
        break;
      default:
        navigate(routes.profile);
    }
  };

  // Get first name or username from full name
  const getDisplayName = () => {
    if (!userInfo.fullName) return '(K18 HCM)';
    const nameParts = userInfo.fullName.split(' ');
    return nameParts[nameParts.length - 1] || '(K18 HCM)';
  };

  return (
    <div className={cx('sidebar')}>
      <div className={cx('userInfo')}>
        <div className={cx('avatar')}>
          {userInfo.avatar ? (
            <img 
              src={userInfo.avatar} 
              alt={userInfo.fullName || 'User avatar'} 
              className={cx('avatarImage')}
            />
          ) : (
            <User size={32} className={cx('avatarIcon')} />
          )}
        </div>
        <div className={cx('userDetails')}>
          <h3 className={cx('greeting')}>Xin chào, {getDisplayName()}</h3>
          <button 
            className={cx('editProfile')}
            onClick={() => handleTabChange('profile')}
          >
            Chỉnh sửa tài khoản
          </button>
        </div>
      </div>
      
      <div className={cx('divider')}></div>
      
      <nav className={cx('navigation')}>
        <h4 className={cx('navTitle')}>Quản lý tài khoản</h4>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'profile' })}
          onClick={() => handleTabChange('profile')}
        >
          <User size={18} />
          <span>Thông tin tài khoản</span>
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'orders' })}
          onClick={() => handleTabChange('orders')}
        >
          <ShoppingBag size={18} />
          <span>Đơn hàng của tôi</span>
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'favorites' })}
          onClick={() => handleTabChange('favorites')}
        >
          <Heart size={18} />
          <span>Danh sách yêu thích</span>
        </button>
      </nav>
      
      <div className={cx('sidebarFooter')}>
        <button 
          className={cx('logoutButton')}
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;