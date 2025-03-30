// src/components/ProductCard.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from '~/pages/Home/Home.module.scss';

const cx = classNames.bind(styles);

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { isLoggedIn, openLogin } = useAuth();
  const [animatingCart, setAnimatingCart] = useState(false);
  const [animatingFavorite, setAnimatingFavorite] = useState(false);

  // Calculate original price based on flash sale
  const calculateOriginalPrice = (price, isFlashSale) => {
    if (isFlashSale) {
      return Math.round(price / 0.7); // 30% discount
    }
    return null;
  };

  const originalPrice = calculateOriginalPrice(product.price, product.flashSale);
  const discount = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Show login popup and set callback to add item to cart after login
      openLogin(() => {
        // Only show animation and add to cart after successful login
        setAnimatingCart(true);
        addToCart(product);
        toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
        
        // Reset animation after it completes
        setTimeout(() => {
          setAnimatingCart(false);
        }, 1000);
      });
      return;
    }
    
    // User is logged in, add to cart with animation
    setAnimatingCart(true);
    addToCart(product);
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
    
    // Reset animation after it completes
    setTimeout(() => {
      setAnimatingCart(false);
    }, 1000);
  };
  
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = isInFavorites(product._id);
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Show login popup and set callback to toggle favorite after login
      openLogin(() => {
        // Only toggle favorite, show animation, and display toast after successful login
        setAnimatingFavorite(true);
        
        if (isFavorite) {
          removeFromFavorites(product._id);
          toast.success(`${product.name} đã được xóa khỏi danh sách yêu thích!`);
        } else {
          addToFavorites(product);
          toast.success(`${product.name} đã được thêm vào danh sách yêu thích!`);
        }
        
        // Reset animation after it completes
        setTimeout(() => {
          setAnimatingFavorite(false);
        }, 800);
      });
      return;
    }
    
    // User is logged in, toggle favorite with animation
    setAnimatingFavorite(true);
    
    if (isFavorite) {
      removeFromFavorites(product._id);
      toast.success(`${product.name} đã được xóa khỏi danh sách yêu thích!`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} đã được thêm vào danh sách yêu thích!`);
    }
    
    // Reset animation after it completes
    setTimeout(() => {
      setAnimatingFavorite(false);
    }, 800);
  };

  return (
    <div className={cx('productCard')}>
      <Link to={`/product/${product._id}`} className={cx('productLink')}>
        <div className={cx('imageContainer')}>
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className={cx('productImage')}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/300x300?text=No+Image"
              alt={product.name}
              className={cx('productImage')}
            />
          )}
          {discount && (
            <div className={cx('discountBadge')}>
              {discount}%
            </div>
          )}
        </div>

        <div className={cx('productInfo')}>
          <div className={cx('priceSection')}>
            <div className={cx('currentPrice')}>
              {product.price?.toLocaleString()} đ
            </div>
            {originalPrice && (
              <div className={cx('originalPrice')}>
                {originalPrice.toLocaleString()} đ
              </div>
            )}
          </div>

          <div className={cx('brandName')}>{product.brand?.name || ''}</div>
          <h3 className={cx('productName')}>{product.name}</h3>

          <div className={cx('stockStatus')}>
            {product.stock ? 'Còn hàng' : 'Hết hàng'}
          </div>
        </div>
      </Link>
      
      <div className={cx('productActions')}>
        <button
          onClick={handleAddToCart}
          className={cx('addToCartButton', {
            'animating': animatingCart,
            'disabled': !isLoggedIn()
          })}
          disabled={!product.stock || animatingCart}
          aria-label="Add to cart"
          title={isLoggedIn() ? "Add to cart" : "Login required"}
        >
          <FaShoppingCart />
          {animatingCart && (
            <span className={cx('successIndicator')}>✓</span>
          )}
        </button>
        
        <button
          onClick={handleToggleFavorite}
          className={cx('favoriteButton', {
            'active': isInFavorites(product._id),
            'animating': animatingFavorite,
            'disabled': !isLoggedIn()
          })}
          disabled={animatingFavorite}
          aria-label="Toggle favorite"
          title={isLoggedIn() ? "Add to favorites" : "Login required"}
        >
          <FaHeart className={cx({
            'heartBeat': animatingFavorite && !isInFavorites(product._id),
            'heartBreak': animatingFavorite && isInFavorites(product._id)
          })} />
        </button>

        {animatingCart && (
          <div className={cx('flyToCartAnimation')}></div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;