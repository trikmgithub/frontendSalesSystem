import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
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
        setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem._id === itemId ? { ...cartItem, quantity } : cartItem
            )
        );
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem._id !== itemId));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateCartItemQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};