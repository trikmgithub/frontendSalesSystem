import * as axiosConfig from '~/utils/axiosConfig';

// Get

// Get items
const getUsersAxios = async () => {
    try {
        const res = await axiosConfig.get('users/all');
        return res;
    } catch (error) {
        console.log('Error at userAxios.js');
        throw new Error(error);
    }
};

export { getUsersAxios };
