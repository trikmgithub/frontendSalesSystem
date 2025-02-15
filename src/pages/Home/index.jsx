import { useEffect, useState, useContext } from 'react';
import { getItemsAxios } from '~/services/itemAxios';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { CartContext } from '~/context/CartContext';

const cx = classNames.bind(styles);

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { addToCart } = useContext(CartContext);
    const itemsPerPage = 18;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getItemsAxios();
                if (response.statusCode === 200) {
                    setItems(response.data);
                } else {
                    setError(response.message || 'Failed to fetch items');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('productGrid')}>
                    {currentItems.map((item) => (
                        <div key={item._id} className={cx('productCard')}>
                            <Link to={`/product/${item._id}`} className={cx('productLink')}>
                                <div className={cx('productInfo')}>
                                    <h3 className={cx('productName')}>{item.name}</h3>
                                    <div className={cx('priceSection')}>
                                        <div className={cx('currentPrice')}>
                                            {item.price.toLocaleString()}đ
                                        </div>
                                    </div>
                                    <div className={cx('stockStatus')}>
                                        {item.stock ? 'Còn hàng' : 'Hết hàng'}
                                    </div>
                                </div>
                            </Link>
                            <button onClick={() => addToCart(item)} className={cx('addToCartButton')}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className={cx('pagination')}>
                        {/* Pagination content */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
