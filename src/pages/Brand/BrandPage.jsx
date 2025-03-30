import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemsAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './BrandPage.module.scss';
import ProductCard from '~/components/ProductCard';
import { useCompare } from '~/context/CompareContext';

const cx = classNames.bind(styles);

function BrandPage() {
    const { id } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [brandProducts, setBrandProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCompare } = useCompare();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // 15 products per page
    const [totalPages, setTotalPages] = useState(1);

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
                
                // Calculate total pages
                setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
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

    // Function to get current products based on pagination
    const getCurrentProducts = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return brandProducts.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
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

    // Get current page products
    const currentProducts = getCurrentProducts();

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
                    {currentProducts.map((product) => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            onAddToCompare={() => addToCompare(product)}
                        />
                    ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={cx('pagination')}>
                        {/* Previous page button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={cx('paginationButton', 'navButton')}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>

                        {/* Pagination logic */}
                        {(() => {
                            // Create array to hold page numbers we want to display
                            const pagesToShow = [];

                            // Always show current page
                            pagesToShow.push(currentPage);

                            // Add pages before current page (up to 2)
                            for (let i = 1; i <= 2; i++) {
                                if (currentPage - i > 0) {
                                    pagesToShow.unshift(currentPage - i);
                                }
                            }

                            // Add pages after current page (up to 2)
                            for (let i = 1; i <= 2; i++) {
                                if (currentPage + i <= totalPages) {
                                    pagesToShow.push(currentPage + i);
                                }
                            }

                            // Always add first page if not already included
                            if (!pagesToShow.includes(1)) {
                                pagesToShow.unshift(1);

                                // Add ellipsis after first page if there's a gap
                                if (pagesToShow[1] > 2) {
                                    pagesToShow.splice(1, 0, 'ellipsis-start');
                                }
                            }

                            // Always add last page if not already included and if it's not the only page
                            if (!pagesToShow.includes(totalPages) && totalPages > 1) {
                                // Add ellipsis before last page if there's a gap
                                if (pagesToShow[pagesToShow.length - 1] < totalPages - 1) {
                                    pagesToShow.push('ellipsis-end');
                                }
                                pagesToShow.push(totalPages);
                            }

                            // Render the page buttons and ellipses
                            return pagesToShow.map((page, index) => {
                                // Render ellipsis
                                if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                    return (
                                        <span key={`ellipsis-${index}`} className={cx('paginationEllipsis')}>...</span>
                                    );
                                }

                                // Render page button
                                return (
                                    <button
                                        key={`page-${page}`}
                                        onClick={() => handlePageChange(page)}
                                        className={cx('paginationButton', { active: currentPage === page })}
                                    >
                                        {page}
                                    </button>
                                );
                            });
                        })()}

                        {/* Next page button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={cx('paginationButton', 'navButton')}
                            disabled={currentPage === totalPages}
                        >
                            &raquo;
                        </button>
                    </div>
                )}

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