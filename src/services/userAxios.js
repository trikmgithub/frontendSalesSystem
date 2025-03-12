import * as axiosConfig from '~/utils/axiosConfig';

// Get all users
const getUsersAxios = async () => {
    try {
        const res = await axiosConfig.get('users/all');
        return res;
    } catch (error) {
        console.log('Error at userAxios.js');
        throw new Error(error);
    }
};

// Get user by ID and automatically update localStorage
const getUserByIdAxios = async (userId) => {
    try {
        const res = await axiosConfig.get(`users/info/${userId}`);

        // If successful, automatically update the user data in localStorage
        if (res.data && res.data.user) {
            // Extract all user data, but don't store password
            const userData = res.data.user;

            // Make sure password is not stored in localStorage
            const { password, ...safeUserData } = userData;

            // Get current user data from localStorage
            const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');

            // Merge with new data (preserve fields like access_token that might not be in the API response)
            const updatedUserData = { ...currentUserData, ...safeUserData };

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUserData));
        }

        return res;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error(error);
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

        // If successful, update the address in localStorage
        if (res.data && res.data.user) {
            // Get current user data from localStorage
            const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');

            // Update only the address field
            const updatedUserData = {
                ...currentUserData,
                address: res.data.user.address
            };

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            // Also update confirmedAddress for backward compatibility
            localStorage.setItem('confirmedAddress', res.data.user.address);

            console.log('Address updated successfully in localStorage');
        }

        return res;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error; // Just throw the error object itself for better error handling
    }
};

export { getUsersAxios, getUserByIdAxios, updateAddressAxios };