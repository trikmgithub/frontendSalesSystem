import React, { useState } from 'react';
import { User, ShoppingCart } from 'lucide-react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import emptyCartImage from '~/assets/empty-cart-svg.svg'; // Import ảnh
import routes from '~/config/routes'; // Import routes

const OrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('orders');
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [purchaseType, setPurchaseType] = useState('online');
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  
  return (
    <div className={cx(styles.profileContainer)}>
      {/* Sidebar */}
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
            onClick={() => {
              setSelectedTab('profile');
              navigate(routes.profile); // Điều hướng đến /profile
            }}
          >
            Thông tin tài khoản
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'orders' })}
            onClick={() => {
              setSelectedTab('orders');
              navigate(routes.ordersPage); // Điều hướng đến /profile/orders
            }}
          >
            Đơn hàng của tôi
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'favorites' })}
            onClick={() => {
              setSelectedTab('favorites');
              navigate(routes.favorites); // Điều hướng đến /favorites
            }}
          >
            Danh sách yêu thích
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cx(styles.mainContent)}>
        <div className={cx(styles.contentSection)}>
          <h1 className={cx(styles.sectionTitle)}>Đơn hàng của tôi</h1>
          
          {/* Purchase Type Tabs */}
          <div className={cx(styles.purchaseTypeTabs)}>
            <button 
              className={cx(styles.purchaseTypeTab, { [styles.activePurchaseType]: purchaseType === 'online' })}
              onClick={() => setPurchaseType('online')}
            >
              Mua online
            </button>
            
            <button 
              className={cx(styles.purchaseTypeTab, { [styles.activePurchaseType]: purchaseType === 'store' })}
              onClick={() => setPurchaseType('store')}
            >
              Mua tại cửa hàng
            </button>
          </div>
          
          {/* Order Status Tabs */}
          <div className={cx(styles.orderStatusTabs)}>
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'all' })}
              onClick={() => setActiveOrderTab('all')}
            >
              Tất cả
            </button>
            
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'new' })}
              onClick={() => setActiveOrderTab('new')}
            >
              Mới đặt
            </button>
            
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'processing' })}
              onClick={() => setActiveOrderTab('processing')}
            >
              Đang xử lý
            </button>
            
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'shipping' })}
              onClick={() => setActiveOrderTab('shipping')}
            >
              Đang vận chuyển
            </button>
            
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'completed' })}
              onClick={() => setActiveOrderTab('completed')}
            >
              Thành công
            </button>
            
            <button 
              className={cx(styles.orderTab, { [styles.activeOrderTab]: activeOrderTab === 'cancelled' })}
              onClick={() => setActiveOrderTab('cancelled')}
            >
              Đã hủy
            </button>
          </div>
          
          {/* Empty Order State */}
          <div className={cx(styles.emptyOrderState)}>
            <div className={cx(styles.emptyOrderIcon)}>
              <ShoppingCart size={24} className={cx(styles.cartIcon)} />
              <img 
                src={emptyCartImage} // Sử dụng ảnh đã import
                alt="Empty cart" 
                className={cx(styles.emptyCartImage)} 
              />
            </div>
            
            <p className={cx(styles.emptyOrderText)}>Bạn chưa có đơn hàng nào</p>
            
            <button 
              className={cx(styles.continueShopping)}
              onClick={() => navigate(routes.profile)} // Điều hướng đến /profile
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;