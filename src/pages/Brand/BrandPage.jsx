import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getItemsAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './BrandPage.module.scss';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';

const cx = classNames.bind(styles);

function BrandPage() {
    const { id } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [brandProducts, setBrandProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

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