import { useEffect, useState } from 'react';
import { getItemsAxios } from '~/services/itemAxios';

function Home() {
    const [items, setItems] = useState([]); // State để lưu danh sách items
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getItemsAxios(); // Gọi API
                if (response.statusCode === 200) {
                    setItems(response.data); // Lưu danh sách items
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

    return (
        <div>
            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Description: {item.description}</p>
                        <p>
                            Brand: {item.brand.name} ({item.brand.description})
                        </p>
                        <p>Stock: {item.stock ? 'In Stock' : 'Out of Stock'}</p>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
