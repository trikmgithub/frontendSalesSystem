import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { getSkinProductsAxios } from '~/services/itemAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const cx = classNames.bind(styles);

const skinTypeData = {
  oily: {
    title: 'Da Dầu',
    description: 'Làn da của bạn có xu hướng tiết nhiều dầu, đặc biệt là ở vùng chữ T (trán, mũi, cằm). Các lỗ chân lông có thể to và dễ bị tắc nghẽn, gây ra mụn đầu đen và mụn trứng cá.',
    recommendations: [
      'Sử dụng sữa rửa mặt dịu nhẹ, có khả năng kiểm soát dầu',
      'Tránh các sản phẩm chứa dầu và chọn các sản phẩm ghi "không gây bít lỗ chân lông" (non-comedogenic)',
      'Sử dụng toner không cồn để cân bằng độ pH',
      'Dùng kem dưỡng ẩm dạng gel hoặc dạng nước nhẹ',
      'Đắp mặt nạ đất sét 1-2 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Làm Sạch Sâu',
        description: 'Giúp loại bỏ bã nhờn và tạp chất mà không làm khô da'
      },
      {
        name: 'Toner Cân Bằng Dầu',
        description: 'Kiểm soát dầu và se khít lỗ chân lông'
      },
      {
        name: 'Serum Kiểm Soát Dầu',
        description: 'Giảm tiết dầu và ngăn ngừa mụn'
      }
    ]
  },
  combination: {
    title: 'Da Hỗn Hợp',
    description: 'Da của bạn có những vùng dầu (thường là vùng chữ T) và những vùng thường hoặc khô (má và viền mặt). Đây là loại da phổ biến nhất.',
    recommendations: [
      'Sử dụng các sản phẩm làm sạch dịu nhẹ cho toàn bộ khuôn mặt',
      'Áp dụng các sản phẩm kiểm soát dầu chỉ ở vùng chữ T',
      'Dưỡng ẩm nhiều hơn ở các vùng khô',
      'Sử dụng các sản phẩm khác nhau cho các vùng da khác nhau',
      'Đắp mặt nạ đất sét ở vùng chữ T và mặt nạ dưỡng ẩm ở vùng má'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Cân Bằng',
        description: 'Làm sạch nhẹ nhàng mà không làm mất cân bằng độ ẩm'
      },
      {
        name: 'Toner Không Cồn',
        description: 'Cân bằng và làm dịu da sau khi rửa mặt'
      },
      {
        name: 'Kem Dưỡng Ẩm Da Hỗn Hợp',
        description: 'Cung cấp độ ẩm phù hợp cho cả vùng dầu và vùng khô'
      }
    ]
  },
  normal: {
    title: 'Da Thường',
    description: 'Bạn có làn da cân bằng, không quá dầu cũng không quá khô. Lỗ chân lông nhỏ, và da của bạn có vẻ khỏe mạnh với ít khuyết điểm.',
    recommendations: [
      'Duy trì thói quen chăm sóc da đơn giản và nhất quán',
      'Sử dụng sữa rửa mặt dịu nhẹ hai lần mỗi ngày',
      'Áp dụng kem dưỡng ẩm phù hợp với mùa',
      'Không quên chống nắng mỗi ngày',
      'Sử dụng mặt nạ dưỡng ẩm hoặc làm sáng da 1-2 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Dịu Nhẹ',
        description: 'Làm sạch nhẹ nhàng mà không làm mất cân bằng da'
      },
      {
        name: 'Serum Dưỡng Ẩm',
        description: 'Duy trì độ ẩm và giúp da luôn tươi trẻ'
      },
      {
        name: 'Kem Chống Nắng SPF 50',
        description: 'Bảo vệ da khỏi tác hại của tia UV'
      }
    ]
  },
  dry: {
    title: 'Da Khô',
    description: 'Da của bạn thường cảm thấy căng, thô ráp hoặc bong tróc. Bạn có thể thấy những vết nhăn mịn xuất hiện sớm hơn những người có loại da khác.',
    recommendations: [
      'Sử dụng sữa rửa mặt không có xà phòng, không có chất tẩy rửa mạnh',
      'Tránh tắm nước nóng vì nó có thể làm mất đi dầu tự nhiên của da',
      'Dùng kem dưỡng ẩm giàu dưỡng chất ngay sau khi rửa mặt',
      'Sử dụng serum chứa Hyaluronic Acid để giữ nước',
      'Đắp mặt nạ dưỡng ẩm 2-3 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Dưỡng Ẩm',
        description: 'Làm sạch mà không làm mất đi dầu tự nhiên của da'
      },
      {
        name: 'Serum Hyaluronic Acid',
        description: 'Cung cấp và khóa ẩm sâu'
      },
      {
        name: 'Kem Dưỡng Giàu Dưỡng Chất',
        description: 'Nuôi dưỡng và khôi phục hàng rào bảo vệ da'
      }
    ]
  }
};

const QuizResult = () => {
  const { skinType } = useParams();
  const location = useLocation();
  const { points, answers } = location.state || { points: 0, answers: {} };
  const [skinProducts, setSkinProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { isLoggedIn, openLogin } = useAuth();
  const [animatingItems, setAnimatingItems] = useState({});
  const [favoriteAnimations, setFavoriteAnimations] = useState({});
  
  const skinData = skinTypeData[skinType] || skinTypeData.normal;

  useEffect(() => {
    const fetchSkinProducts = async () => {
      setLoading(true);
      try {
        // Use the Vietnamese skin type name for the API call
        const response = await getSkinProductsAxios(skinData.title);
        
        if (response.error) {
          setError(response.message || 'Failed to fetch products');
          setSkinProducts([]);
        } else {
          // Extract products from the response
          // The API returns products directly in the data array, not in a nested result property
          const products = response.data || [];
          setSkinProducts(products);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching skin products:', err);
        setError('Could not load products for your skin type');
        setSkinProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSkinProducts();
  }, [skinType, skinData.title]);

  const handleAddToCart = (item) => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Show login popup and set callback to add item to cart after login
      openLogin(() => {
        // Only show animation and add to cart after successful login
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
      return;
    }
    
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
  
  const handleToggleFavorite = (item) => {
    const isFavorite = isInFavorites(item._id);
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Show login popup and set callback to toggle favorite after login
      openLogin(() => {
        // Only toggle favorite after successful login
        setFavoriteAnimations(prev => ({
          ...prev,
          [item._id]: true
        }));
        
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
      return;
    }
    
    // User is logged in, toggle favorite with animation
    setFavoriteAnimations(prev => ({
      ...prev,
      [item._id]: true
    }));
    
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

  // Calculate original price based on flash sale (if true, add 30% to the price)
  const calculateOriginalPrice = (price, isFlashSale) => {
    if (isFlashSale) {
      return Math.round(price / 0.7); // 30% discount
    }
    return null;
  };

  return (
    <div className={cx('result-container')}>
      <div className={cx('result-header')}>
        <h1>Kết Quả Kiểm Tra Da Của Bạn</h1>
        <div className={cx('score-container')}>
          <span className={cx('score')}>Tổng điểm: {points}</span>
        </div>
      </div>

      <div className={cx('skin-type-section')}>
        <h2>Loại da của bạn: <span className={cx('skin-type')}>{skinData.title}</span></h2>
        <p className={cx('description')}>{skinData.description}</p>
      </div>

      <div className={cx('recommendations-section')}>
        <h3>Khuyến nghị chăm sóc da:</h3>
        <ul className={cx('recommendations-list')}>
          {skinData.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      {/* Product recommendations from API */}
      <div className={cx('recommended-products-section')}>
        <h3>Sản phẩm được đề xuất cho bạn:</h3>
        
        {loading && (
          <div className={cx('loading-container')}>
            <div className={cx('loading-spinner')}></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className={cx('error-notification')}>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && skinProducts.length === 0 && (
          <div className={cx('no-products')}>
            <p>Không tìm thấy sản phẩm phù hợp với loại da của bạn.</p>
          </div>
        )}
        
        {!loading && !error && skinProducts.length > 0 && (
          <div className={cx('product-grid')}>
            {skinProducts.map((item) => {
              const originalPrice = calculateOriginalPrice(item.price, item.flashSale);
              const discount = originalPrice ? Math.round(((originalPrice - item.price) / originalPrice) * 100) : null;

              return (
                <div key={item._id} className={cx('product-item')}>
                  <Link to={`/product/${item._id}`} className={cx('product-link')}>
                    <div className={cx('image-container')}>
                      {item.imageUrls && item.imageUrls.length > 0 ? (
                        <img
                          src={item.imageUrls[0]}
                          alt={item.name}
                          className={cx('product-image')}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/300x300?text=No+Image"
                          alt={item.name}
                          className={cx('product-image')}
                        />
                      )}
                      {discount && (
                        <div className={cx('discount-badge')}>
                          {discount}%
                        </div>
                      )}
                    </div>

                    <div className={cx('product-info')}>
                      <div className={cx('price-section')}>
                        <div className={cx('current-price')}>
                          {item.price?.toLocaleString()} đ
                        </div>
                        {originalPrice && (
                          <div className={cx('original-price')}>
                            {originalPrice.toLocaleString()} đ
                          </div>
                        )}
                      </div>

                      <div className={cx('brand-name')}>{item.brand?.name || ''}</div>
                      <h4 className={cx('product-name')}>{item.name}</h4>

                      <div className={cx('stock-status')}>
                        {item.stock ? 'Còn hàng' : 'Hết hàng'}
                      </div>
                    </div>
                  </Link>
                  
                  <div className={cx('product-actions')}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className={cx('add-to-cart-button', {
                        'animating': animatingItems[item._id]
                      })}
                      disabled={!item.stock || animatingItems[item._id]}
                      aria-label="Add to cart"
                      title="Add to cart"
                    >
                      <FaShoppingCart />
                      {animatingItems[item._id] && (
                        <span className={cx('success-indicator')}>✓</span>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(item);
                      }}
                      className={cx('favorite-button', {
                        'active': isInFavorites(item._id),
                        'animating': favoriteAnimations[item._id]
                      })}
                      disabled={favoriteAnimations[item._id]}
                      aria-label="Toggle favorite"
                      title="Add to favorites"
                    >
                      <FaHeart className={cx({
                        'heart-beat': favoriteAnimations[item._id] && !isInFavorites(item._id),
                        'heart-break': favoriteAnimations[item._id] && isInFavorites(item._id)
                      })} />
                    </button>

                    {animatingItems[item._id] && (
                      <div className={cx('fly-to-cart-animation')}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={cx('actions')}>
        <Link to={config.routes.skinQuiz} className={cx('retry-button')}>
          Làm lại bài kiểm tra
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;