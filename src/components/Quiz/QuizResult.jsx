import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { getSkinProductsAxios } from '~/services/itemAxios';
import { getSkinTypeDetailsAxios } from '~/services/quizAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const cx = classNames.bind(styles);

// Thêm hàm chuyển đổi skinType
const getSkinTypeDisplayName = (code) => {
  const skinTypesMap = {
    'da_dau': 'Da Dầu',
    'da_hon_hop': 'Da Hỗn Hợp',
    'da_thuong': 'Da Thường',
    'da_kho': 'Da Khô',
    'da_kho_lao_hoa': 'Da Khô Lão Hóa',
    'da_lao_hoa': 'Da Lão Hóa',
    'da_nhay_cam': 'Da Nhạy Cảm'
  };
  return skinTypesMap[code] || code;
};

const QuizResult = () => {
  const location = useLocation();
  const { points = 0, skinType = null, skinTypeInfo = null, answers = {} } = location.state || {};
  const { isLoggedIn, user } = useAuth();

  const [skinData, setSkinData] = useState({
    skinType: '',
    description: '',
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skinProducts, setSkinProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchSkinTypeDetails = async () => {
      if (!skinType) return;

      try {
        if (skinTypeInfo) {
          setSkinData({
            skinType: getSkinTypeDisplayName(skinType), // Chuyển đổi tại đây
            description: skinTypeInfo.description || '',
            recommendations: skinTypeInfo.recommendations || []
          });
          return;
        }

        const response = await getSkinTypeDetailsAxios(skinType);
        if (response.error) {
          setError(response.message);
          return;
        }

        setSkinData({
          skinType: getSkinTypeDisplayName(skinType), // Chuyển đổi tại đây
          description: response.data.description || '',
          recommendations: response.data.recommendations || []
        });
      } catch (err) {
        setError('Could not load skin type details');
      }
    };

    fetchSkinTypeDetails();
  }, [skinType, skinTypeInfo]);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendedProducts = async () => {
      if (!skinType) return;

      setProductsLoading(true);
      setSkinProducts([]); // Reset sản phẩm trước khi fetch

      try {
        console.log('Fetching products for skin type:', skinType);
        const response = await getSkinProductsAxios(skinType);

        if (!isMounted) return;

        if (response.error) {
          setProductsError(response.message);
          return;
        }

        console.log('Received products:', response.data);
        setSkinProducts(response.data || []);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching recommended products:', err);
        setProductsError('Không thể tải sản phẩm đề xuất');
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    fetchRecommendedProducts();

    return () => {
      isMounted = false;
    };
  }, [skinType, location.state?.key]); // Thêm location.state?.key vào dependencies

  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const [animatingItems, setAnimatingItems] = useState({});
  const [favoriteAnimations, setFavoriteAnimations] = useState({});

  const handleAddToCart = (item) => {
    if (!isLoggedIn()) {
      openLogin(() => {
        setAnimatingItems(prev => ({
          ...prev,
          [item._id]: true
        }));

        addToCart(item);
        toast.success(`${item.name} đã được thêm vào giỏ hàng!`);

        setTimeout(() => {
          setAnimatingItems(prev => ({
            ...prev,
            [item._id]: false
          }));
        }, 1000);
      });
      return;
    }

    setAnimatingItems(prev => ({
      ...prev,
      [item._id]: true
    }));

    addToCart(item);
    toast.success(`${item.name} đã được thêm vào giỏ hàng!`);

    setTimeout(() => {
      setAnimatingItems(prev => ({
        ...prev,
        [item._id]: false
      }));
    }, 1000);
  };

  const handleToggleFavorite = (item) => {
    const isFavorite = isInFavorites(item._id);

    if (!isLoggedIn()) {
      openLogin(() => {
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

        setTimeout(() => {
          setFavoriteAnimations(prev => ({
            ...prev,
            [item._id]: false
          }));
        }, 800);
      });
      return;
    }

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

    setTimeout(() => {
      setFavoriteAnimations(prev => ({
        ...prev,
        [item._id]: false
      }));
    }, 800);
  };

  const calculateOriginalPrice = (price, isFlashSale) => {
    if (isFlashSale) {
      return Math.round(price / 0.7);
    }
    return null;
  };

  return (
    <div className={cx('result-container')}>
      <div className={cx('result-header')}>
        <div className={cx('header-content')}>
          <h1>Kết Quả Kiểm Tra Da Của Bạn</h1>
          <div className={cx('score-container')}>
            <span className={cx('score')}>Tổng điểm: {points}</span>
          </div>
        </div>
        <Link to={config.routes.skinQuiz} className={cx('retry-button')}>
          Làm lại bài kiểm tra
        </Link>
      </div>

      <div className={cx('skin-type-section')}>
        <h2>
          Loại da của bạn: <span className={cx('skin-type')}>{skinData.skinType}</span>
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

      <div className={cx('recommended-products-section')}>
        <h3>Sản phẩm được đề xuất cho bạn:</h3>
        
        {productsLoading && (
          <div className={cx('loading-container')}>
            <div className={cx('loading-spinner')}></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        )}

        {productsError && !productsLoading && (
          <div className={cx('error-message')}>
            <p>{productsError}</p>
          </div>
        )}

        {!productsLoading && !productsError && skinProducts.length === 0 && (
          <p className={cx('no-products')}>
            Không tìm thấy sản phẩm phù hợp với loại da của bạn.
          </p>
        )}

        {!productsLoading && !productsError && skinProducts.length > 0 && (
          <div className={cx('product-grid')}>
            {skinProducts.map((product) => {
              const originalPrice = calculateOriginalPrice(product.price, product.flashSale);
              const discount = originalPrice
                ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
                : null;

              return (
                <div key={product._id} className={cx('product-item')}>
                  <Link to={`/product/${product._id}`} className={cx('product-link')}>
                    <div className={cx('image-container')}>
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className={cx('product-image')}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/300x300?text=No+Image"
                          alt={product.name}
                          className={cx('product-image')}
                        />
                      )}
                      {discount && (
                        <div className={cx('discount-badge')}>
                          -{discount}%
                        </div>
                      )}
                    </div>

                    <div className={cx('product-info')}>
                      <h4 className={cx('product-name')}>{product.name}</h4>
                      <div className={cx('brand-name')}>{product.brand?.name}</div>
                      <div className={cx('price-section')}>
                        <span className={cx('current-price')}>
                          {product.price.toLocaleString()}đ
                        </span>
                        {originalPrice && (
                          <span className={cx('original-price')}>
                            {originalPrice.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                      <div className={cx('stock-status', { 'out-of-stock': !product.stock })}>
                        {product.stock ? 'Còn hàng' : 'Hết hàng'}
                      </div>
                    </div>
                  </Link>

                  <div className={cx('product-actions')}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={cx('add-to-cart-button', {
                        'animating': animatingItems[product._id]
                      })}
                      disabled={!product.stock || animatingItems[product._id]}
                    >
                      <FaShoppingCart />
                    </button>

                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className={cx('favorite-button', {
                        'active': isInFavorites(product._id),
                        'animating': favoriteAnimations[product._id]
                      })}
                    >
                      <FaHeart />
                    </button>
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