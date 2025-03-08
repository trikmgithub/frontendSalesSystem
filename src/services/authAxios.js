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
                    role: res.data.role,
                    avatar: res.data.avatar
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
        // Use the environment variable or fallback to hardcoded URL
        const apiBaseUrl = 'http://localhost:8000/api/v1';

        // Redirect the user to Google login page
        window.location.href = `${apiBaseUrl}/auth/google/login`;
    } catch (error) {
        console.error("Google Login Error:", error);
        throw new Error("Google login failed.");
    }
};

// Google Redirect API (Handles OAuth response)
const googleRedirectAxios = async () => {
    try {
        // Get the URL parameters (for code parsing if needed)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        // If there's no code in the URL but we're on the redirect path,
        // we might need to adjust the API call
        let endpoint = 'auth/google/redirect';
        if (code) {
            endpoint += `?code=${code}`;
        }

        const res = await axiosConfig.get(endpoint, { withCredentials: true });

        // Process the response and store user data
        if (res.data?.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                    avatar: res.data.avatar
                }),
            );

            // Redirect to homepage after storing data
            window.location.href = '/';
        }

        return res;
    } catch (error) {
        console.error('Google Redirect Error:', error);
        // Redirect to home page with error state if needed
        window.location.href = '/?login_error=true';
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