// src/components/ProductCard/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import classNames from 'classnames/bind';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

import styles from './ProductCard.module.scss';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { formatCurrency } from '~/utils/formatCurrency';

const cx = classNames.bind(styles);

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { favorites = [], addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    
    // Check if favorites exists and is an array before using .some()
    const isFavorite = Array.isArray(favorites) ? 
        favorites.some(fav => fav._id === product._id) : false;
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    };
    
    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isFavorite) {
            removeFromFavorites(product._id);
            toast.info(`Đã xóa ${product.name} khỏi danh sách yêu thích`);
        } else {
            addToFavorites(product);
            toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
        }
    };
    
    // Extracting the main image from the product
    const productImage = product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls[0]
        : '/placeholder.png';
        
    return (
        <Link to={`/product/${product._id}`} className={cx('cardLink')}>
            <div className={cx('card')}>
                <div className={cx('imageContainer')}>
                    <img src={productImage} alt={product.name} className={cx('image')} />
                    
                    {product.flashSale && (
                        <div className={cx('flashSaleBadge')}>FLASH SALE</div>
                    )}
                    
                    <button 
                        className={cx('favoriteButton')}
                        onClick={handleToggleFavorite}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>
                
                <div className={cx('content')}>
                    {product.brand && (
                        <div className={cx('brand')}>{product.brand.name}</div>
                    )}
                    
                    <h3 className={cx('name')}>{product.name}</h3>
                    
                    <div className={cx('priceContainer')}>
                        <span className={cx('price')}>{formatCurrency(product.price)}</span>
                    </div>
                    
                    <button 
                        className={cx('addToCartButton')}
                        onClick={handleAddToCart}
                    >
                        THÊM VÀO GIỎ
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;