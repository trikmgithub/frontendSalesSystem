import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    
    // Get authentication context
    const { isLoggedIn, openLogin } = useAuth();

    // Load favorite items from localStorage when the component mounts
    useEffect(() => {
        const loadFavorites = () => {
            try {
                // Only load favorites if user is logged in
                if (isLoggedIn()) {
                    const savedItems = localStorage.getItem('favoriteItems');
                    // Check if we have valid favorites (not null string)
                    if (savedItems && savedItems !== 'null') {
                        const parsedItems = JSON.parse(savedItems);
                        setFavoriteItems(parsedItems);
                    } else {
                        setFavoriteItems([]);
                    }
                } else {
                    setFavoriteItems([]);
                }
            } catch (err) {
                console.error("Error loading favorites:", err);
                setFavoriteItems([]);
            }
        };
        
        loadFavorites();
    }, [isLoggedIn]);

    // Save favorite items to localStorage whenever they change
    useEffect(() => {
        // Check if the user is logged in before saving to localStorage
        if (isLoggedIn()) {
            localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
        } else {
        }
    }, [favoriteItems, isLoggedIn]);

    const addToFavorites = (item) => {
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            // Show login popup
            openLogin(() => {
                // After login, add to favorites
                addToFavoritesInternal(item);
            });
            return;
        }
        
        // User is logged in, add to favorites
        addToFavoritesInternal(item);
    };
    
    // Private method for adding to favorites
    const addToFavoritesInternal = (item) => {
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
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            // Show login popup
            openLogin(() => {
                // After login, remove from favorites
                removeFromFavoritesInternal(itemId);
            });
            return;
        }
        
        // User is logged in, remove from favorites
        removeFromFavoritesInternal(itemId);
    };
    
    // Private method for removing from favorites
    const removeFromFavoritesInternal = (itemId) => {
        setFavoriteItems((prevItems) => prevItems.filter((favItem) => favItem._id !== itemId));
    };

    const clearFavorites = () => {
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            // Show login popup
            openLogin(() => {
                // After login, clear favorites
                clearFavoritesInternal();
            });
            return;
        }
        
        // User is logged in, clear favorites
        clearFavoritesInternal();
    };
    
    // Private method for clearing favorites
    const clearFavoritesInternal = () => {
        setFavoriteItems([]);
    };

    const isInFavorites = (itemId) => {
        // This function is special: it needs to always return the right answer
        // regardless of login state, because UI elements need to know the favorite status
        
        // Only check favorites if the user is logged in
        if (!isLoggedIn()) {
            return false;
        }
        
        // User is logged in, check if item is in favorites
        const result = favoriteItems.some(item => item._id === itemId);
        return result;
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