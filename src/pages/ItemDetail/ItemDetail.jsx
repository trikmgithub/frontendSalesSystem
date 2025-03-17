import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ItemDetail.module.scss';
import { getItemDetail } from '~/services/itemAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
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
    
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getItemDetail(id)
            .then((response) => {
                setItem(response.data.item);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (item) {
            addToCart(item);
        }
    };
    
    const handleToggleFavorite = () => {
        if (item) {
            if (isInFavorites(item._id)) {
                removeFromFavorites(item._id);
            } else {
                addToFavorites(item);
            }
        }
    };

    // Calculate original price (for flash sale items, the price from API is already discounted)
    const calculateOriginalPrice = (discountedPrice) => {
        return Math.round(discountedPrice / 0.7); // Add 30% to get original price
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

    // Calculate prices
    const discountedPrice = item.flashSale ? item.price : null;
    const originalPrice = item.flashSale ? calculateOriginalPrice(item.price) : item.price;
    const discountPercentage = item.flashSale ? 30 : 0; // Assuming 30% discount for flash sales

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
                        {item.flashSale && (
                            <>
                                <div className={cx('price-row')}>
                                    <span className={cx('current-price')}>
                                        {discountedPrice?.toLocaleString()} đ
                                    </span>
                                    <span className={cx('original-price')}>
                                        {originalPrice.toLocaleString()} đ
                                    </span>
                                    <span className={cx('discount-badge')}>
                                        -{discountPercentage}%
                                    </span>
                                </div>
                            </>
                        )}
                        {!item.flashSale && (
                            <div className={cx('price-row')}>
                                <span className={cx('current-price')}>
                                    {originalPrice.toLocaleString()} đ
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Button and Favorites */}
                    <div className={cx('add-to-cart-section')}>
                        <div className={cx('product-buttons')}>
                            <button 
                                className={cx('add-to-cart-button')}
                                onClick={handleAddToCart}
                                disabled={!item.stock}
                            >
                                <FaShoppingCart />
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                            
                            <button 
                                className={cx('add-to-favorites-button', {
                                    'in-favorites': isInFavorites(item._id)
                                })}
                                onClick={handleToggleFavorite}
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