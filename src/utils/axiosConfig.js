import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URI;

const axiosConfig = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important! This allows cookies to be sent with requests
});

// Biến lưu trạng thái refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để đăng ký các request chờ refresh token
const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Interceptor để tự động thêm token vào request
axiosConfig.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Interceptor để xử lý refresh token khi access token hết hạn
axiosConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu lỗi là 401 (Unauthorized) và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh, chờ token mới và thử lại request
                return new Promise((resolve) => {
                    refreshSubscribers.push((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosConfig(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('Attempting to refresh token...');
                const response = await axiosConfig.get(`/auth/refresh`);

                const newAccessToken = response.data.data.access_token;
                console.log('New access token received:', newAccessToken ? 'Yes' : 'No');

                if (newAccessToken) {
                    localStorage.setItem('access_token', newAccessToken);
                    axiosConfig.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    onRefreshed(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosConfig(originalRequest);
                } else {
                    console.error('No access token in response');
                    throw new Error('No access token in response');
                }
            } catch (err) {
                localStorage.removeItem('access_token');
                window.location.href = '/';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

const post = async (url, data, config = {}) => {
    const response = await axiosConfig.post(url, data, config);
    return response.data;
};

const get = async (url, config = {}) => {
    const response = await axiosConfig.get(url, config);
    return response.data;
};

const patch = async (url, data, config = {}) => {
    const response = await axiosConfig.patch(url, data, config);
    return response.data;
};

export { post, get, patch };

export default axiosConfig;
