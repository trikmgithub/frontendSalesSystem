// src/services/authAxios.js
import * as axiosConfig from '~/utils/axiosConfig';

// Login API with improved user details handling
const loginAxios = async (userData) => {
    try {
        const res = await axiosConfig.post('auth/login', userData, { withCredentials: true });

        // Check if login was successful
        if (res.data?.access_token) {
            // Store access token immediately
            localStorage.setItem('access_token', res.data.access_token);

            // Store basic user info from login response
            const basicUserData = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
            };

            // Make sure to use JSON.stringify correctly
            localStorage.setItem('user', JSON.stringify(basicUserData));
            console.log("User data saved to localStorage:", basicUserData);

            // Only attempt to fetch detailed user data if we have an ID
            if (res.data._id) {
                try {
                    // Fetch complete user info right after login
                    const endpoint = `users/info/${res.data._id}`;

                    const userDetailsRes = await axiosConfig.get(endpoint, {
                        headers: {
                            Authorization: `Bearer ${res.data.access_token}`
                        }
                    });

                    // Check the structure of the response to extract user data correctly
                    const userData = userDetailsRes.data?.user || userDetailsRes.data;

                    if (userData) {
                        // Ensure password is not included
                        if (userData.password) {
                            delete userData.password;
                        }

                        // Make sure to preserve access token and basic info
                        const completeUserData = {
                            ...basicUserData,
                            ...userData,
                            access_token: res.data.access_token
                        };

                        // Update localStorage with complete user data
                        localStorage.setItem('user', JSON.stringify(completeUserData));
                        console.log("Updated user data in localStorage:", completeUserData);
                    }
                } catch (detailsError) {
                    console.error('Error fetching user details:', detailsError.message);
                    // We already saved the basic info, so login still succeeds
                }
            }

            // SIMPLE ROLE-BASED REDIRECTION
            const role = res.data.role;
            console.log("User role for redirection:", role);

            // Add a short delay to ensure localStorage is updated before redirection
            setTimeout(() => {
                if (['ADMIN', 'MANAGER'].includes(role)) {
                    console.log("Redirecting to admin dashboard");
                    window.location.href = '/admin';
                } else if (role === 'STAFF') {
                    console.log("Redirecting to staff dashboard");
                    window.location.href = '/staff';
                } else {
                    // Regular users go to homepage
                    console.log("Reloading page for regular user");
                    window.location.reload();
                }
            }, 500); // Increased delay for better reliability
        }

        return res;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error; // Let the component handle the error
    }
};

// Google Login API - Simplified to just handle the redirect
const googleLoginAxios = async () => {
    try {
        console.log('Redirecting to Google login endpoint...');
        
        // Redirect to Google login endpoint
        window.location.href = `${import.meta.env.VITE_API_URI}/auth/google/login`;
        
        // This function returns a promise that won't resolve due to the redirect
        return { redirecting: true };
    } catch (error) {
        console.error("Google Login Error:", error);
        return {
            error: true,
            message: error.message || "Failed to redirect to Google login"
        };
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
            localStorage.setItem('user', 'null');  // Set to 'null' string instead of removing
            localStorage.setItem('cartItems', 'null');
            localStorage.setItem('favoriteItems', 'null');
            // Redirect to homepage
            window.location.href = '/';
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
            localStorage.setItem('user', 'null');  // Set to 'null' string instead of removing
            localStorage.setItem('cartItems', 'null');
            localStorage.setItem('favoriteItems', 'null');
            // Redirect to homepage
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout process error:', error);
        // Ensure we still do the local logout even if there's an error
        localStorage.removeItem('access_token');
        localStorage.setItem('user', 'null');  // Set to 'null' string instead of removing
        localStorage.setItem('cartItems', 'null');
        localStorage.setItem('favoriteItems', 'null');
        // Redirect to homepage
        window.location.href = '/';
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

export { loginAxios, googleLoginAxios, logoutAxios, registerAxios }