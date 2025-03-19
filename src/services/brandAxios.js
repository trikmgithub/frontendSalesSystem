// src/services/brandAxios.js

import * as axiosConfig from '~/utils/axiosConfig';

// Get all brands
const getAllBrandsAxios = async () => {
    try {
        const res = await axiosConfig.get('brands/all');
        return res;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw new Error(error);
    }
};

export { getAllBrandsAxios };