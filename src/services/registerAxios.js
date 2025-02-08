import * as axiosConfig from '~/utils/axiosConfig';

export const registerAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('users/register', userData);
        return res;
    } catch (error) {
        throw error.response.data.message;
    }
};
