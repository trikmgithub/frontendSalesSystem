import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    
    // Get authentication context
    const { isLoggedIn, openLogin } = useAuth();

    // Load cart items from localStorage when the component mounts
    useEffect(() => {
        const loadCartItems = () => {
            try {
                // Only load cart items if user is logged in
                if (isLoggedIn()) {
                    const savedItems = localStorage.getItem('cartItems');
                    // Check if we have valid cart items (not null string)
                    if (savedItems && savedItems !== 'null') {
                        const parsedItems = JSON.parse(savedItems);
                        console.log("CartContext: Loading cart items:", parsedItems.length);
                        setCartItems(parsedItems);
                    } else {
                        console.log("CartContext: No valid cart items, setting empty array");
                        setCartItems([]);
                    }
                } else {
                    console.log("CartContext: User not logged in, cart empty");
                    setCartItems([]);
                }
            } catch (err) {
                console.error("Error loading cart items:", err);
                setCartItems([]);
            }
        };
        
        loadCartItems();
    }, [isLoggedIn]);

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        // Check if the user is logged in before saving to localStorage
        if (isLoggedIn()) {
            console.log("CartContext: Saving cart items:", cartItems.length);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.log("CartContext: User not logged in, not saving cart");
        }
    }, [cartItems, isLoggedIn]);

    const addToCart = (item) => {
        console.log("CartContext: Add to cart called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("CartContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("CartContext: Login successful, now adding to cart");
                // After login, add item to cart
                addItemToCartInternal(item);
            });
            return;
        }
        
        // User is logged in, add to cart
        console.log("CartContext: User is logged in, adding to cart");
        addItemToCartInternal(item);
    };
    
    // Private method for adding items to cart
    const addItemToCartInternal = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const updateCartItemQuantity = (itemId, quantity) => {
        console.log("CartContext: Update quantity called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("CartContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("CartContext: Login successful, now updating quantity");
                // After login, update quantity
                updateCartItemQuantityInternal(itemId, quantity);
            });
            return;
        }
        
        // User is logged in, update quantity
        console.log("CartContext: User is logged in, updating quantity");
        updateCartItemQuantityInternal(itemId, quantity);
    };
    
    // Private method for updating cart item quantity
    const updateCartItemQuantityInternal = (itemId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem._id === itemId ? { ...cartItem, quantity } : cartItem
            )
        );
    };

    const removeFromCart = (itemId) => {
        console.log("CartContext: Remove from cart called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("CartContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("CartContext: Login successful, now removing from cart");
                // After login, remove from cart
                removeFromCartInternal(itemId);
            });
            return;
        }
        
        // User is logged in, remove from cart
        console.log("CartContext: User is logged in, removing from cart");
        removeFromCartInternal(itemId);
    };
    
    // Private method for removing items from cart
    const removeFromCartInternal = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem._id !== itemId));
    };

    // Clear the entire cart
    const clearCart = () => {
        console.log("CartContext: Clear cart called, isLoggedIn:", isLoggedIn());
        
        // STRICT CHECK: Only proceed if logged in
        if (!isLoggedIn()) {
            console.log("CartContext: Not logged in, showing login popup");
            // Show login popup
            openLogin(() => {
                console.log("CartContext: Login successful, now clearing cart");
                // After login, clear cart
                clearCartInternal();
            });
            return;
        }
        
        // User is logged in, clear cart
        console.log("CartContext: User is logged in, clearing cart");
        clearCartInternal();
    };
    
    // Private method for clearing cart
    const clearCartInternal = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateCartItemQuantity, 
            removeFromCart,
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};