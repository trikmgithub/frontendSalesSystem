// src/components/ProductCard/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FaRegHeart, FaHeart, FaImage, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

import styles from './ProductCard.module.scss';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';

const cx = classNames.bind(styles);

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { favoriteItems, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const [imageError, setImageError] = useState(false);
    const [favoriteClicked, setFavoriteClicked] = useState(false);
    const [cartClicked, setCartClicked] = useState(false);
    const cartBtnRef = useRef(null);
    
    // Check if this product is in favorites
    const isFavorite = Array.isArray(favoriteItems) ? 
        favoriteItems.some(fav => fav._id === product._id) : false;
    
    // Effect to reset the button animations
    useEffect(() => {
        if (favoriteClicked) {
            const timer = setTimeout(() => {
                setFavoriteClicked(false);
            }, 700); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [favoriteClicked]);

    useEffect(() => {
        if (cartClicked) {
            const timer = setTimeout(() => {
                setCartClicked(false);
            }, 700); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [cartClicked]);
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Create ripple effect
        if (cartBtnRef.current) {
            const button = cartBtnRef.current;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
            circle.classList.add(cx('ripple'));
            
            const ripple = button.getElementsByClassName(cx('ripple'))[0];
            if (ripple) {
                ripple.remove();
            }
            
            button.appendChild(circle);
        }
        
        // Set cart clicked state for animation
        setCartClicked(true);
        
        // Add to cart and show toast
        addToCart(product);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    };
    
    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Set favorite clicked state for animation
        setFavoriteClicked(true);
        
        if (isFavorite) {
            removeFromFavorites(product._id);
            toast.info(`Đã xóa ${product.name} khỏi danh sách yêu thích`);
        } else {
            addToFavorites(product);
            toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
        }
    };
    
    // Calculate original price (assuming a 30% discount for flashSale items)
    const discountPercent = product.flashSale ? 30 : 0;
    const originalPrice = product.flashSale ? 
        Math.round(product.price / (1 - discountPercent / 100)) : null;
    
    // Get the first image from the product
    const imageUrl = product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls[0]
        : null;
        
    // Handle image error
    const handleImageError = () => {
        setImageError(true);
    };
    
    // Format currency
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' đ';
    };

    return (
        <Link to={`/product/${product._id}`} className={cx('cardLink')}>
            <div className={cx('card')}>
                <div className={cx('imageContainer')}>
                    {!imageError && imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className={cx('image')}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className={cx('imagePlaceholder')}>
                            <FaImage />
                        </div>
                    )}
                    
                    {product.flashSale && (
                        <div className={cx('discountBadge')}>{discountPercent}%</div>
                    )}
                    
                    <button 
                        className={cx('favoriteButton', { 
                            'isFavorite': isFavorite,
                            'favoriteClicked': favoriteClicked
                        })}
                        onClick={handleToggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>
                
                <div className={cx('content')}>
                    <div className={cx('priceContainer')}>
                        <span className={cx('price')}>{formatPrice(product.price)}</span>
                        {originalPrice && (
                            <span className={cx('originalPrice')}>{formatPrice(originalPrice)}</span>
                        )}
                    </div>
                    
                    {product.brand && (
                        <div className={cx('brand')}>{product.brand.name}</div>
                    )}
                    
                    <h3 className={cx('name')}>{product.name}</h3>
                    
                    <div className={cx('stockStatus')}>
                        {product.stock ? 
                            <span className={cx('inStock')}>Còn hàng</span> : 
                            <span className={cx('outOfStock')}>Hết hàng</span>
                        }
                    </div>
                    
                    <button 
                        ref={cartBtnRef}
                        className={cx('addToCartButton', {
                            'cartClicked': cartClicked
                        })}
                        onClick={handleAddToCart}
                        disabled={!product.stock}
                    >
                        <FaShoppingCart className={cx('cartIcon')} />
                        <span>THÊM VÀO GIỎ</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;