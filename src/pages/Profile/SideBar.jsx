import React from 'react';
import { User } from 'lucide-react';
import cx from 'classnames';

// This assumes you'll create this stylesheet separately or add to your existing one
// Keeping the styles organized based on the paste.txt provided
const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className={cx('sidebar')}>
      {/* User Profile Header */}
      <div className={cx('sidebarHeader')}>
        <div className={cx('avatarPlaceholder')}>
          <User size={24} className={cx('avatarIcon')} />
        </div>
        <div className={cx('userInfo')}>
          <h2 className={cx('userGreeting')}>Chào (K18 HCM)</h2>
          <p className={cx('editAccount')}>Chỉnh sửa tài khoản</p>
        </div>
      </div>
      
      {/* Sidebar Navigation Title */}
      <div className={cx('sidebarSectionTitle')}>
        Quản lý tài khoản
      </div>
      
      {/* Navigation Menu */}
      <div className={cx('navigation')}>
        <button 
          className={cx('navItem', { 'active': selectedTab === 'profile' })}
          onClick={() => setSelectedTab('profile')}
        >
          Thông tin tài khoản
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'points' })}
          onClick={() => setSelectedTab('points')}
        >
          Hasaki tích điểm
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'orders' })}
          onClick={() => setSelectedTab('orders')}
        >
          Đơn hàng của tôi
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'booking' })}
          onClick={() => setSelectedTab('booking')}
        >
          Booking của tôi
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'favorites' })}
          onClick={() => setSelectedTab('favorites')}
        >
          Danh sách yêu thích
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'repurchase' })}
          onClick={() => setSelectedTab('repurchase')}
        >
          Mua lại
        </button>
        
        <button 
          className={cx('navItem', { 'active': selectedTab === 'faq' })}
          onClick={() => setSelectedTab('faq')}
        >
          Hỏi đáp
        </button>
      </div>
    </div>
  );
};

export default Sidebar;