// src/pages/SearchResults/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { FaFilter, FaSort } from 'react-icons/fa';
import axios from 'axios';

import styles from './SearchResults.module.scss';
import ProductCard from '~/components/ProductCard';
import LoadingSpinner from '~/components/LoadingSpinner';
import { getItemsPaginatedAxios } from '~/services/itemAxios';

const cx = classNames.bind(styles);

function SearchResults() {
    const { query } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('q') || query || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [filterFlashSale, setFilterFlashSale] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use the API endpoint for fuzzy search
                const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8000/api/v1';
                const response = await axios.get(`${API_BASE_URL}/items/fuzzy/${keyword}`);
                
                // Check if data is in the expected format
                if (response.data && response.data.data) {
                    // Filter out items marked as deleted
                    const filteredProducts = response.data.data.filter(item => !item.isDeleted);
                    setProducts(filteredProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products. Please try again later.');
                toast.error('Error loading search results');
            } finally {
                setLoading(false);
            }
        };

        if (keyword) {
            fetchProducts();
        } else {
            // If no keyword provided, load paginated products instead
            const loadDefaultProducts = async () => {
                try {
                    setLoading(true);
                    const response = await getItemsPaginatedAxios(1, 18);
                    if (response && response.data) {
                        setProducts(response.data.filter(item => !item.isDeleted));
                    } else {
                        setProducts([]);
                    }
                } catch (err) {
                    console.error('Failed to fetch default products:', err);
                    setError('Failed to load products. Please try again later.');
                    toast.error('Error loading products');
                } finally {
                    setLoading(false);
                }
            };
            
            loadDefaultProducts();
        }
    }, [keyword]);

    // Apply filters and sorting
    const getFilteredProducts = () => {
        let filtered = [...products];

        // Apply price range filter
        filtered = filtered.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => 
                selectedBrands.includes(product.brand?._id || product.brand?.name)
            );
        }

        // Apply flash sale filter
        if (filterFlashSale) {
            filtered = filtered.filter(product => product.flashSale);
        }

        // Apply sorting
        if (sortOrder === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'name-desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    // Get unique brands from products for filter
    const availableBrands = [...new Set(products.map(product => product.brand?._id))].filter(Boolean);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handlePriceChange = (e, index) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(e.target.value) || 0;
        setPriceRange(newRange);
    };

    const handleBrandChange = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter(id => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1 className={cx('title')}>
                    {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Tất cả sản phẩm'}
                </h1>
                <div className={cx('resultCount')}>
                    {filteredProducts.length} sản phẩm được tìm thấy
                </div>
            </div>

            <div className={cx('filterSortControls')}>
                <button className={cx('filterToggle')} onClick={toggleFilters}>
                    <FaFilter /> Lọc
                </button>
                <div className={cx('sortControl')}>
                    <label htmlFor="sortOrder">
                        <FaSort /> Sắp xếp:
                    </label>
                    <select 
                        id="sortOrder" 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                        className={cx('sortSelect')}
                    >
                        <option value="default">Mặc định</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="name-asc">Tên: A-Z</option>
                        <option value="name-desc">Tên: Z-A</option>
                    </select>
                </div>
            </div>

            <div className={cx('content')}>
                {showFilters && (
                    <div className={cx('mobileFilters')}>
                        <div className={cx('filterSection')}>
                            <h3>Giá</h3>
                            <div className={cx('priceRange')}>
                                <input 
                                    type="number" 
                                    value={priceRange[0]} 
                                    onChange={(e) => handlePriceChange(e, 0)}
                                    placeholder="Từ"
                                />
                                <span>-</span>
                                <input 
                                    type="number" 
                                    value={priceRange[1]} 
                                    onChange={(e) => handlePriceChange(e, 1)}
                                    placeholder="Đến"
                                />
                            </div>
                        </div>

                        <div className={cx('filterSection')}>
                            <h3>Thương hiệu</h3>
                            <div className={cx('brandList')}>
                                {availableBrands.map(brandId => {
                                    const brand = products.find(p => p.brand?._id === brandId)?.brand;
                                    return brand ? (
                                        <div key={brandId} className={cx('brandItem')}>
                                            <input 
                                                type="checkbox" 
                                                id={`brand-${brandId}`}
                                                checked={selectedBrands.includes(brandId)}
                                                onChange={() => handleBrandChange(brandId)}
                                            />
                                            <label htmlFor={`brand-${brandId}`}>{brand.name}</label>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        <div className={cx('filterSection')}>
                            <h3>Khuyến mãi</h3>
                            <div className={cx('saleFilter')}>
                                <input 
                                    type="checkbox" 
                                    id="flashSale"
                                    checked={filterFlashSale}
                                    onChange={() => setFilterFlashSale(!filterFlashSale)}
                                />
                                <label htmlFor="flashSale">Flash Sale</label>
                            </div>
                        </div>
                    </div>
                )}

                <div className={cx('resultsContainer')}>
                    {loading ? (
                        <div className={cx('loadingContainer')}>
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className={cx('errorContainer')}>
                            <p>{error}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className={cx('emptyContainer')}>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    ) : (
                        <div className={cx('productsGrid')}>
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;