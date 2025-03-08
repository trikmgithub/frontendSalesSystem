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
                }),
            );
        }

        // Làm mới lại trang sau khi đăng nhập thành công
        window.location.reload();

        return res;
    } catch (error) {
        // Propagate the error with more details for better handling in the UI
        console.error('Login error:', error.response?.data || error.message);
        throw error; // Let the component handle the error
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
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.log('No access token found, proceeding with local logout');
            // Still perform local logout even without a token
            localStorage.removeItem('access_token');
            localStorage.removeItem('confirmedAddress');
            localStorage.setItem('user', 'null');
            window.location.reload();
            return;
        }

        try {
            // Attempt server logout
            const res = await axiosConfig.post(
                'auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );

            console.log('Logout successful');
            return res;
        } catch (serverError) {
            // Log the server error but continue with local logout
            console.error('Server logout failed:', serverError);
        } finally {
            // Always perform local logout regardless of server response
            localStorage.removeItem('access_token');
            localStorage.removeItem('confirmedAddress');
            localStorage.setItem('user', 'null');
            window.location.reload();
        }
    } catch (error) {
        console.error('Logout process error:', error);
        // Ensure we still do the local logout even if there's an error
        localStorage.removeItem('access_token');
        localStorage.removeItem('confirmedAddress');
        localStorage.setItem('user', 'null');
        window.location.reload();
    }
};

// Register API
const registerAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('users/register', userData);
        return res;
    } catch (error) {
        // Return the full error response data instead of just the message
        // This allows us to check for isExistedEmail flag
        if (error.response && error.response.data) {
            return error.response.data;
        }
        // If no structured error data, throw a generic error
        throw new Error(error.message || 'Registration failed');
    }
};

export { loginAxios, googleLoginAxios, googleRedirectAxios, logoutAxios, registerAxios };