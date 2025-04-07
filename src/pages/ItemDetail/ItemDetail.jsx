import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ItemDetail.module.scss';
import { getItemDetail } from '~/services/itemAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';

const cx = classNames.bind(styles);

function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useContext(CartContext);
    const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
    const { isLoggedIn, openLogin } = useAuth();
    
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getItemDetail(id)
            .then((response) => {
                console.log("Item detail response:", response.data.item);
                setItem(response.data.item);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Adding state to manage button styles for animation feedback
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    
    const handleAddToCart = () => {
        if (!item) return;
        
        console.log("ItemDetail: Add to cart clicked, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("ItemDetail: Not logged in, showing login popup");
            // Show login popup and set callback to add item to cart after login
            openLogin(() => {
                console.log("ItemDetail: Login successful, now adding to cart");
                // Add to cart and show toast ONLY after successful login
                setIsAddingToCart(true);
                addToCart(item);
                toast.success(`${item.name} đã được thêm vào giỏ hàng!`);
                
                // Reset animation state
                setTimeout(() => {
                    setIsAddingToCart(false);
                }, 1000);
            });
            // IMPORTANT: Return early to prevent any action
            return;
        }
        
        console.log("ItemDetail: User is logged in, adding to cart");
        // User is logged in, add to cart with animation
        setIsAddingToCart(true);
        addToCart(item);
        toast.success(`${item.name} đã được thêm vào giỏ hàng!`);
        
        // Reset animation state
        setTimeout(() => {
            setIsAddingToCart(false);
        }, 1000);
    };
    
    const handleToggleFavorite = () => {
        if (!item) return;
        
        console.log("ItemDetail: Toggle favorite clicked, isLoggedIn:", isLoggedIn());
        const isFav = isInFavorites(item._id);
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("ItemDetail: Not logged in, showing login popup");
            // Show login popup and set callback to toggle favorite after login
            openLogin(() => {
                console.log("ItemDetail: Login successful, now toggling favorite");
                // Toggle favorite and show toast ONLY after successful login
                setIsTogglingFavorite(true);
                
                if (isFav) {
                    removeFromFavorites(item._id);
                    toast.success(`${item.name} đã được xóa khỏi danh sách yêu thích!`);
                } else {
                    addToFavorites(item);
                    toast.success(`${item.name} đã được thêm vào danh sách yêu thích!`);
                }
                
                // Reset animation state
                setTimeout(() => {
                    setIsTogglingFavorite(false);
                }, 800);
            });
            // IMPORTANT: Return early to prevent any action
            return;
        }
        
        console.log("ItemDetail: User is logged in, toggling favorite");
        // User is logged in, toggle favorite with animation
        setIsTogglingFavorite(true);
        
        if (isFav) {
            removeFromFavorites(item._id);
            toast.success(`${item.name} đã được xóa khỏi danh sách yêu thích!`);
        } else {
            addToFavorites(item);
            toast.success(`${item.name} đã được thêm vào danh sách yêu thích!`);
        }
        
        // Reset animation state
        setTimeout(() => {
            setIsTogglingFavorite(false);
        }, 800);
    };

    if (loading) return (
        <div className={cx('loading-container')}>
            <div className={cx('loading-spinner')}></div>
            <p>Đang tải thông tin sản phẩm...</p>
        </div>
    );
    
    if (error) return (
        <div className={cx('error-container')}>
            <p>Lỗi: {error}</p>
            <p>Không thể tải thông tin sản phẩm, vui lòng thử lại sau.</p>
        </div>
    );
    
    if (!item) return (
        <div className={cx('error-container')}>
            <p>Không tìm thấy sản phẩm</p>
        </div>
    );

    // Determine price display values based on sale status
    const currentPrice = item.isOnSale && item.discountedPrice ? item.discountedPrice : item.price;
    const originalPrice = item.isOnSale ? item.price : null;
    const discount = item.flashSale || 0;
    const isOnSale = item.isOnSale && discount > 0;

    return (
        <div className={cx('product-detail-container')}>
            <div className={cx('product-detail-wrapper')}>
                {/* Product Images Section */}
                <div className={cx('product-images-section')}>
                    <div className={cx('main-image-container')}>
                        <img 
                            src={item.imageUrls[selectedImage]} 
                            alt={item.name} 
                            className={cx('main-product-image')}
                        />
                    </div>
                    <div className={cx('thumbnail-container')}>
                        {item.imageUrls.map((url, index) => (
                            <div 
                                key={index} 
                                className={cx('thumbnail', { active: index === selectedImage })}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={url} alt={`${item.name} - view ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info Section */}
                <div className={cx('product-info-section')}>
                    <div className={cx('brand-name')}>{item.brand.name}</div>
                    <h1 className={cx('product-name')}>{item.name}</h1>
                    
                    {/* Display ratings (placeholder) */}
                    <div className={cx('ratings')}>
                        <div className={cx('stars')}>
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={cx('star-icon')} />
                            ))}
                        </div>
                    </div>
                    
                    {/* Price Display */}
                    <div className={cx('price-container')}>
                        {isOnSale && (
                            <>
                                <div className={cx('price-row')}>
                                    <span className={cx('current-price')}>
                                        {currentPrice.toLocaleString()} đ
                                    </span>
                                    <span className={cx('original-price')}>
                                        {originalPrice.toLocaleString()} đ
                                    </span>
                                    <span className={cx('discount-badge')}>
                                        -{discount}%
                                    </span>
                                </div>
                            </>
                        )}
                        {!isOnSale && (
                            <div className={cx('price-row')}>
                                <span className={cx('current-price')}>
                                    {currentPrice.toLocaleString()} đ
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Button and Favorites */}
                    <div className={cx('add-to-cart-section')}>
                        <div className={cx('product-buttons')}>
                            <button 
                                className={cx('add-to-cart-button', {
                                    'animating': isAddingToCart,
                                    'disabled': !isLoggedIn()
                                })}
                                onClick={handleAddToCart}
                                disabled={!item.stock || isAddingToCart}
                                title={isLoggedIn() ? "Thêm vào giỏ hàng" : "Vui lòng đăng nhập"}
                            >
                                <FaShoppingCart />
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                            
                            <button 
                                className={cx('add-to-favorites-button', {
                                    'in-favorites': isInFavorites(item._id),
                                    'animating': isTogglingFavorite,
                                    'disabled': !isLoggedIn()
                                })}
                                onClick={handleToggleFavorite}
                                disabled={isTogglingFavorite}
                                title={isLoggedIn() ? (isInFavorites(item._id) ? "Đã yêu thích" : "Yêu thích") : "Vui lòng đăng nhập"}
                            >
                                <FaHeart />
                                <span>{isInFavorites(item._id) ? 'Đã yêu thích' : 'Yêu thích'}</span>
                            </button>
                        </div>
                        
                        <div className={cx('stock-info')}>
                            {item.stock ? 'Còn hàng' : 'Hết hàng'}
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className={cx('product-description')}>
                        <h2>Mô tả sản phẩm</h2>
                        <p>{item.description}</p>
                    </div>
                    
                    {/* Brand Description */}
                    <div className={cx('brand-description')}>
                        <h2>Về thương hiệu {item.brand.name}</h2>
                        <p>{item.brand.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetail;