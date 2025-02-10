import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const post = async (path, data, options = {}) => {
    const response = await axiosConfig.post(path, data, options);
    return response.data;
};

export default axiosConfig;
