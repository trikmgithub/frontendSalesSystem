import * as axiosConfig from '~/utils/axiosConfig';

// Login API
const loginAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('auth/login', userData, { withCredentials: true });

        // Lưu access token vào localStorage nếu tồn tại
        if (res.data?.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                }),
            );
        }

        // Làm mới lại trang sau khi logout
        window.location.reload();

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

// Google Login API (Redirect to Google's OAuth page)
const googleLoginAxios = async () => {
    try {
        // Redirect the user to Google login page
        window.location.href = "http://localhost:8000/api/v1/auth/google/login";
    } catch (error) {
        console.error("Google Login Error:", error);
        throw new Error("Google login failed.");
    }
};

// Google Redirect API (Handles OAuth response)
const googleRedirectAxios = async () => {
    try {
        const res = await axiosConfig.get('auth/google/redirect', { withCredentials: true });

        if (res.data?.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                }),
            );
        }

        window.location.reload();
        return res;
    } catch (error) {
        console.error('Google Redirect Error:', error);
        throw new Error('Failed to authenticate with Google.');
    }
};

// Logout API
const logoutAxios = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage

        if (!token) {
            throw new Error('No access token found');
        }

        // Thêm Bearer token vào Authorization header
        const res = await axiosConfig.post(
            'auth/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền Bearer token trong header
                },
                withCredentials: true, // Gửi cookie nếu có
            },
        );

        // Sau khi logout thành công, xóa token và thông tin người dùng khỏi localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('confirmedAddress');
        localStorage.setItem('user', 'null');

        // Làm mới lại trang sau khi logout
        window.location.reload();

        return res;
    } catch (error) {
        console.error('Logout Axios logoutAxios error', error);
    }
};

// Register API
const registerAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('users/register', userData);
        return res;
    } catch (error) {
        throw error.response.data.message;
    }
};

export { loginAxios, googleLoginAxios, googleRedirectAxios, logoutAxios, registerAxios };