// src/services/roleAxios.js

import * as axiosConfig from '~/utils/axiosConfig';

// Get role by ID
const getRoleByIdAxios = async (roleId) => {
    try {
        const res = await axiosConfig.get(`roles/${roleId}`);
        return res;
    } catch (error) {
        console.error('Error fetching role:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch role data',
            status: error.response?.status
        };
    }
};

export { getRoleByIdAxios };