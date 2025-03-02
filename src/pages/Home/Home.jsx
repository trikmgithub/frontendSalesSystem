import { useEffect, useState, useContext } from 'react';
import { getItemsAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';

const cx = classNames.bind(styles);

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { addToCart } = useContext(CartContext);
    const itemsPerPage = 18; // 6 products per row, 3 rows

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getItemsAxios();
                if (response && response.statusCode === 200) {
                    setItems(response.data);
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

        fetchItems();
    }, []);

    if (loading) return (
        <div className={cx('loading-container')}>
            <div className={cx('loading-spinner')}></div>
            <p>Đang tải sản phẩm...</p>
        </div>
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

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

    return (
        <div className={cx('wrapper')}>
            {error && (
                <div className={cx('error-notification')}>
                    <p>{error}</p>
                </div>
            )}
            <div className={cx('container')}>
                <div className={cx('productGrid')}>
                    {currentItems.map((item) => {
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
                                <button 
                                    onClick={() => addToCart(item)} 
                                    className={cx('addToCartButton')}
                                    disabled={!item.stock}
                                    aria-label="Add to cart"
                                    title="Add to cart"
                                >
                                    🛒
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                {totalPages > 1 && (
                    <div className={cx('pagination')}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={cx('paginationButton', { active: currentPage === page })}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;