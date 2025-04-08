import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './ComparePage.module.scss';
import { CartContext } from '~/context/CartContext';
import { FavoritesContext } from '~/context/FavoritesContext';
import { useCompare } from '~/context/CompareContext';
import { getItemDetail } from '~/services/itemAxios';

const cx = classNames.bind(styles);

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, isInFavorites, removeFromFavorites } = useContext(FavoritesContext);
  const { compareItems, removeFromCompare } = useCompare();

  // Listen for changes to compareItems in the context
  useEffect(() => {
    // Only update products if we have already fetched them once
    // and if compareItems has changed
    if (fetchCompleted && compareItems) {
      // Get current product IDs
      const currentProductIds = products.map(product => product._id);
      // Get compare item IDs
      const compareItemIds = compareItems.map(item => item._id);
      
      // Find products that should be removed (in products but not in compareItems)
      const productsToRemove = products.filter(
        product => !compareItemIds.includes(product._id)
      );
      
      // If products need to be removed, update the state
      if (productsToRemove.length > 0) {
        // Filter out removed products
        const updatedProducts = products.filter(
          product => compareItemIds.includes(product._id)
        );
        
        // Update the URL with remaining product IDs
        if (updatedProducts.length >= 2) {
          window.history.replaceState(
            null, 
            '', 
            `${location.pathname}?ids=${updatedProducts.map(p => p._id).join(',')}`
          );
          setProducts(updatedProducts);
        } else {
          // If fewer than 2 products remain, redirect to home
          toast.info('So sánh cần ít nhất 2 sản phẩm, quay về trang chủ');
          navigate('/');
        }
      }
    }
  }, [compareItems, fetchCompleted, products]);

  // Single useEffect for data fetching without causing loops
  useEffect(() => {
    if (fetchCompleted) return;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Parse IDs from URL
        const searchParams = new URLSearchParams(location.search);
        const productIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
        
        // Validate we have at least 2 valid IDs
        if (productIds.length < 2) {
          setError('Need at least 2 products to compare');
          setLoading(false);
          setFetchCompleted(true);
          return;
        }
        
        // Fetch detailed product data for each ID
        const validProducts = [];
        
        for (const id of productIds) {
          try {
            const response = await getItemDetail(id);
            
            // Check if the response contains the item data with the new format
            if (response && response.data && response.data.item) {
              validProducts.push(response.data.item);
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
        
        // Update state with the products we found
        setProducts(validProducts);
        
        // Set error if we don't have enough products
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
                    {product.isOnSale && product.flashSale > 0 && (
                      <span className={cx('saleTag')}>-{product.flashSale}%</span>
                    )}
                  </div>
                  
                  <div className={cx('productInfo')}>
                    <div className={cx('productBrand')}>{product.brand?.name || "Không có thương hiệu"}</div>
                    <h3 className={cx('productName')}>{product.name}</h3>
                    <div className={cx('productPrice')}>
                      {product.isOnSale && product.discountedPrice ? (
                        <>
                          <span className={cx('currentPrice')}>{formatPrice(product.discountedPrice)}</span>
                          <span className={cx('originalPrice')}>{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className={cx('currentPrice')}>{formatPrice(product.price)}</span>
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
                {product.isOnSale && product.discountedPrice ? (
                  <div className={cx('priceWrapper')}>
                    <span className={cx('discountedPrice')}>{formatPrice(product.discountedPrice)}</span>
                    <span className={cx('originalPriceStrikethrough')}>{formatPrice(product.price)}</span>
                    <span className={cx('discountPercentage')}>Giảm {product.flashSale}%</span>
                  </div>
                ) : (
                  <span className={cx('price')}>{formatPrice(product.price)}</span>
                )}
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
          
          {/* Brand description row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Mô tả thương hiệu</span>
            </div>
            
            {products.map((product) => (
              <div key={`brand-desc-${product._id}`} className={cx('rowCell', 'dataCell', 'descriptionCell')}>
                <div className={cx('description')}>
                  {product.brand?.description || "Không có mô tả thương hiệu"}
                </div>
              </div>
            ))}
          </div>
          
          {/* Description row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Mô tả sản phẩm</span>
            </div>
            
            {products.map((product) => (
              <div key={`description-${product._id}`} className={cx('rowCell', 'dataCell', 'descriptionCell')}>
                <div className={cx('description')}>
                  {product.description || "Không có mô tả"}
                </div>
              </div>
            ))}
          </div>
          
          {/* Sale status row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Trạng thái khuyến mãi</span>
            </div>
            
            {products.map((product) => (
              <div key={`sale-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span className={cx('saleStatus', { active: product.isOnSale })}>
                  {product.isOnSale ? `Giảm ${product.flashSale}%` : 'Không có khuyến mãi'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Quantity/Stock row */}
          <div className={cx('tableRow')}>
            <div className={cx('rowCell', 'featureCell')}>
              <span>Số lượng trong kho</span>
            </div>
            
            {products.map((product) => (
              <div key={`quantity-${product._id}`} className={cx('rowCell', 'dataCell')}>
                <span>{product.quantity || 0} sản phẩm</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;