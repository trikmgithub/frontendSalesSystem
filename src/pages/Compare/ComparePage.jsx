import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getItemDetail } from '~/services/itemAxios';
import { FaArrowLeft, FaShoppingCart, FaHeart, FaTrash } from 'react-icons/fa';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useCompare } from '~/context/CompareContext';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './ComparePage.module.scss';

const cx = classNames.bind(styles);

const ComparePage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, isInFavorites, removeFromFavorites } = useContext(FavoritesContext);
  const { compareItems, removeFromCompare } = useCompare();

  // Single useEffect for data fetching without causing loops
  useEffect(() => {
    if (fetchCompleted) return; // Prevent re-fetching if already completed
    
    const fetchProducts = async () => {
      console.log("Fetching products once...");
      setLoading(true);
      
      // Get product IDs from URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const productIdsFromUrl = searchParams.get('ids')?.split(',') || [];
      
      console.log("Product IDs from URL:", productIdsFromUrl);
      
      try {
        // First check if we have enough items in compareItems to use directly
        if (productIdsFromUrl.length === 0 && compareItems.length >= 2) {
          console.log("Using compare items from context directly:", compareItems.length);
          setProducts(compareItems);
          setLoading(false);
          setFetchCompleted(true);
          return;
        }
        
        if (productIdsFromUrl.length === 0) {
          setError('No products selected for comparison');
          setLoading(false);
          setFetchCompleted(true);
          return;
        }
        
        // Try fetching from API first
        let validProducts = [];
        
        // Use a for loop instead of Promise.all to handle each product independently
        for (const id of productIdsFromUrl) {
          try {
            console.log(`Fetching product ${id}...`);
            const response = await getItemDetail(id);
            
            // Check if the response has the expected structure
            if (response && 
                response.data && 
                response.data.data && 
                response.data.data.item) {
              
              const product = response.data.data.item;
              
              // Skip deleted products
              if (!product.isDeleted) {
                validProducts.push(product);
              }
            } else {
              console.log(`Product ${id} not found in API response`);
              
              // Try to find the product in compareItems as fallback
              const contextProduct = compareItems.find(item => item._id === id);
              if (contextProduct) {
                console.log(`Found product ${id} in context`);
                validProducts.push(contextProduct);
              }
            }
          } catch (err) {
            console.error(`Error fetching product ${id}:`, err);
            
            // Try to find the product in compareItems as fallback
            const contextProduct = compareItems.find(item => item._id === id);
            if (contextProduct) {
              console.log(`Found product ${id} in context after error`);
              validProducts.push(contextProduct);
            }
          }
        }
        
        // Final fallback: if we don't have at least 2 products, use compareItems
        if (validProducts.length < 2 && compareItems.length >= 2) {
          console.log("Not enough products from API, using all context items");
          validProducts = [...compareItems];
        }
        
        console.log("Final valid products:", validProducts.length);
        
        // Update state with the products we found
        setProducts(validProducts);
        
        // Set error if we still don't have enough products
        if (validProducts.length < 2) {
          setError('Không đủ sản phẩm để so sánh');
        }
      } catch (err) {
        console.error('Error in fetch products flow:', err);
        
        // Final fallback to compareItems
        if (compareItems.length >= 2) {
          console.log("Using compare items after error:", compareItems.length);
          setProducts(compareItems);
        } else {
          setError('Failed to load products for comparison');
        }
      } finally {
        setLoading(false);
        setFetchCompleted(true); // Mark fetching as completed to prevent loops
      }
    };
    
    fetchProducts();
  }, [location.search]); // Only re-run when URL changes, not on any state changes

  // Format price as Vietnamese currency
  const formatPrice = (price) => {
    if (!price) return '0₫';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate original price based on flash sale
  const calculateOriginalPrice = (price, isFlashSale) => {
    if (isFlashSale && price) {
      return Math.round(price / 0.7); // 30% discount
    }
    return null;
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  // Handle toggling product in favorites
  const handleToggleFavorite = (product) => {
    const isFavorite = isInFavorites(product._id);
    
    if (isFavorite) {
      removeFromFavorites(product._id);
      toast.success(`${product.name} đã được xóa khỏi danh sách yêu thích!`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} đã được thêm vào danh sách yêu thích!`);
    }
  };

  // Handle removing product from comparison
  const handleRemoveFromCompare = (productId) => {
    removeFromCompare(productId);
    
    // Update URL to reflect removed product
    const searchParams = new URLSearchParams(location.search);
    const productIds = searchParams.get('ids')?.split(',') || [];
    const updatedIds = productIds.filter(id => id !== productId);
    
    if (updatedIds.length >= 2) {
      // If we still have at least 2 products, update the URL
      window.history.replaceState(
        null, 
        '', 
        `${location.pathname}?ids=${updatedIds.join(',')}`
      );
      
      // Update the products state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    } else {
      // If we have less than 2 products, redirect to home
      toast.info('So sánh cần ít nhất 2 sản phẩm, quay về trang chủ');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className={cx('container')}>
        <div className={cx('loading')}>
          <div className={cx('spinner')}></div>
          <p>Đang tải dữ liệu so sánh...</p>
        </div>
      </div>
    );
  }

  if (error || products.length < 2) {
    return (
      <div className={cx('container')}>
        <div className={cx('error')}>
          <h2>Không đủ sản phẩm để so sánh</h2>
          <p>Cần ít nhất 2 sản phẩm để so sánh.</p>
          <Link to="/" className={cx('backLink')}>
            <FaArrowLeft /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <Link to="/" className={cx('backLink')}>
          <FaArrowLeft /> Quay lại trang chủ
        </Link>
        <h1 className={cx('title')}>So sánh sản phẩm</h1>
      </div>
      
      <div className={cx('compareTable')}>
        {/* Table header with product images and basic info */}
        <div className={cx('tableHeader')}>
          <div className={cx('headerCell', 'featureCell')}>
            <span>Thông tin sản phẩm</span>
          </div>
          
          {products.map((product) => {
            const originalPrice = calculateOriginalPrice(product.price, product.flashSale);
            
            return (
              <div key={product._id} className={cx('headerCell', 'productCell')}>
                <div className={cx('productHeader')}>
                  <div className={cx('productActions')}>
                    <button 
                      className={cx('actionButton', 'removeButton')}
                      onClick={() => handleRemoveFromCompare(product._id)}
                      title="Xóa khỏi so sánh"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      className={cx('actionButton', 'favButton', { active: isInFavorites(product._id) })}
                      onClick={() => handleToggleFavorite(product)}
                      title={isInFavorites(product._id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                    >
                      <FaHeart />
                    </button>
                    <button 
                      className={cx('actionButton', 'cartButton')}
                      onClick={() => handleAddToCart(product)}
                      title="Thêm vào giỏ hàng"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                  
                  <div className={cx('productImage')}>
                    <img 
                      src={product.imageUrls?.[0] || "https://via.placeholder.com/150x150?text=No+Image"} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150x150?text=No+Image";
                      }}
                    />
                  </div>
                  
                  <div className={cx('productInfo')}>
                    <div className={cx('productBrand')}>{product.brand?.name || "Không có thương hiệu"}</div>
                    <h3 className={cx('productName')}>{product.name}</h3>
                    <div className={cx('productPrice')}>
                      <span className={cx('currentPrice')}>{formatPrice(product.price)}</span>
                      {originalPrice && (
                        <span className={cx('originalPrice')}>{formatPrice(originalPrice)}</span>
                      )}
                    </div>
                    <Link to={`/product/${product._id}`} className={cx('viewDetailButton')}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Table body with product specifications */}
        <div className={cx('tableBody')}>
          {/* Price row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Giá bán</span>
            </div>
            
            {products.map((product) => (
              <div key={`price-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span className={cx('price')}>{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
          
          {/* Stock status row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Trạng thái</span>
            </div>
            
            {products.map((product) => (
              <div key={`stock-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span className={cx('stockStatus', { inStock: product.stock })}>
                  {product.stock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Brand row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Thương hiệu</span>
            </div>
            
            {products.map((product) => (
              <div key={`brand-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span>{product.brand?.name || "Không có thương hiệu"}</span>
              </div>
            ))}
          </div>
          
          {/* Description row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Mô tả</span>
            </div>
            
            {products.map((product) => (
              <div key={`description-${product._id}`} className={cx('rowCell', 'dataCell', 'descriptionCell')}>
                <div className={cx('description')}>
                  {product.description || "Không có mô tả"}
                </div>
              </div>
            ))}
          </div>
          
          {/* Flash Sale row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Khuyến mãi</span>
            </div>
            
            {products.map((product) => (
              <div key={`flash-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span className={cx('flashSale', { active: product.flashSale })}>
                  {product.flashSale ? 'Đang giảm giá' : 'Không có khuyến mãi'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Quantity/Stock row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Số lượng</span>
            </div>
            
            {products.map((product) => (
              <div key={`quantity-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span>{product.quantity || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action buttons at the bottom */}
      <div className={cx('actionButtons')}>
        <Link to="/" className={cx('continueShoppingButton')}>
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;