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
                        console.log("FavoritesContext: Loading favorites:", parsedItems.length);
                        setFavoriteItems(parsedItems);
                    } else {
                        console.log("FavoritesContext: No valid favorites, setting empty array");
                        setFavoriteItems([]);
                    }
                } else {
                    console.log("FavoritesContext: User not logged in, favorites empty");
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
            console.log("FavoritesContext: Saving favorites:", favoriteItems.length);
            localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
        } else {
            console.log("FavoritesContext: User not logged in, not saving favorites");
        }
    }, [favoriteItems, isLoggedIn]);

    const addToFavorites = (item) => {
        console.log("FavoritesContext: Add to favorites called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("FavoritesContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("FavoritesContext: Login successful, now adding to favorites");
                // After login, add to favorites
                addToFavoritesInternal(item);
            });
            return;
        }
        
        // User is logged in, add to favorites
        console.log("FavoritesContext: User is logged in, adding to favorites");
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
        console.log("FavoritesContext: Remove from favorites called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("FavoritesContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("FavoritesContext: Login successful, now removing from favorites");
                // After login, remove from favorites
                removeFromFavoritesInternal(itemId);
            });
            return;
        }
        
        // User is logged in, remove from favorites
        console.log("FavoritesContext: User is logged in, removing from favorites");
        removeFromFavoritesInternal(itemId);
    };
    
    // Private method for removing from favorites
    const removeFromFavoritesInternal = (itemId) => {
        setFavoriteItems((prevItems) => prevItems.filter((favItem) => favItem._id !== itemId));
    };

    const clearFavorites = () => {
        console.log("FavoritesContext: Clear favorites called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("FavoritesContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("FavoritesContext: Login successful, now clearing favorites");
                // After login, clear favorites
                clearFavoritesInternal();
            });
            return;
        }
        
        // User is logged in, clear favorites
        console.log("FavoritesContext: User is logged in, clearing favorites");
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
            console.log("FavoritesContext: isInFavorites - user not logged in, returning false");
            return false;
        }
        
        // User is logged in, check if item is in favorites
        const result = favoriteItems.some(item => item._id === itemId);
        console.log(`FavoritesContext: isInFavorites - item ${itemId} is ${result ? '' : 'not'} in favorites`);
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