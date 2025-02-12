import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

const post = async (url, data, config = {}) => {
    const response = await axiosConfig.post(url, data, config);
    return response.data;
};

const get = async (url, config = {}) => {
    const response = await axiosConfig.get(url, config);
    return response.data;
};

export { post, get };

export default axiosConfig;
