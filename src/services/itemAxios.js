// src/services/itemAxios.js - Updated without hide functionality

import * as axiosConfig from '~/utils/axiosConfig';

// Get all items (without pagination)
const getItemsAxios = async () => {
    try {
        const res = await axiosConfig.get('items/all');
        return res;
    } catch (error) {
        console.log('Error at itemAxios.js');
        throw new Error(error);
    }
};

// Get item detail
const getItemDetail = async (itemId) => {
    try {
        const res = await axiosConfig.get(`items/${itemId}`);
        return res;
    } catch (error) {
        console.log('Error at itemAxios.js');
        throw new Error(error);
    }
};

// Get paginated items
const getItemsPaginatedAxios = async (page = 1, limit = 18) => {
    try {
        const res = await axiosConfig.get(`items/paginate?page=${page}&limit=${limit}`);
        return res;
    } catch (error) {
        console.log('Error fetching paginated items:', error);
        throw new Error(error);
    }
};

// Search items by name using fuzzy search
const searchItemsAxios = async (searchTerm) => {
    try {
        // Using path parameter as shown in the API documentation
        // Ensure searchTerm is properly encoded to handle spaces and special characters
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const res = await axiosConfig.get(`items/fuzzy/${encodedSearchTerm}`);
        return res;
    } catch (error) {
        console.log('Error searching items:', error);
        throw error;
    }
};

// Create new item with FormData for images
const createItemAxios = async (itemData) => {
    try {
        // Create FormData object for multipart/form-data
        const formData = new FormData();
        
        // Add text fields exactly matching the API expectations
        formData.append('name', itemData.name);
        formData.append('price', itemData.price);
        formData.append('description', itemData.description);
        formData.append('quantity', itemData.quantity);
        formData.append('flashSale', itemData.flashSale.toString());
        
        // Add brand as plain text (the ID string)
        formData.append('brand', itemData.brand._id);
        
        // Add image files to the "files" field (which accepts multiple files)
        if (itemData.images && itemData.images.length > 0) {
            itemData.images.forEach(file => {
                formData.append('files', file);
            });
        }
        
        // Use custom config to handle multipart/form-data
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        
        const res = await axiosConfig.post('items/create', formData, config);
        return res;
    } catch (error) {
        console.log('Error creating item:', error);
        throw new Error(error);
    }
};

// Update item with x-www-form-urlencoded format
const updateItemAxios = async (itemId, itemData) => {
    try {
        // For PATCH requests, the API expects form-urlencoded data
        const formData = new URLSearchParams();
        
        // Add fields exactly as shown in Postman
        formData.append('name', itemData.name);
        formData.append('price', itemData.price);
        formData.append('description', itemData.description);
        formData.append('quantity', itemData.quantity);
        formData.append('flashSale', itemData.flashSale.toString()); // Add flashSale parameter
        
        // Add brand as the ID string directly (not as an object)
        formData.append('brand', itemData.brand._id);
        
        // Set the correct content type for x-www-form-urlencoded
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        const res = await axiosConfig.patch(`items/${itemId}`, formData, config);
        return res;
    } catch (error) {
        console.log('Error updating item:', error);
        throw new Error(error);
    }
};

// Delete item
const deleteItemAxios = async (itemId) => {
    try {
        const res = await axiosConfig.del(`items/${itemId}`);
        return res;
    } catch (error) {
        console.log('Error deleting item:', error);
        throw new Error(error);
    }
};

const getSkinProductsAxios = async (skinType) => {
    try {
        const res = await axiosConfig.get(`items/skin?type=${encodeURIComponent(skinType)}`);
        return res;
    } catch (error) {
        console.error('Error fetching skin products:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch skin products',
            status: error.response?.status,
            data: [] // Return empty array in case of error
        };
    }
};

const checkUserSkinTypeAxios = async () => {
    try {
        // Call the API to get products based on user's skin type
        const res = await axiosConfig.get('items/skin');
        
        // If successful, extract the skin type from the data
        // We can infer the skin type from the product recommendations
        // This assumes that products are organized by skin type
        if (res.data && res.data.length > 0) {
            // Determine skin type from the response (based on product descriptions)
            const skinTypeMap = {
                'Da Dầu': 'oily',
                'Da Hỗn Hợp': 'combination',
                'Da Thường': 'normal',
                'Da Khô': 'dry'
            };
            
            // Look for skin type mentions in product descriptions
            let detectedSkinType = null;
            
            // Check each product description for skin type mentions
            for (const product of res.data) {
                if (!product.description) continue;
                
                const description = product.description.toLowerCase();
                
                if (description.includes('da dầu')) {
                    detectedSkinType = 'oily';
                    break;
                } else if (description.includes('da hỗn hợp')) {
                    detectedSkinType = 'combination';
                    break;
                } else if (description.includes('da thường')) {
                    detectedSkinType = 'normal';
                    break;
                } else if (description.includes('da khô')) {
                    detectedSkinType = 'dry';
                    break;
                }
            }
            
            // Default to 'normal' if we couldn't detect it
            return {
                hasTakenQuiz: true,
                skinType: detectedSkinType || 'normal',
                data: res.data
            };
        }
        
        return {
            hasTakenQuiz: true,
            skinType: 'normal', // Default to normal if we can't determine
            data: res.data
        };
    } catch (error) {
        // If we get a 500 error, user hasn't taken the quiz
        if (error.response && error.response.status === 500) {
            return {
                hasTakenQuiz: false,
                error: true,
                message: 'User has not taken skin quiz'
            };
        }
        
        // For other errors
        console.error('Error checking user skin type:', error);
        return {
            hasTakenQuiz: false,
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to check skin type'
        };
    }
};

export { 
    getItemsAxios, 
    getItemsPaginatedAxios, 
    getItemDetail,
    searchItemsAxios,
    createItemAxios,
    updateItemAxios,
    deleteItemAxios,
    getSkinProductsAxios,
    checkUserSkinTypeAxios
};