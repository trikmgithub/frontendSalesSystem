import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favoriteItems, setFavoriteItems] = useState(() => {
        const savedFavorites = localStorage.getItem('favoriteItems');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    }, [favoriteItems]);

    const addToFavorites = (item) => {
        setFavoriteItems((prevItems) => {
            const existingItem = prevItems.find((favItem) => favItem._id === item._id);
            if (existingItem) {
                // Item already in favorites, do nothing
                return prevItems;
            } else {
                return [...prevItems, { ...item }];
            }
        });
    };

    const removeFromFavorites = (itemId) => {
        setFavoriteItems((prevItems) => prevItems.filter((favItem) => favItem._id !== itemId));
    };

    const clearFavorites = () => {
        setFavoriteItems([]);
        localStorage.setItem('favoriteItems', JSON.stringify([]));
    };

    const isInFavorites = (itemId) => {
        return favoriteItems.some(item => item._id === itemId);
    };

    return (
        <FavoritesContext.Provider value={{ 
            favoriteItems, 
            addToFavorites, 
            removeFromFavorites,
            clearFavorites,
            isInFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};