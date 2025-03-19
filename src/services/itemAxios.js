// src/services/itemAxios.js - Extended with additional CRUD functions

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

// Create new item
const createItemAxios = async (itemData) => {
    try {
        // Format the request body according to API requirements
        const requestData = {
            name: itemData.name,
            price: itemData.price,
            description: itemData.description,
            brand: itemData.brand,
            quantity: itemData.quantity,
            flashSale: itemData.flashSale,
            imageUrls: itemData.imageUrls
        };
        
        const res = await axiosConfig.post('items/create', requestData);
        return res;
    } catch (error) {
        console.log('Error creating item:', error);
        throw new Error(error);
    }
};

// Update item
const updateItemAxios = async (itemId, itemData) => {
    try {
        // Format the request body according to API requirements
        const requestData = {
            name: itemData.name,
            price: itemData.price,
            description: itemData.description,
            brand: itemData.brand,
            quantity: itemData.quantity
            // Note: flashSale is not included in the update request
        };
        
        const res = await axiosConfig.patch(`items/${itemId}`, requestData);
        return res;
    } catch (error) {
        console.log('Error updating item:', error);
        throw new Error(error);
    }
};

// Delete item
const deleteItemAxios = async (itemId) => {
    try {
        const res = await axiosConfig.delete(`items/${itemId}`);
        return res;
    } catch (error) {
        console.log('Error deleting item:', error);
        throw new Error(error);
    }
};

// Hide/Show item (soft delete)
const hideItemAxios = async (itemId, hideStatus = true) => {
    try {
        const res = await axiosConfig.patch(`items/hide/${itemId}`, { hidden: hideStatus });
        return res;
    } catch (error) {
        console.log('Error toggling item visibility:', error);
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
    deleteItemAxios,
    hideItemAxios
};