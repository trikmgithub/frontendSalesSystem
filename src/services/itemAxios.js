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
        const res = await axiosConfig.get(`items/fuzzy/${searchTerm}`);
        return res;
    } catch (error) {
        console.log('Error searching items:', error);
        throw new Error(error);
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

export { 
    getItemsAxios, 
    getItemsPaginatedAxios, 
    getItemDetail,
    searchItemsAxios,
    createItemAxios,
    updateItemAxios,
    deleteItemAxios
};