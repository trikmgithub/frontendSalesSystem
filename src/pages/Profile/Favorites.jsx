import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Favorites.module.scss';
import { User, ShoppingCart, X, Check } from 'lucide-react';
import { FavoritesContext } from '~/context/FavoritesContext';
import { CartContext } from '~/context/CartContext';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const Favorites = () => {
    const { favoriteItems, removeFromFavorites } = useContext(FavoritesContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('favorites');
    const [cartAnimations, setCartAnimations] = useState({});
    const [removeAnimations, setRemoveAnimations] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    const handleAddToCart = (item) => {
        // Set animation state
        setCartAnimations(prev => ({
            ...prev,
            [item._id]: true
        }));
        
        // Add item to cart
        addToCart(item);
        
        // Reset animation after it completes
        setTimeout(() => {
            setCartAnimations(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 1000);
    };
    
    const handleRemoveFromFavorites = (itemId) => {
        // Set animation state
        setRemoveAnimations(prev => ({
            ...prev,
            [itemId]: true
        }));
        
        // Remove after animation completes
        setTimeout(() => {
            removeFromFavorites(itemId);
        }, 300);
    };

    return (
        <div className={cx('profile-container')}>
            {/* Sidebar */}
            <div className={cx('sidebar')}>
                <div className={cx('sidebar-header')}>
                    <div className={cx('avatar-placeholder')}>
                        <User size={32} className={cx('avatar-icon')} />
                    </div>
                    <div className={cx('user-info')}>
                        <h2 className={cx('user-greeting')}>Chào (K18 HCM)</h2>
                        <p className={cx('edit-account')}>Chỉnh sửa tài khoản</p>
                    </div>
                </div>
                
                <div className={cx('navigation')}>
                    <button 
                        className={cx('nav-item', { active: selectedTab === 'profile' })}
                        onClick={() => {
                            setSelectedTab('profile');
                            navigate(routes.profile);
                        }}
                    >
                        Thông tin tài khoản
                    </button>
                    
                    <button 
                        className={cx('nav-item', { active: selectedTab === 'orders' })}
                        onClick={() => {
                            setSelectedTab('orders');
                            navigate(routes.ordersPage);
                        }}
                    >
                        Đơn hàng của tôi
                    </button>
                    
                    <button 
                        className={cx('nav-item', { active: selectedTab === 'favorites' })}
                        onClick={() => {
                            setSelectedTab('favorites');
                            navigate(routes.favorites);
                        }}
                    >
                        Danh sách yêu thích
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={cx('main-content')}>
                <div className={cx('content-section')}>
                    <h1 className={cx('section-title')}>Danh sách yêu thích</h1>
                    
                    {favoriteItems.length === 0 ? (
                        // Empty Favorites View
                        <div className={cx('empty-state')}>
                            <div className={cx('empty-icon')}></div>
                            <p className={cx('empty-text')}>Bạn chưa có sản phẩm yêu thích nào</p>
                            <button 
                                className={cx('continue-shopping-btn')}
                                onClick={() => navigate(routes.home)}
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    ) : (
                        // Favorites with Items
                        <div className={cx('favorites-list')}>
                            {favoriteItems.map((item) => (
                                <div 
                                    key={item._id} 
                                    className={cx('favorite-item', {
                                        'removing': removeAnimations[item._id]
                                    })}
                                >
                                    <div className={cx('product-image-container')}>
                                        <img 
                                            src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : 'placeholder.jpg'} 
                                            alt={item.name} 
                                            className={cx('product-image')}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/80';
                                            }}
                                        />
                                    </div>
                                    
                                    <div className={cx('product-info')}>
                                        <div className={cx('brand-name')}>{item.brand?.name || 'BRAND'}</div>
                                        <div className={cx('product-name')}>
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </div>
                                        <div className={cx('product-price')}>
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>
                                    
                                    <div className={cx('product-actions')}>
                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className={cx('add-to-cart-button', {
                                                'animating': cartAnimations[item._id]
                                            })}
                                            disabled={!item.stock || cartAnimations[item._id]}
                                        >
                                            {cartAnimations[item._id] ? (
                                                <>
                                                    <Check size={16} className={cx('success-icon')} />
                                                    <span>Đã thêm</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={16} />
                                                    <span>Thêm vào giỏ</span>
                                                </>
                                            )}
                                            
                                            {cartAnimations[item._id] && (
                                                <span className={cx('animation-circle')}></span>
                                            )}
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleRemoveFromFavorites(item._id)} 
                                            className={cx('remove-button', {
                                                'removing': removeAnimations[item._id]
                                            })}
                                        >
                                            <X size={16} />
                                            <span>Xóa</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;