import axios from 'axios';

// Get API base URL from environment variable
// Ensure the trailing slash is consistent with our environment variables
const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8000/api/v1/';

console.log('API Base URL being used:', API_BASE_URL);

const axiosConfig = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important! This allows cookies to be sent with requests
    timeout: 60000, // Increase timeout to 60 seconds for file uploads
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
        // For multipart/form-data requests (file uploads), don't set Content-Type
        // Let the browser set it with the correct boundary
        if (config.headers['Content-Type'] === 'multipart/form-data') {
            delete config.headers['Content-Type'];
        }
        
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
        // Log detailed error information for debugging
        if (error.response) {
            console.log('Error Response Data:', error.response.data);
            console.log('Error Response Status:', error.response.status);
            console.log('Error Response Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Error Request:', error.request);
        } else {
            console.log('Error Message:', error.message);
        }
        
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
    try {
        const response = await axiosConfig.post(url, data, config);
        return response.data;
    } catch (error) {
        console.error(`Error in POST to ${url}:`, error);
        throw error;
    }
};

const get = async (url, config = {}) => {
    try {
        const response = await axiosConfig.get(url, config);
        return response.data;
    } catch (error) {
        console.error(`Error in GET to ${url}:`, error);
        throw error;
    }
};

const patch = async (url, data, config = {}) => {
    try {
        const response = await axiosConfig.patch(url, data, config);
        return response.data;
    } catch (error) {
        console.error(`Error in PATCH to ${url}:`, error);
        throw error;
    }
};

const del = async (url, config = {}) => {
    try {
        const response = await axiosConfig.delete(url, config);
        return response.data;
    } catch (error) {
        console.error(`Error in DELETE to ${url}:`, error);
        throw error;
    }
};

// Add the delete function to axiosConfig so it can be called directly
axiosConfig.del = del;

// Alias for delete since it's a reserved keyword
const delete_ = del;

export { post, get, patch, del, delete_ };

export default axiosConfig;