import * as axiosConfig from '~/utils/axiosConfig';

export const loginAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('auth/login', userData);
        return res;
    } catch (error) {
        throw error.response.data.message;
    }
};