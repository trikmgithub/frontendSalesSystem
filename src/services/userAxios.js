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

// Get user by ID without saving to localStorage
const getUserByIdAxios = async (userId) => {
    try {
        const res = await axiosConfig.get(`users/info/${userId}`);
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

        // If successful and user object exists in localStorage, update it there too
        if (res.data && res.data.user && res.data.user.address) {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Only update localStorage if we already have valid user data
                if (userData && userData._id) {
                    userData.address = res.data.user.address;
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Address updated in localStorage after API success');
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

export { getUsersAxios, getUserByIdAxios, updateAddressAxios };