import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { getSkinProductsAxios } from '~/services/itemAxios';
import { getSkinTypesAxios, getSkinTypeDetailsAxios } from '~/services/quizAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const cx = classNames.bind(styles);

const QuizResult = () => {
  const { skinType: skinTypeParam } = useParams();
  const location = useLocation();
  const { points, answers } = location.state || { points: 0, answers: {} };
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
  const [userSkinType, setUserSkinType] = useState(null);

  // Mapping for displaying Vietnamese skin type names
  // Mapping from database skinType codes to Vietnamese display names
  const skinTypeMapping = {
    'da_dau': 'Da Dầu',
    'da_hon_hop': 'Da Hỗn Hợp',
    'da_thuong': 'Da Thường',
    'da_kho': 'Da Khô',
    'da_nhay_cam': 'Da Nhạy Cảm'
  };

  // Reverse mapping from English to Vietnamese skin type codes
  const englishToCodeMapping = {
    'oily': 'da_dau',
    'combination': 'da_hon_hop',
    'normal': 'da_thuong',
    'dry': 'da_kho',
    'sensitive': 'da_nhay_cam'
  };

  // First, fetch all skin types to identify the user's skin type
  useEffect(() => {
    const fetchSkinTypes = async () => {
      setSkinTypeLoading(true);
      try {
        // If we have a skin type from URL params (quiz result), use it directly
        if (skinTypeParam) {
          console.log('Using skin type from URL params:', skinTypeParam);
          setUserSkinType(skinTypeParam);
          setSkinTypeLoading(false);
          return;
        }
        
        // Otherwise, get skin types from API and match with user profile
        const response = await getSkinTypesAxios();
        
        if (response.error) {
          console.error('Error fetching skin types:', response.message);
          // Fall back to default if API fails
          setUserSkinType('normal');
        } else {
          console.log('Skin types retrieved:', response.data);
          
          // If user is logged in and has a skin type in profile
          if (isLoggedIn() && user && user.skin) {
            console.log('User has skin type in profile:', user.skin);
            
            // Find the matching skin type code from the list
            const skinTypes = response.data || [];
            const matchedType = skinTypes.find(type => 
              type.skinType?.toLowerCase() === user.skin.toLowerCase() || 
              type.title?.toLowerCase() === user.skin.toLowerCase()
            );
            
            if (matchedType) {
              console.log('Matched to skin type:', matchedType.skinType);
              setUserSkinType(matchedType.skinType);
            } else {
              // If no match found, default to normal
              console.log('No match found, defaulting to normal');
              setUserSkinType('normal');
            }
          } else {
            // Default to normal if user has no skin type
            console.log('User has no skin type, defaulting to normal');
            setUserSkinType('normal');
          }
        }
      } catch (err) {
        console.error('Error in skin type fetch:', err);
        setUserSkinType('normal'); // Default fallback
      } finally {
        setSkinTypeLoading(false);
      }
    };

    fetchSkinTypes();
  }, [skinTypeParam, isLoggedIn, user]);

  // Then, fetch skin type details once we have the user's skin type
  useEffect(() => {
    const fetchSkinTypeDetails = async () => {
      if (!userSkinType || skinTypeLoading) {
        return; // Wait until we have the skin type
      }
      
      try {
        // The API expects skin type codes like 'da_dau', not 'oily'
        // Make sure we're using the right format for the API call
        let apiSkinType = userSkinType;
        
        // If the skinType is in English format (e.g., 'oily'), convert it to the API format
        if (englishToCodeMapping[apiSkinType.toLowerCase()]) {
          apiSkinType = englishToCodeMapping[apiSkinType.toLowerCase()];
        }
        
        console.log('Fetching skin type details for:', apiSkinType);
        const response = await getSkinTypeDetailsAxios(apiSkinType);
        
        if (response.error) {
          console.error('API error:', response.message);
          setError(response.message || 'Failed to fetch skin type details');
          setSkinData({
            skinType: apiSkinType, // Use the converted code
            description: 'Unable to load skin type description.',
            recommendations: []
          });
        } else {
          // Extract skin type details from the response
          const details = response.data;
          console.log('Skin type details received:', details);
          setSkinData({
            skinType: details.skinType || apiSkinType,
            description: details.description || '',
            recommendations: details.recommendations || []
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching skin type details:', err);
        setError('Could not load skin type details');
        setSkinData({
          skinType: userSkinType,
          description: 'Unable to load skin type description.',
          recommendations: []
        });
      }
    };

    fetchSkinTypeDetails();
  }, [userSkinType, skinTypeLoading, englishToCodeMapping]);

  // Fetch product recommendations using getSkinProductsAxios
  useEffect(() => {
    const fetchSkinProducts = async () => {
      if (!skinData.skinType) {
        return; // Wait until we have skin data with skinType
      }
      
      setLoading(true);
      
      try {
        // For product API, we need to use the Vietnamese skin type name
        let skinTypeForProductAPI = skinData.skinType;
        
        // Check if it's a code like 'da_dau' and convert to Vietnamese name
        if (skinTypeMapping[skinData.skinType.toLowerCase()]) {
          skinTypeForProductAPI = skinTypeMapping[skinData.skinType.toLowerCase()];
        }
        
        console.log('Fetching products for skin type:', skinTypeForProductAPI);
        const response = await getSkinProductsAxios(skinTypeForProductAPI);
        
        if (response.error) {
          console.error('Product API error:', response.message);
          setError(response.message || 'Failed to fetch products');
          setSkinProducts([]);
        } else {
          // Extract products from the response
          const products = response.data || [];
          console.log(`Found ${products.length} products for skin type:`, skinTypeForProductAPI);
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
  }, [skinData.title, skinTypeMapping]);

  useEffect(() => {
    // Check if user came from direct navigation (from header)
    if (location.state?.fromDirectNavigation) {
      // We don't have quiz points and answers from direct navigation
      // So we'll set a default value or hide the score section
      setShowScoreSection(false);
    } else {
      setShowScoreSection(true);
    }
  }, [location.state]);

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
    </div>
  );
};

export default QuizResult;