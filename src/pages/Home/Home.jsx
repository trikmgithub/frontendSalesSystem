import { useEffect, useState, useContext, useRef } from 'react';
import { getItemsPaginatedAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { FaHeart } from 'react-icons/fa';

const cx = classNames.bind(styles);

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(12); // 4 products per row, 3 rows or 6 products per row, 2 rows
    const { addToCart } = useContext(CartContext);
    const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
    const [animatingItems, setAnimatingItems] = useState({});
    const [favoriteAnimations, setFavoriteAnimations] = useState({});
    const cartIconRef = useRef(null);

    const handleAddToCart = (item) => {
        // Show the animation
        setAnimatingItems(prev => ({
            ...prev,
            [item._id]: true
        }));

        // Add item to cart
        addToCart(item);

        // Reset animation after it completes
        setTimeout(() => {
            setAnimatingItems(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 1000); // Duration matches the animation length
    };

    const handleToggleFavorite = (item) => {
        const isFavorite = isInFavorites(item._id);

        // Set animation state
        setFavoriteAnimations(prev => ({
            ...prev,
            [item._id]: true
        }));

        // Add/remove from favorites
        if (isFavorite) {
            removeFromFavorites(item._id);
        } else {
            addToFavorites(item);
        }

        // Reset animation after it completes
        setTimeout(() => {
            setFavoriteAnimations(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 800); // Duration matches the animation length
    };

    useEffect(() => {
        fetchItems(currentPage);
    }, [currentPage]);

    const fetchItems = async (page) => {
        setLoading(true);
        try {
            const response = await getItemsPaginatedAxios(page, itemsPerPage);

            if (response && response.statusCode === 200) {
                // Extract data from the correct path in the response
                const { result, meta } = response.data.paginateItem;
                setItems(result);
                setTotalPages(parseInt(meta.totalPages));
                setTotalItems(parseInt(meta.numberItems));
            } else {
                setError(response?.message || 'Failed to fetch items');
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Could not load data from server');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Calculate original price based on flash sale (if true, add 30% to the price)
    const calculateOriginalPrice = (price, isFlashSale) => {
        if (isFlashSale) {
            return Math.round(price / 0.7); // 30% discount
        }
        return null;
    };

    if (loading && items.length === 0) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {error && (
                <div className={cx('error-notification')}>
                    <p>{error}</p>
                </div>
            )}
            <div className={cx('container')}>
                <div className={cx('productGrid')}>
                    {items.map((item) => {
                        const originalPrice = calculateOriginalPrice(item.price, item.flashSale);
                        const discount = originalPrice ? Math.round(((originalPrice - item.price) / originalPrice) * 100) : null;

                        return (
                            <div key={item._id} className={cx('productCard')}>
                                <Link to={`/product/${item._id}`} className={cx('productLink')}>
                                    <div className={cx('imageContainer')}>
                                        {item.imageUrls && item.imageUrls.length > 0 ? (
                                            <img
                                                src={item.imageUrls[0]}
                                                alt={item.name}
                                                className={cx('productImage')}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src="https://via.placeholder.com/300x300?text=No+Image"
                                                alt={item.name}
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
                                                {item.price?.toLocaleString()} đ
                                            </div>
                                            {originalPrice && (
                                                <div className={cx('originalPrice')}>
                                                    {originalPrice.toLocaleString()} đ
                                                </div>
                                            )}
                                        </div>

                                        <div className={cx('brandName')}>{item.brand?.name || ''}</div>
                                        <h3 className={cx('productName')}>{item.name}</h3>

                                        <div className={cx('stockStatus')}>
                                            {item.stock ? 'Còn hàng' : 'Hết hàng'}
                                        </div>
                                    </div>
                                </Link>
                                <div className={cx('productActions')}>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className={cx('addToCartButton', {
                                            'animating': animatingItems[item._id]
                                        })}
                                        disabled={!item.stock || animatingItems[item._id]}
                                        aria-label="Add to cart"
                                        title="Add to cart"
                                    >
                                        🛒
                                        {animatingItems[item._id] && (
                                            <span className={cx('successIndicator')}>✓</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleToggleFavorite(item)}
                                        className={cx('favoriteButton', {
                                            'active': isInFavorites(item._id),
                                            'animating': favoriteAnimations[item._id]
                                        })}
                                        disabled={favoriteAnimations[item._id]}
                                        aria-label="Toggle favorite"
                                        title="Add to favorites"
                                    >
                                        <FaHeart className={cx({
                                            'heartBeat': favoriteAnimations[item._id] && !isInFavorites(item._id),
                                            'heartBreak': favoriteAnimations[item._id] && isInFavorites(item._id)
                                        })} />
                                    </button>

                                    {animatingItems[item._id] && (
                                        <div className={cx('flyToCartAnimation')}></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className={cx('pagination')}>
                        {/* Previous page button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={cx('paginationButton', 'navButton')}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>

                        {/* First page */}
                        {currentPage > 3 && (
                            <button
                                onClick={() => handlePageChange(1)}
                                className={cx('paginationButton')}
                            >
                                1
                            </button>
                        )}

                        {/* Ellipsis if needed */}
                        {currentPage > 4 && (
                            <span className={cx('paginationEllipsis')}>...</span>
                        )}

                        {/* Page number buttons (show max 5 pages around current) */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => page === 1 || page === totalPages ||
                                (page >= currentPage - 2 && page <= currentPage + 2))
                            .map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={cx('paginationButton', { active: currentPage === page })}
                                >
                                    {page}
                                </button>
                            ))}

                        {/* Ellipsis if needed */}
                        {currentPage < totalPages - 3 && (
                            <span className={cx('paginationEllipsis')}>...</span>
                        )}

                        {/* Last page */}
                        {currentPage < totalPages - 2 && totalPages > 1 && (
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className={cx('paginationButton')}
                            >
                                {totalPages}
                            </button>
                        )}

                        {/* Next page button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={cx('paginationButton', 'navButton')}
                            disabled={currentPage === totalPages}
                        >
                            &raquo;
                        </button>
                    </div>
                )}

                {loading && items.length > 0 && (
                    <div className={cx('loading-overlay')}>
                        <div className={cx('loading-spinner')}></div>
                        <p>Đang tải...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;