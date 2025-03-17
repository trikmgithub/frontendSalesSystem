import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import cx from 'classnames';
import styles from './ProfilePage.module.scss';

const PasswordChangePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile');
  
  return (
    <div className={cx(styles.profileContainer)}>
      {/* Sidebar - Giữ nguyên từ ProfilePage */}
      <div className={cx(styles.sidebar)}>
        <div className={cx(styles.sidebarHeader)}>
          <div className={cx(styles.avatarPlaceholder)}>
            <User size={32} className={cx(styles.avatarIcon)} />
          </div>
          <div className={cx(styles.userInfo)}>
            <h2 className={cx(styles.userGreeting)}>Chào (K18 HCM)</h2>
            <p className={cx(styles.editAccount)}>Chỉnh sửa tài khoản</p>
          </div>
        </div>
        
        <div className={cx(styles.navigation)}>
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'profile' })}
            onClick={() => setSelectedTab('profile')}
          >
            Thông tin tài khoản
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'orders' })}
            onClick={() => setSelectedTab('orders')}
          >
            Đơn hàng của tôi
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'favorites' })}
            onClick={() => setSelectedTab('favorites')}
          >
            Danh sách yêu thích
          </button>
        </div>
      </div>

      {/* Main Content - Trang đổi mật khẩu */}
      <div className={cx(styles.mainContent)}>
        <div className={cx(styles.contentSection)}>
          <h1 className={cx(styles.sectionTitle)}>Thay đổi mật khẩu</h1>
          
          <div className={cx(styles.passwordForm)}>
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Mật khẩu hiện tại:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Nhập mật khẩu cũ"
              />
            </div>
            
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Mật khẩu mới:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Mật khẩu từ 6 đến 32 ký tự"
              />
            </div>
            
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Nhập lại:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            
            <div className={cx(styles.passwordFormActions)}>
              <button className={cx(styles.updatePasswordButton)}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangePage;