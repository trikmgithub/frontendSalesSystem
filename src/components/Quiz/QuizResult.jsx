import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { getItemsAxios } from '~/services/itemAxios';
import { getSkinTypeDetailsAxios } from '~/services/quizAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const cx = classNames.bind(styles);

const QuizResult = () => {
  const { skinType: skinTypeParam } = useParams();
  const location = useLocation();
  const { points, skinType, skinTypeInfo, answers, fromQuiz } = location.state || {
    points: 0,
    skinType: null,
    skinTypeInfo: null,
    answers: {},
    fromQuiz: false
  };
  
  const [skinProducts, setSkinProducts] = useState([]);
  const [skinData, setSkinData] = useState({
    skinType: '',
    description: '',
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [skinTypeLoading, setSkinTypeLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { isLoggedIn, openLogin, user } = useAuth();
  const [animatingItems, setAnimatingItems] = useState({});
  const [favoriteAnimations, setFavoriteAnimations] = useState({});
  const [showScoreSection, setShowScoreSection] = useState(true);
  const [effectiveSkinType, setEffectiveSkinType] = useState(null);

  // Mapping for displaying Vietnamese skin type names
  const skinTypeMapping = {
    'da_dau': 'Da Dầu',
    'da_hon_hop': 'Da Hỗn Hợp',
    'da_thuong': 'Da Thường',
    'da_kho': 'Da Khô',
    'da_kho_lao_hoa': 'Da Khô Lão Hóa',
    'da_lao_hoa': 'Da Lão Hóa',
    'da_nhay_cam': 'Da Nhạy Cảm'
  };

  // Reverse mapping from English to Vietnamese skin type codes
  const englishToCodeMapping = {
    'oily': 'da_dau',
    'combination': 'da_hon_hop',
    'normal': 'da_thuong',
    'dry': 'da_kho',
    'dry-aging': 'da_kho_lao_hoa',
    'aging': 'da_lao_hoa',
    'sensitive': 'da_nhay_cam'
  };

  // Determine the effective skin type for this session (from URL, state, or user profile)
  useEffect(() => {
    const determineEffectiveSkinType = async () => {
      setSkinTypeLoading(true);
      
      try {
        let finalSkinType = null;
        
        // Priority 1: Use skin type from state if it came from quiz
        if (fromQuiz && skinType) {
          console.log('Using skin type from quiz results:', skinType);
          finalSkinType = skinType;
        }
        // Priority 2: Use skin type from URL params
        else if (skinTypeParam) {
          console.log('Using skin type from URL params:', skinTypeParam);
          // Convert from English route param to code if needed
          finalSkinType = englishToCodeMapping[skinTypeParam.toLowerCase()] || skinTypeParam;
        }
        // Priority 3: Use skin type from user profile
        else if (isLoggedIn() && user && user.skin) {
          console.log('Using skin type from user profile:', user.skin);
          finalSkinType = user.skin;
        }
        // Fallback to normal skin type
        else {
          console.log('No skin type available, defaulting to normal');
          finalSkinType = 'da_thuong'; // Default to normal skin
        }
        
        setEffectiveSkinType(finalSkinType);
      } catch (err) {
        console.error('Error determining skin type:', err);
        setEffectiveSkinType('da_thuong'); // Fallback to normal
      } finally {
        setSkinTypeLoading(false);
      }
    };

    determineEffectiveSkinType();
  }, [skinTypeParam, skinType, fromQuiz, isLoggedIn, user]);

  // Fetch skin type details once we have the effective skin type
  useEffect(() => {
    const fetchSkinTypeDetails = async () => {
      if (!effectiveSkinType || skinTypeLoading) {
        return;
      }

      try {
        console.log('Fetching skin type details for:', effectiveSkinType);
        
        // If skinTypeInfo is already available from quiz results, use it
        if (fromQuiz && skinTypeInfo) {
          console.log('Using skin type info from quiz results');
          setSkinData({
            skinType: effectiveSkinType,
            description: skinTypeInfo.description || '',
            recommendations: skinTypeInfo.recommendations || []
          });
          return;
        }
        
        // Otherwise, fetch details from API
        const response = await getSkinTypeDetailsAxios(effectiveSkinType);

        if (response.error) {
          console.error('API error:', response.message);
          setError(response.message || 'Failed to fetch skin type details');
          setSkinData({
            skinType: effectiveSkinType,
            description: 'Unable to load skin type description.',
            recommendations: []
          });
        } else {
          const details = response.data;
          console.log('Skin type details received:', details);
          setSkinData({
            skinType: details.skinType || effectiveSkinType,
            description: details.description || '',
            recommendations: details.recommendations || []
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching skin type details:', err);
        setError('Could not load skin type details');
        setSkinData({
          skinType: effectiveSkinType,
          description: 'Unable to load skin type description.',
          recommendations: []
        });
      }
    };

    fetchSkinTypeDetails();
  }, [effectiveSkinType, skinTypeLoading, fromQuiz, skinTypeInfo]);

  // Fetch product recommendations
  useEffect(() => {
    let isMounted = true;

    const fetchSkinProducts = async () => {
      if (!effectiveSkinType || skinTypeLoading) {
        return;
      }

      setLoading(true);

      try {
        console.log('Fetching products for skin type:', effectiveSkinType);
        
        // Fetch all products
        const response = await getItemsAxios();
        
        if (isMounted) {
          if (response.error) {
            console.error('Product API error:', response.message);
            setError(response.message || 'Failed to fetch products');
            setSkinProducts([]);
          } else {
            // Filter products based on description containing relevant skin type keywords
            const allProducts = response.data || [];
            console.log(`Retrieved ${allProducts.length} total products`);
            
            const skinTypeKeywords = {
              'da_dau': ['da dầu', 'oily skin', 'dầu nhờn'],
              'da_hon_hop': ['da hỗn hợp', 'combination skin', 'da thường dầu'],
              'da_thuong': ['da thường', 'normal skin', 'mọi loại da'],
              'da_kho': ['da khô', 'dry skin', 'thiếu ẩm', 'khô ráp'],
              'da_kho_lao_hoa': ['da khô lão hóa', 'dry aging skin', 'khô và lão hóa'],
              'da_lao_hoa': ['da lão hóa', 'aging skin', 'nếp nhăn'],
              'da_nhay_cam': ['da nhạy cảm', 'sensitive skin', 'dễ kích ứng']
            };
            
            const keywords = skinTypeKeywords[effectiveSkinType.toLowerCase()] || [];
            
            // Add general keywords that apply to all skin types
            keywords.push('mọi loại da', 'all skin types');
            
            // Filter products that match the keywords in description or name
            const filteredProducts = allProducts.filter(product => {
              const description = (product.description || '').toLowerCase();
              const name = (product.name || '').toLowerCase();
              
              return keywords.some(keyword => 
                description.includes(keyword) || name.includes(keyword)
              );
            });
            
            console.log(`Found ${filteredProducts.length} products for skin type:`, effectiveSkinType);
            setSkinProducts(filteredProducts);
            
            if (filteredProducts.length === 0) {
              console.log('No matching products, showing a subset of all products');
              // If no products match, show at least some products (first 8)
              setSkinProducts(allProducts.slice(0, 8));
            }
            
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching skin products:', err);
          setError('Could not load products for your skin type');
          setSkinProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSkinProducts();

    return () => {
      isMounted = false;
    };
  }, [effectiveSkinType, skinTypeLoading]);

  useEffect(() => {
    // Check if user came from direct navigation (not from quiz)
    if (!fromQuiz) {
      setShowScoreSection(false);
    } else {
      setShowScoreSection(true);
    }
  }, [fromQuiz]);

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

  // Helper function to get display name for skin type
  const getSkinTypeDisplayName = (skinType) => {
    if (!skinType) return 'Không xác định';
    
    // Check if it's already a display name
    if (Object.values(skinTypeMapping).includes(skinType)) {
      return skinType;
    }
    
    // Check if it's a code we can map
    return skinTypeMapping[skinType.toLowerCase()] || 'Không xác định';
  };

  return (
    <div className={cx('result-container')}>
      <div className={cx('result-header')}>
        <div className={cx('header-content')}>
          <h1>Kết Quả Kiểm Tra Da Của Bạn</h1>
          {showScoreSection && (
            <div className={cx('score-container')}>
              <span className={cx('score')}>Tổng điểm: {points}</span>
            </div>
          )}
        </div>
        <Link to={config.routes.skinQuiz} className={cx('retry-button')}>
          Làm lại bài kiểm tra
        </Link>
      </div>

      {/* Show loading indicator while fetching skin type */}
      {skinTypeLoading && (
        <div className={cx('loading-container')}>
          <div className={cx('loading-spinner')}></div>
          <p>Đang tải thông tin loại da...</p>
        </div>
      )}

      {!skinTypeLoading && (
        <>
          <div className={cx('skin-type-section')}>
            <h2>
              Loại da của bạn: <span className={cx('skin-type')}>
                {getSkinTypeDisplayName(skinData.skinType)}
              </span>
            </h2>
            <p className={cx('description')}>{skinData.description}</p>
          </div>

          <div className={cx('recommendations-section')}>
            <h3>Khuyến nghị chăm sóc da:</h3>
            {skinData.recommendations && skinData.recommendations.length > 0 ? (
              <ul className={cx('recommendations-list')}>
                {skinData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p>Không có khuyến nghị nào cho loại da này.</p>
            )}
          </div>
        </>
      )}

      {/* Product recommendations */}
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
    </div>
  );
};

export default QuizResult;