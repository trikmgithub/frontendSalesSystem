import React, { createContext, useState, useEffect } from 'react';
import { 
    getFavoriteItemsAxios, 
    addToFavoritesAxios, 
    removeFromFavoritesAxios 
} from '~/services/userAxios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isLoggedIn()) {
                setFavoriteItems([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getFavoriteItemsAxios();

                if (!response.error) {
                    if (Array.isArray(response)) {
                        setFavoriteItems(response);
                    } 
                    else if (response.items && Array.isArray(response.items)) {
                        setFavoriteItems(response.items);
                    }
                    else if (response.data && Array.isArray(response.data)) {
                        setFavoriteItems(response.data);
                    } else {
                        setFavoriteItems([]);
                    }
                } else {
                    
                    setFavoriteItems([]);
                }
            } catch (error) {
                
                setFavoriteItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [isLoggedIn]);

    const addToFavorites = async (item) => {
        if (!isLoggedIn()) {
          toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
          return false;
        }
      
        try {
          // Check if we have user data in localStorage
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (!userData._id) {
            toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return false;
          }
      
          const response = await addToFavoritesAxios(item._id);
      
          if (!response.error) {
            setFavoriteItems(prev => [...prev, item]);
            return true;
          } else {
            toast.error(response.message || 'Không thể thêm vào danh sách yêu thích');
            return false;
          }
        } catch (error) {
          toast.error('Không thể thêm vào danh sách yêu thích');
          return false;
        }
      };

    const removeFromFavorites = async (itemId) => {
        if (!isLoggedIn()) {
            toast.error('Vui lòng đăng nhập để xóa khỏi danh sách yêu thích');
            return false;
        }

        try {
            const response = await removeFromFavoritesAxios(itemId);

            if (!response.error) {
                setFavoriteItems(prev => prev.filter(item => item._id !== itemId));
                return true;
            } else {
                toast.error(response.message || 'Không thể xóa khỏi danh sách yêu thích');
                return false;
            }
        } catch (error) {
            toast.error('Không thể xóa khỏi danh sách yêu thích');
            return false;
        }
    };

    const isInFavorites = (itemId) => {
        return favoriteItems.some(item => item._id === itemId);
    };

    return (
        <FavoritesContext.Provider value={{
            favoriteItems,
            loading,
            addToFavorites,
            removeFromFavorites,
            isInFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};