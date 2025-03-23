import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { X, Heart, ChevronUp, ChevronDown } from 'lucide-react';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext'; // Import FavoritesContext
import routes from '~/config/routes';
import LoginForm from '~/layouts/components/Header/LoginPopup';

const cx = classNames.bind(styles);

const Cart = () => {
    const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);
    const { addToFavorites, isInFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [favoriteAnimations, setFavoriteAnimations] = useState({}); // Animation states
    const [removeAnimations, setRemoveAnimations] = useState({}); // For remove animation
    const navigate = useNavigate();

    const handleProceedToCheckout = () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || user === null) {
            setShowLoginForm(true); // Show login popup
            return;
        }
        navigate(routes.payment); // Use navigate instead of window.location
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscount = () => {
        return 0; // If you have discount logic, implement it here
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity >= 1) {
            updateCartItemQuantity(item._id, newQuantity);
        }
    };

    const incrementQuantity = (item) => {
        handleQuantityChange(item, item.quantity + 1);
    };

    const decrementQuantity = (item) => {
        if (item.quantity > 1) {
            handleQuantityChange(item, item.quantity - 1);
        }
    };

    const handleFavorite = (item) => {
        // Check if the item is already in favorites
        const isFavorite = isInFavorites(item._id);
        
        // Set animation state
        setFavoriteAnimations(prev => ({
            ...prev,
            [item._id]: true
        }));
        
        // Handle add/remove from favorites
        if (isFavorite) {
            removeFromFavorites(item._id);
        } else {
            addToFavorites(item);
        }
        
        // Remove animation after it completes
        setTimeout(() => {
            setFavoriteAnimations(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 800);
    };

    const handleRemoveFromCart = (itemId) => {
        // Set animation state
        setRemoveAnimations(prev => ({
            ...prev,
            [itemId]: true
        }));
        
        // Remove after a small delay for animation to show
        setTimeout(() => {
            removeFromCart(itemId);
        }, 300);
    };

    return (
        <div className={cx('page-container')}>
            <div className={cx('breadcrumb')}>
                <Link to="/">Trang chủ</Link> &gt; Giỏ hàng
            </div>

            {cartItems.length === 0 ? (
                // Empty Cart View
                <div className={cx('emptyCart')}>
                    <h2 className={cx('emptyCartTitle')}>
                        Giỏ hàng <span>(0 sản phẩm)</span>
                    </h2>
                    <div className={cx('emptyCartImage')}></div>
                    <p className={cx('emptyCartMessage')}>Bạn chưa chọn sản phẩm.</p>
                    <Link to={routes.home} className={cx('continueShoppingButton')}>
                        Tiếp tục mua hàng
                    </Link>
                </div>
            ) : (
                // Cart with Items
                <div className={cx('cart-content')}>
                    <h1 className={cx('cart-title')}>
                        Giỏ hàng ({cartItems.length} sản phẩm)
                    </h1>

                    <div className={cx('cart-layout')}>
                        {/* Cart Items Section */}
                        <div className={cx('cart-items-container')}>
                            <div className={cx('cart-header')}>
                                <div className={cx('product-column')}>Sản phẩm</div>
                                <div className={cx('price-column')}>Giá tiền</div>
                                <div className={cx('quantity-column')}>Số lượng</div>
                                <div className={cx('total-column')}>Thành tiền</div>
                            </div>

                            <div className={cx('cart-items-list')}>
                                {cartItems.map((item) => (
                                    <div 
                                        key={item._id} 
                                        className={cx('cart-item', {
                                            'removing': removeAnimations[item._id]
                                        })}
                                    >
                                        <div className={cx('product-column')}>
                                            <div className={cx('product-details')}>
                                                <img 
                                                    src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : 'placeholder.jpg'} 
                                                    alt={item.name} 
                                                    className={cx('product-image')}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/80';
                                                    }}
                                                />
                                                <div className={cx('product-info')}>
                                                    <div className={cx('brand-name')}>{item.brand?.name || 'BRAND'}</div>
                                                    <div className={cx('product-name')}>{item.name}</div>
                                                    <div className={cx('product-actions')}>
                                                        <button 
                                                            onClick={() => handleFavorite(item)} 
                                                            className={cx('favorite-button', {
                                                                'animating': favoriteAnimations[item._id],
                                                                'is-favorite': isInFavorites(item._id)
                                                            })}
                                                        >
                                                            <Heart 
                                                                size={16} 
                                                                className={cx({
                                                                    'heart-animate': favoriteAnimations[item._id]
                                                                })} 
                                                                fill={isInFavorites(item._id) ? "#ff6b6b" : "none"}
                                                            />
                                                            <span>{isInFavorites(item._id) ? 'Đã thích' : 'Yêu thích'}</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRemoveFromCart(item._id)} 
                                                            className={cx('remove-button', {
                                                                'removing': removeAnimations[item._id]
                                                            })}
                                                        >
                                                            <X size={16} />
                                                            <span>Xóa</span>
                                                        </button>
                                                    </div>
                                                    {item.gift && (
                                                        <div className={cx('gift-item')}>{item.gift}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={cx('price-column')}>
                                            <div className={cx('price')}>
                                                {formatPrice(item.price)}
                                            </div>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <div className={cx('original-price')}>
                                                    {formatPrice(item.originalPrice)}
                                                </div>
                                            )}
                                        </div>

                                        <div className={cx('quantity-column')}>
                                            <div className={cx('quantity-control')}>
                                                <div className={cx('quantity-value')}>{item.quantity}</div>
                                                <div className={cx('quantity-buttons')}>
                                                    <button 
                                                        onClick={() => incrementQuantity(item)}
                                                        className={cx('quantity-button', 'up')}
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => decrementQuantity(item)}
                                                        className={cx('quantity-button', 'down')}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={cx('total-column')}>
                                            <div className={cx('item-total')}>
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={cx('continue-shopping')}>
                                <Link to={routes.home} className={cx('continue-shopping-link')}>
                                    ← Tiếp tục mua hàng
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className={cx('order-summary')}>
                            <div className={cx('summary-header')}>
                                <h2>Hóa đơn của bạn</h2>
                            </div>
                            <div className={cx('summary-content')}>
                                <div className={cx('summary-row')}>
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <div className={cx('summary-row')}>
                                    <span>Giảm giá:</span>
                                    <span>-{formatPrice(calculateDiscount())}</span>
                                </div>
                                <div className={cx('summary-row', 'total')}>
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                                <div className={cx('vat-info')}>
                                    (Đã bao gồm VAT)
                                </div>
                                <button 
                                    className={cx('checkout-button')}
                                    onClick={handleProceedToCheckout}
                                >
                                    Tiến hành đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
        </div>
    );
};

export default Cart;