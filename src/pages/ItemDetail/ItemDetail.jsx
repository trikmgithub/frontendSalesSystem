import { useState, useEffect } from 'react';
import { getItemDetail } from '~/services/itemAxios';

function ItemDetail({ itemId = '67c035d569d24a62c05087b4' }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!itemId) return;

        setLoading(true);
        getItemDetail(itemId)
            .then((response) => {
                console.log(response);
                setItem(response.data.item);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [itemId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!item) return <p>No item found</p>;

    return (
        <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <strong>Price: ${item.price}</strong>
        </div>
    );
}

export default ItemDetail;
