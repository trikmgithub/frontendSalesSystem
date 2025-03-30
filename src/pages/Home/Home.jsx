import { useEffect, useState } from 'react';
import { getItemsPaginatedAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import ProductCard from '~/components/ProductCard';
import { useCompare } from '~/context/CompareContext';

const cx = classNames.bind(styles);

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(15); // Updated to show 15 items per page
    const { addToCompare } = useCompare();

    useEffect(() => {
        fetchItems(currentPage);
    }, [currentPage]);

    const fetchItems = async (page) => {
        setLoading(true);
        try {
            const response = await getItemsPaginatedAxios(page, itemsPerPage);

            if (response && response.statusCode === 200) {
                // Extract data from the correct path in the response
                const { result, meta } = response.data.paginateItem;
                setItems(result);
                setTotalPages(parseInt(meta.totalPages));
                setTotalItems(parseInt(meta.numberItems));
            } else {
                setError(response?.message || 'Failed to fetch items');
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Could not load data from server');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (loading && items.length === 0) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {error && (
                <div className={cx('error-notification')}>
                    <p>{error}</p>
                </div>
            )}
            <div className={cx('container')}>
                <div className={cx('productGrid')}>
                    {items.map((item) => (
                        <ProductCard 
                            key={item._id} 
                            product={item} 
                            onAddToCompare={() => addToCompare(item)}
                        />
                    ))}
                </div>

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

                        {/* Improved pagination logic */}
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

                {loading && items.length > 0 && (
                    <div className={cx('loading-overlay')}>
                        <div className={cx('loading-spinner')}></div>
                        <p>Đang tải...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;