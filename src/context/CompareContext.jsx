import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareItems, setCompareItems] = useState([]);
    const [showCompareBar, setShowCompareBar] = useState(false);
    const [maxCompareItems] = useState(4); // Maximum number of items to compare

    // Get authentication context
    const { isLoggedIn, openLogin } = useAuth();

    // Save compare items to localStorage whenever they change
    useEffect(() => {
        if (compareItems.length > 0) {
            console.log("CompareContext: Saving compare items:", compareItems.length);
            localStorage.setItem('compareItems', JSON.stringify(compareItems));
            
            // Auto-show the compare bar when items are added
            if (!showCompareBar) {
                console.log("CompareContext: Auto-showing compare bar because items exist");
                setShowCompareBar(true);
            }
        } else {
            setShowCompareBar(false);
        }
    }, [compareItems.length]);

    // Load compare items from localStorage when the component mounts
    useEffect(() => {
        const loadCompareItems = () => {
            try {
                const savedItems = localStorage.getItem('compareItems');
                if (savedItems && savedItems !== 'null') {
                    const parsedItems = JSON.parse(savedItems);
                    setCompareItems(parsedItems);
                    // Show compare bar if we have items
                    setShowCompareBar(parsedItems.length > 0);
                } else {
                    console.log("CompareContext: No valid compare items, setting empty array");
                    setCompareItems([]);
                }
            } catch (err) {
                console.error("Error loading compare items:", err);
                setCompareItems([]);
            }
        };

        loadCompareItems();
    }, []);

    // Save compare items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('compareItems', JSON.stringify(compareItems));

        // Update compare bar visibility
        setShowCompareBar(compareItems.length > 0);
    }, [compareItems]);

    const addToCompare = (item) => {
        console.log("CompareContext: Add to compare called, isLoggedIn:", isLoggedIn());

        // Check if the item is already in compare list
        const isItemInCompare = compareItems.some(compareItem => compareItem._id === item._id);

        if (isItemInCompare) {
            toast.info("Sản phẩm đã có trong danh sách so sánh");
            return;
        }

        // Check if we've reached the maximum number of items
        if (compareItems.length >= maxCompareItems) {
            toast.warning(`Bạn chỉ có thể so sánh tối đa ${maxCompareItems} sản phẩm`);
            return;
        }

        // Add the item to the compare list
        setCompareItems(prevItems => {
            const newItems = [...prevItems, item];
            // Store in localStorage immediately to ensure it's saved
            localStorage.setItem('compareItems', JSON.stringify(newItems));
            return newItems;
        });

        toast.success(`${item.name} đã được thêm vào danh sách so sánh`);

        // Show the compare bar when an item is added
        setShowCompareBar(true);
    };

    const removeFromCompare = (itemId) => {
        setCompareItems(prevItems => prevItems.filter(item => item._id !== itemId));
        toast.info("Đã xóa sản phẩm khỏi danh sách so sánh");
    };

    const clearCompare = () => {
        setCompareItems([]);
        setShowCompareBar(false);
        toast.info("Đã xóa tất cả sản phẩm khỏi danh sách so sánh");
    };

    const isInCompare = (itemId) => {
        return compareItems.some(item => item._id === itemId);
    };

    const toggleCompareBar = () => {
        console.log("CompareContext: Toggle compare bar called, current state:", showCompareBar);
        setShowCompareBar(prev => {
            const newState = !prev;
            console.log("CompareContext: New compare bar state:", newState);
            return newState;
        });
    };

    return (
        <CompareContext.Provider value={{
            compareItems,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare,
            showCompareBar,
            toggleCompareBar,
            maxCompareItems
        }}>
            {children}
        </CompareContext.Provider>
    );
};

// Custom hook for using compare context
export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};