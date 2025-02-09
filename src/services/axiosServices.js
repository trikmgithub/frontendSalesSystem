import * as axiosConfig from '~/utils/axiosConfig';

export const loginAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('auth/login', userData, { withCredentials: true });
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

export const logoutAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('auth/logout', { withCredentials: true });
        return res;
    } catch (error) {
        console.log('lougout Axios here error');
    }
};
