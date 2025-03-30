import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getItemsAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './BrandPage.module.scss';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useCompare } from '~/context/CompareContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaBalanceScale } from 'react-icons/fa';

const cx = classNames.bind(styles);

function BrandPage() {
    const { id } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [brandProducts, setBrandProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
    const { addToCompare, isInCompare } = useCompare();
    const { isLoggedIn, openLogin } = useAuth();
    const [animatingItems, setAnimatingItems] = useState({});
    const [favoriteAnimations, setFavoriteAnimations] = useState({});
    const [compareAnimations, setCompareAnimations] = useState({});

    useEffect(() => {
        fetchBrandProducts();
    }, [id]);

    const fetchBrandProducts = async () => {
        setLoading(true);
        try {
            const response = await getItemsAxios();

            if (response && response.data) {
                // Filter products by brand ID
                const filteredProducts = response.data.filter(item => item.brand && item.brand._id === id);

                // Extract brand info from first product (all products should have the same brand)
                if (filteredProducts.length > 0 && filteredProducts[0].brand) {
                    setBrandInfo(filteredProducts[0].brand);
                }

                setBrandProducts(filteredProducts);
            } else {
                setError('Failed to fetch brand products');
            }
        } catch (err) {
            console.error('Error fetching brand products:', err);
            setError('Could not load data from server');
        } finally {
            setLoading(false);
        }
    };

    // Handle adding to cart
    const handleAddToCart = (item) => {
        console.log("BrandPage: Add to cart clicked, isLoggedIn:", isLoggedIn());

        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("BrandPage: Not logged in, showing login popup");
            // Show login popup and set callback to add item to cart after login
            openLogin(() => {
                console.log("BrandPage: Login successful, now adding to cart");
                // Show animation and add to cart ONLY after successful login
                setAnimatingItems(prev => ({
                    ...prev,
                    [item._id]: true
                }));

                addToCart(item);
                toast.success(`${item.name} đã được thêm vào giỏ hàng!`);

                // Reset animation after it completes
                setTimeout(() => {
                    setAnimatingItems(prev => ({
                        ...prev,
                        [item._id]: false
                    }));
                }, 1000);
            });
            // IMPORTANT: Return early to prevent any action
            return;
        }

        console.log("BrandPage: User is logged in, adding to cart");
        // User is logged in, add to cart with animation
        setAnimatingItems(prev => ({
            ...prev,
            [item._id]: true
        }));

        addToCart(item);
        toast.success(`${item.name} đã được thêm vào giỏ hàng!`);

        // Reset animation after it completes
        setTimeout(() => {
            setAnimatingItems(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 1000);
    };

    // Handle toggling favorites
    const handleToggleFavorite = (item) => {
        console.log("BrandPage: Toggle favorite clicked, isLoggedIn:", isLoggedIn());
        const isFavorite = isInFavorites(item._id);

        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("BrandPage: Not logged in, showing login popup");
            // Show login popup and set callback to toggle favorite after login
            openLogin(() => {
                console.log("BrandPage: Login successful, now toggling favorite");
                // Set animation state ONLY after successful login
                setFavoriteAnimations(prev => ({
                    ...prev,
                    [item._id]: true
                }));

                // Add/remove from favorites
                if (isFavorite) {
                    removeFromFavorites(item._id);
                    toast.success(`${item.name} đã được xóa khỏi danh sách yêu thích!`);
                } else {
                    addToFavorites(item);
                    toast.success(`${item.name} đã được thêm vào danh sách yêu thích!`);
                }

                // Reset animation after it completes
                setTimeout(() => {
                    setFavoriteAnimations(prev => ({
                        ...prev,
                        [item._id]: false
                    }));
                }, 800);
            });
            // IMPORTANT: Return early to prevent any action
            return;
        }

        console.log("BrandPage: User is logged in, toggling favorite");
        // User is logged in, toggle favorite with animation
        setFavoriteAnimations(prev => ({
            ...prev,
            [item._id]: true
        }));

        // Add/remove from favorites
        if (isFavorite) {
            removeFromFavorites(item._id);
            toast.success(`${item.name} đã được xóa khỏi danh sách yêu thích!`);
        } else {
            addToFavorites(item);
            toast.success(`${item.name} đã được thêm vào danh sách yêu thích!`);
        }

        // Reset animation after it completes
        setTimeout(() => {
            setFavoriteAnimations(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 800);
    };

    // New function to handle adding to compare
    const handleAddToCompare = (item, e) => {
        e.preventDefault();
        e.stopPropagation();

        // If already in compare list, show a notification
        if (isInCompare(item._id)) {
            toast.info(`${item.name} đã có trong danh sách so sánh!`);
            return;
        }

        // Add animation
        setCompareAnimations(prev => ({
            ...prev,
            [item._id]: true
        }));

        // Add to compare
        addToCompare(item);

        // Reset animation after it completes
        setTimeout(() => {
            setCompareAnimations(prev => ({
                ...prev,
                [item._id]: false
            }));
        }, 800);
    };

    // Calculate original price based on flash sale (if true, add 30% to the price)
    const calculateOriginalPrice = (price, isFlashSale) => {
        if (isFlashSale) {
            return Math.round(price / 0.7); // 30% discount
        }
        return null;
    };

    if (loading && brandProducts.length === 0) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('error-notification')}>
                <p>{error}</p>
            </div>
        );
    }

    if (brandProducts.length === 0 && !loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('empty-state')}>
                        <h2>Không tìm thấy sản phẩm nào thuộc thương hiệu này</h2>
                        <p>Vui lòng thử tìm kiếm với các thương hiệu khác.</p>
                        <Link to="/" className={cx('back-home-button')}>Trở về trang chủ</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {brandInfo && (
                    <div className={cx('brand-info')}>
                        <h1 className={cx('brand-title')}>{brandInfo.name}</h1>
                        <p className={cx('brand-description')}>{brandInfo.description}</p>
                    </div>
                )}

                <div className={cx('productGrid')}>
                    {brandProducts.map((item) => {
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
                                    {/* Compare button */}
                                    <button
                                        onClick={(e) => handleAddToCompare(item, e)}
                                        className={cx('compareButton', {
                                            'isComparing': isInCompare(item._id),
                                            'animating': compareAnimations[item._id]
                                        })}
                                        aria-label="So sánh"
                                        title={isInCompare(item._id) ? "Đã thêm vào so sánh" : "Thêm vào so sánh"}
                                    >
                                        <FaBalanceScale
                                            size={16}
                                            className={cx({
                                                'compareScale': true,
                                                'scaleAnimating': compareAnimations[item._id]
                                            })}
                                        />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                        className={cx('addToCartButton', {
                                            'animating': animatingItems[item._id],
                                            'disabled': !isLoggedIn()
                                        })}
                                        disabled={!item.stock || animatingItems[item._id]}
                                        aria-label="Add to cart"
                                        title={isLoggedIn() ? "Thêm vào giỏ hàng" : "Vui lòng đăng nhập"}
                                    >
                                        🛒
                                        {animatingItems[item._id] && (
                                            <span className={cx('successIndicator')}>✓</span>
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleToggleFavorite(item);
                                        }}
                                        className={cx('favoriteButton', {
                                            'active': isInFavorites(item._id),
                                            'animating': favoriteAnimations[item._id],
                                            'disabled': !isLoggedIn()
                                        })}
                                        disabled={favoriteAnimations[item._id]}
                                        aria-label="Toggle favorite"
                                        title={isLoggedIn() ? (isInFavorites(item._id) ? "Đã yêu thích" : "Yêu thích") : "Vui lòng đăng nhập"}
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

                {loading && brandProducts.length > 0 && (
                    <div className={cx('loading-overlay')}>
                        <div className={cx('loading-spinner')}></div>
                        <p>Đang tải...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrandPage;