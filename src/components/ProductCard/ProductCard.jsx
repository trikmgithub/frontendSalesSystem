// src/components/ProductCard.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useCompare } from '~/context/CompareContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaBalanceScale } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';

const cx = classNames.bind(styles);

function ProductCard({ product, onAddToCompare }) {
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { addToCompare, isInCompare } = useCompare();
  const { isLoggedIn, openLogin } = useAuth();
  const [animatingCart, setAnimatingCart] = useState(false);
  const [animatingFavorite, setAnimatingFavorite] = useState(false);
  const [animatingCompare, setAnimatingCompare] = useState(false);

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

  // New function to handle adding to compare
  const handleAddToCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If already in compare list, show a notification
    if (isInCompare(product._id)) {
      toast.info(`${product.name} đã có trong danh sách so sánh!`);
      return;
    }

    // Add animation
    setAnimatingCompare(true);

    // Add to compare
    addToCompare(product);

    // Reset animation after it completes
    setTimeout(() => {
      setAnimatingCompare(false);
    }, 800);
  };

  return (
    <div className={cx('card')}>
      <Link to={`/product/${product._id}`} className={cx('cardLink')}>
        <div className={cx('imageContainer')}>
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className={cx('image')}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ) : (
            <div className={cx('imagePlaceholder')}>
              <span>No Image</span>
            </div>
          )}
          {discount && (
            <div className={cx('discountBadge')}>
              {discount}%
            </div>
          )}
        </div>

        <div className={cx('content')}>
          <div className={cx('brand')}>{product.brand?.name || ''}</div>
          <h3 className={cx('name')}>{product.name}</h3>
          <div className={cx('priceContainer')}>
            <span className={cx('price')}>{product.price?.toLocaleString()} đ</span>
            {originalPrice && (
              <span className={cx('originalPrice')}>{originalPrice.toLocaleString()} đ</span>
            )}
          </div>
          <div className={cx('stockStatus', { 'inStock': product.stock, 'outOfStock': !product.stock })}>
            {product.stock ? 'Còn hàng' : 'Hết hàng'}
          </div>
        </div>
      </Link>

      {/* Product Actions */}
      <div className={cx('actionButtons')}>
        {/* Compare Button */}
        <button
          onClick={handleAddToCompare}
          className={cx('actionButton', 'compareButton', {
            'isComparing': isInCompare(product._id),
            'animating': animatingCompare
          })}
          aria-label="So sánh"
          title={isInCompare(product._id) ? "Đã thêm vào so sánh" : "Thêm vào so sánh"}
        >
          <FaBalanceScale
            size={16}
            className={cx({
              'compareScale': true,
              'scaleAnimating': animatingCompare
            })}
          />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={cx('actionButton', 'addToCartButton', {
            'cartClicked': animatingCart
          })}
          disabled={!product.stock}
          aria-label="Add to cart"
        >
          <FaShoppingCart className={cx('cartIcon')} style={{ color: 'white' }} />
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={cx('actionButton', 'favoriteButton', {
            'isFavorite': isInFavorites(product._id),
            'favoriteClicked': animatingFavorite
          })}
          aria-label="Toggle favorite"
        >
          <FaHeart />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;