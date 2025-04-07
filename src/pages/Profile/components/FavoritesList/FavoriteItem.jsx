// src/pages/Profile/components/FavoritesList/FavoriteItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Check } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './FavoritesList.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const FavoriteItem = ({ 
  item, 
  onAddToCart, 
  onRemoveFromFavorites 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };
  
  // Handle add to cart with animation
  const handleAddToCart = () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    onAddToCart(item);
    
    // Reset animation after 1s
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };
  
  // Handle remove with animation
  const handleRemove = () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    
    // Add slight delay before actual removal for animation
    setTimeout(() => {
      onRemoveFromFavorites(item._id);
    }, 300);
  };
  
  return (
    <div className={cx('favoriteItem', { 'removing': isRemoving })}>
      <div className={cx('favoriteInfo')}>
        <div className={cx('productImage')}>
          <img 
            src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : '/placeholder.jpg'} 
            alt={item.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
        </div>
        
        <div className={cx('productDetails')}>
          <div className={cx('productBrand')}>{item.brand?.name || 'BRAND'}</div>
          <h3 className={cx('productName')}>
            <Link to={`/product/${item._id}`}>{item.name}</Link>
          </h3>
          <div className={cx('productPrice')}>{formatPrice(item.price)}</div>
        </div>
      </div>
      
      <div className={cx('favoriteActions')}>
        <button 
          className={cx('button', 'primary', 'addToCart', { 'animating': isAddingToCart })}
          onClick={handleAddToCart}
          disabled={!item.stock || isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <Check size={16} className={cx('successIcon')} />
              <span>Đã thêm</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Thêm vào giỏ</span>
            </>
          )}
          
          {isAddingToCart && (
            <span className={cx('animationCircle')}></span>
          )}
        </button>
        
        <button 
          className={cx('button', 'danger', 'remove')}
          onClick={handleRemove}
          disabled={isRemoving}
        >
          <Trash2 size={16} />
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default FavoriteItem;