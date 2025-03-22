// src/services/brandAxios.js

import * as axiosConfig from '~/utils/axiosConfig';

// Get all brands (existing function)
const getAllBrandsAxios = async () => {
    try {
        const res = await axiosConfig.get('brands/all');
        return res;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw new Error(error);
    }
};

// Get paginated brands
const getBrandsPaginatedAxios = async (page = 1, limit = 10) => {
    try {
        const res = await axiosConfig.get(`brands/paginate?page=${page}&limit=${limit}`);
        return res;
    } catch (error) {
        console.error('Error fetching paginated brands:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch brands',
            status: error.response?.status
        };
    }
};

// Search brands by name
const searchBrandsAxios = async (searchTerm) => {
    try {
        const res = await axiosConfig.get(`brands/fuzzy/${searchTerm}`);
        return res;
    } catch (error) {
        console.error('Error searching brands:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to search brands',
            status: error.response?.status
        };
    }
};

// Get brand by ID
const getBrandByIdAxios = async (brandId) => {
    try {
        const res = await axiosConfig.get(`brands/${brandId}`);
        return res;
    } catch (error) {
        console.error('Error fetching brand by ID:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch brand details',
            status: error.response?.status
        };
    }
};

// Create a new brand
const createBrandAxios = async (brandData) => {
    try {
        const res = await axiosConfig.post('brands/create', brandData);
        return res;
    } catch (error) {
        console.error('Error creating brand:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to create brand',
            status: error.response?.status
        };
    }
};

// Update a brand
const updateBrandAxios = async (brandId, brandData) => {
    try {
        const res = await axiosConfig.patch(`brands/${brandId}`, brandData);
        return res;
    } catch (error) {
        console.error('Error updating brand:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to update brand',
            status: error.response?.status
        };
    }
};

// Delete a brand
const deleteBrandAxios = async (brandId) => {
    try {
        const res = await axiosConfig.del(`brands/${brandId}`);
        return res;
    } catch (error) {
        console.error('Error deleting brand:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to delete brand',
            status: error.response?.status
        };
    }
};

export { 
    getAllBrandsAxios, 
    getBrandsPaginatedAxios, 
    searchBrandsAxios,
    getBrandByIdAxios,
    createBrandAxios,
    updateBrandAxios,
    deleteBrandAxios
};