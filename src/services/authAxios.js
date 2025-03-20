import * as axiosConfig from '~/utils/axiosConfig';

// Login API with nested user details fetch
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
            
            localStorage.setItem('user', JSON.stringify(basicUserData));
            
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
                    }
                } catch (detailsError) {
                    console.error('Error fetching user details:', detailsError.message);
                    // We already saved the basic info, so login still succeeds
                }
            }
            
            // Add a short delay to ensure localStorage is updated before reload
            setTimeout(() => {
                window.location.reload();
            }, 300); // 300ms delay
        }

        return res;
    } catch (error) {
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
            
            // Get basic user info from Google OAuth response
            const basicUserData = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                avatar: res.data.avatar
            };
            
            localStorage.setItem('user', JSON.stringify(basicUserData));
            
            // Try to fetch complete user profile if we have an ID
            if (res.data._id) {
                try {
                    const userDetailsRes = await axiosConfig.get(`users/info/${res.data._id}`, {
                        headers: {
                            Authorization: `Bearer ${res.data.access_token}`
                        }
                    });
                    
                    // Get full user data
                    const userData = userDetailsRes.data?.user || userDetailsRes.data;
                    
                    if (userData) {
                        // Remove sensitive data like password
                        if (userData.password) {
                            delete userData.password;
                        }
                        
                        // Create complete user data object with OAuth and profile info
                        const completeUserData = { 
                            ...basicUserData,
                            ...userData,
                            access_token: res.data.access_token 
                        };
                        
                        // Save complete user profile to localStorage
                        localStorage.setItem('user', JSON.stringify(completeUserData));
                    }
                } catch (detailsError) {
                    console.error('Error fetching user details after Google login:', detailsError);
                    // Continue with basic info since login was successful
                }
            }

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