// src/pages/SearchResults/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import styles from './SearchResults.module.scss';
import ProductCard from '~/components/ProductCard';
import LoadingSpinner from '~/components/LoadingSpinner';
import { FilterBar } from '~/components/FilterBar';
import { getItemsPaginatedAxios, searchItemsAxios } from '~/services/itemAxios';
import { useCompare } from '~/context/CompareContext';

const cx = classNames.bind(styles);

function SearchResults() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    
    // Get the compare context
    const { addToCompare } = useCompare();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use the searchItemsAxios service function instead of direct axios call
                const response = await searchItemsAxios(keyword);
                
                // Check if data is in the expected format
                if (response && response.data) {
                    // Check if the response has a data property that's an array (the items)
                    const itemsArray = Array.isArray(response.data) ? response.data : 
                                      (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
                    
                    // Filter out deleted items
                    const filteredProducts = itemsArray.filter(item => !item.isDeleted);
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
                    const response = await getItemsPaginatedAxios(1, 20);
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

    const handleFilterChange = (filters) => {
        if (filters.priceRange) {
            setPriceRange(filters.priceRange);
        }
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

    const filteredProducts = getFilteredProducts();

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

            <FilterBar 
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
            />

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
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onAddToCompare={() => addToCompare(product)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResults;