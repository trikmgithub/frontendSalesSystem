import * as axiosConfig from '~/utils/axiosConfig';

// Get all users with pagination
const getUsersAxios = async (page = 1, limit = 10) => {
    try {
        const res = await axiosConfig.get(`users/all?page=${page}&limit=${limit}`);
        return res;
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch users',
            status: error.response?.status
        };
    }
};

// Get user by ID
const getUserByIdAxios = async (userId) => {
    try {
        // Make sure to include authorization header
        const token = localStorage.getItem('access_token');
        const config = token ? {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } : {};
        
        const res = await axiosConfig.get(`users/info/${userId}`, config);
        
        return res;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        
        // Return a structured error response instead of throwing
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch user data',
            status: error.response?.status
        };
    }
};

// Create a new user
const createUserAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('users/create', userData);
        return res;
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to create user',
            status: error.response?.status
        };
    }
};

// Update user
const updateUserAxios = async (userData) => {
    try {
        const res = await axiosConfig.patch('users/update', userData);
        return res;
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to update user',
            status: error.response?.status
        };
    }
};

// Update user password
const updatePasswordAxios = async (passwordData) => {
    try {
        const res = await axiosConfig.patch('users/password', passwordData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return res;
    } catch (error) {
        console.error('Error updating password:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to update password',
            status: error.response?.status
        };
    }
};

// Permanently delete user
const deleteUserAxios = async (userId) => {
    try {
        // Use the DELETE method for permanent deletion
        const res = await axiosConfig.del(`users/delete/${userId}`);
        return res;
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to delete user',
            status: error.response?.status
        };
    }
};

// Update user address
const updateAddressAxios = async (addressData) => {
    try {
        // Make sure we have both email and address in the request
        if (!addressData.email || !addressData.address) {
            throw new Error('Email and address are required for address update');
        }

        // Use PATCH method for updating address and the correct endpoint
        const res = await axiosConfig.patch('users/address', addressData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        // If successful and user object exists in localStorage, update it there too
        if (res.data && res.data.user && res.data.user.address) {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Only update localStorage if we already have valid user data
                if (userData && userData._id) {
                    userData.address = res.data.user.address;
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Address updated in localStorage after API success');
                    
                    // Also update confirmedAddress for backward compatibility
                    localStorage.setItem('confirmedAddress', res.data.user.address);
                    
                    // Dispatch storage events to notify other components of the change
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'user',
                        newValue: JSON.stringify(userData),
                        url: window.location.href
                    }));
                    
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'confirmedAddress',
                        newValue: res.data.user.address,
                        url: window.location.href
                    }));
                }
            } catch (localStorageError) {
                console.error('Error updating address in localStorage:', localStorageError);
                // Continue since API call was successful
            }
        }

        return res;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error; // Just throw the error object itself for better error handling
    }
};

const updateUserSkinTypeAxios = async (skinType) => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        const res = await axiosConfig.patch(`users/skin/${skinType}`, {}, config);
        return res;
    } catch (error) {
        console.error('Error updating skin type:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to update skin type',
            status: error.response?.status
        };
    }
};

const forgetPasswordAxios = async (passwordData) => {
    try {
        // Match exactly the API's expected fields: email, password, recheck
        const requestData = {
            email: passwordData.email.trim(),
            password: passwordData.password,
            recheck: passwordData.recheck || passwordData.confirmPassword // Use either name provided
        };
        
        console.log('Sending password reset request with correct fields:', 
            JSON.stringify(requestData, null, 2));
        
        const res = await axiosConfig.post('users/forget-password', requestData);
        return res;
    } catch (error) {
        console.error('Error resetting password:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to reset password',
            status: error.response?.status
        };
    }
};

// Get phone number
const getPhoneAxios = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axiosConfig.get('users/phone', config);
        // Return correctly structured data based on API response
        if (res && res.data && res.data.data) {
            return res.data.data;
        } else if (res && res.data) {
            return res.data;
        } else {
            console.warn('Unexpected response structure:', res);
            return { phone: '' };
        }
    } catch (error) {
        console.error('Error fetching phone number:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch phone number',
        };
    }
};

// Update phone number
const updatePhoneAxios = async (phoneData) => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axiosConfig.patch('users/phone', phoneData, config);
        return res.data; // Return response data
    } catch (error) {
        console.error('Error updating phone number:', error);
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to update phone number',
        };
    }
};

// Get user's favorite items
const getFavoriteItemsAxios = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axiosConfig.get('users/favorite-items', config);
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to fetch favorite items',
            status: error.response?.status
        };
    }
};

// Add item to favorites
const addToFavoritesAxios = async (itemId) => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axiosConfig.post('users/favorite-items', { itemId }, config);
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to add to favorites',
            status: error.response?.status
        };
    }
};

// Remove item from favorites
const removeFromFavoritesAxios = async (itemId) => {
    try {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { itemId }
        };
        const res = await axiosConfig.del('users/favorite-items', config);
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || error.message || 'Failed to remove from favorites',
            status: error.response?.status
        };
    }
};

export { 
    getUsersAxios, 
    getUserByIdAxios, 
    createUserAxios,
    updateUserAxios,
    deleteUserAxios,
    updateAddressAxios,
    updateUserSkinTypeAxios,
    updatePasswordAxios,
    forgetPasswordAxios,
    getPhoneAxios,
    updatePhoneAxios,
    getFavoriteItemsAxios,
    addToFavoritesAxios,
    removeFromFavoritesAxios
};