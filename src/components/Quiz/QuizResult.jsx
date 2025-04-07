import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { getItemsAxios } from '~/services/itemAxios';
import { getSkinTypeDetailsAxios, getSkinTypesAxios } from '~/services/quizAxios';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useAuth } from '~/context/AuthContext';
import ProductCard from '~/components/ProductCard';

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
  const { isLoggedIn, user } = useAuth();
  const [showScoreSection, setShowScoreSection] = useState(true);
  const [effectiveSkinType, setEffectiveSkinType] = useState(null);
  const [skinTypeMappings, setSkinTypeMappings] = useState({});

  // Fetch all skin types first to build mappings
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        // Fetch all skin types from the API
        const response = await getSkinTypesAxios();
        
        if (!response.error && response.data) {
          const skinTypes = response.data;
          const nameMap = {};
          
          // Map each skin type code to its Vietnamese name
          skinTypes.forEach(skinType => {
            nameMap[skinType.skinType] = skinType.vietnameseSkinType;
          });
          
          setSkinTypeMappings(nameMap);
          console.log('Loaded skin type mappings:', nameMap);
        }
      } catch (err) {
        console.error('Error fetching skin types:', err);
      }
    };

    fetchSkinTypes();
  }, []);

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
        // Priority 2: Use skin type directly from URL params
        else if (skinTypeParam) {
          console.log('Using skin type from URL params:', skinTypeParam);
          finalSkinType = skinTypeParam;
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
            
            // Get the Vietnamese name of the skin type
            const skinTypeDisplayName = skinTypeMappings[effectiveSkinType] || effectiveSkinType;
            
            // Create dynamic keywords based on the skin type (both code and display name)
            const keywords = [
              effectiveSkinType.toLowerCase(),
              skinTypeDisplayName.toLowerCase(),
              'mọi loại da', 
              'all skin types'
            ];
            
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
  }, [effectiveSkinType, skinTypeLoading, skinTypeMappings]);

  useEffect(() => {
    // Check if user came from direct navigation (not from quiz)
    if (!fromQuiz) {
      setShowScoreSection(false);
    } else {
      setShowScoreSection(true);
    }
  }, [fromQuiz]);

  // Helper function to get display name for skin type
  const getSkinTypeDisplayName = (skinType) => {
    if (!skinType) return 'Không xác định';
    
    // Get name from mappings if available
    return skinTypeMappings[skinType] || skinType;
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
            {skinProducts.map((product) => (
              <div key={product._id} className={cx('product-item-wrapper')}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;