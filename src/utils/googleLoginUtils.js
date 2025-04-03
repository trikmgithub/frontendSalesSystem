// src/utils/googleLoginUtils.js
import { getUserByIdAxios } from '~/services/userAxios';

/**
 * Parses user information from URL query parameters after Google OAuth login redirect
 * @returns {Object|null} User information object or null if not found
 */
export const processUserInfoFromUrl = async () => {
  try {
    // Get the raw query string from the URL
    const queryString = window.location.search;
    
    // Check if we have a query string starting with ?userinfo=
    if (!queryString || !queryString.startsWith('?userinfo=')) {
      console.log("No userinfo parameter found in URL");
      return null;
    }
    
    console.log("Found userinfo in URL, processing...");
    
    // Remove the '?userinfo=' prefix to get the actual data
    const userInfoContent = queryString.substring('?userinfo='.length);
    
    // The format isn't standard URL params, but key-value pairs joined with &
    // So we'll parse it manually
    const keyValuePairs = userInfoContent.split('&');
    const userData = {};
    
    keyValuePairs.forEach(pair => {
      // Find the first = sign to split key and value
      const firstEqualsIndex = pair.indexOf('=');
      if (firstEqualsIndex > 0) {
        const key = pair.substring(0, firstEqualsIndex);
        const value = pair.substring(firstEqualsIndex + 1);
        
        // First replace plus signs with spaces, then decode URI components
        const decodedValue = decodeURIComponent(value.replace(/\+/g, ' '));
        userData[key] = decodedValue;
      }
    });
    
    console.log("Retrieved user data from URL:", userData);
    
    // Ensure we have all the required fields
    if (!userData._id || !userData.email || !userData.access_token) {
      console.error("Missing required user data fields in URL parameters");
      return null;
    }
    
    // Store access token and user data in localStorage
    localStorage.setItem('access_token', userData.access_token);
    
    // Also store refresh token if available
    if (userData.refresh_token) {
      localStorage.setItem('refresh_token', userData.refresh_token);
    }
    
    // Create initial user object with basic fields
    const basicUserObject = {
      _id: userData._id,
      name: userData.name || userData.email.split('@')[0], // Use email prefix as fallback name
      email: userData.email,
      avatar: userData.avatar || '', // Store avatar URL if available
      role: userData.role || 'USER'
    };
    
    // Store basic user data in localStorage immediately
    localStorage.setItem('user', JSON.stringify(basicUserObject));
    console.log("Basic user data from URL saved to localStorage:", basicUserObject);
    
    // Fetch detailed user information using the existing userAxios service
    try {
      console.log("Fetching detailed user information...");
      
      // Add token to localStorage temporarily to allow the service to authenticate
      localStorage.setItem('access_token', userData.access_token);
      
      // Call the existing service function
      const userDetailResponse = await getUserByIdAxios(userData._id);
      
      // Check if response is successful
      if (!userDetailResponse.error) {
        // Extract user data from the response
        // Handle different API response structures
        const detailedUserData = userDetailResponse.user || 
                               userDetailResponse.data?.user ||
                               userDetailResponse.data || 
                               userDetailResponse;
        
        if (detailedUserData) {
          // Create enhanced user object with detailed data
          const enhancedUserObject = {
            ...basicUserObject,
            ...detailedUserData,
            // Ensure the following fields are set even if they're missing in the detailed data
            _id: userData._id, // Keep original ID
            email: userData.email, // Keep original email
            name: detailedUserData.name || basicUserObject.name,
            avatar: detailedUserData.avatar || basicUserObject.avatar,
            role: detailedUserData.role || basicUserObject.role
          };
          
          // Remove any sensitive fields
          if (enhancedUserObject.password) delete enhancedUserObject.password;
          
          // Update localStorage with detailed user data
          localStorage.setItem('user', JSON.stringify(enhancedUserObject));
          console.log("Enhanced user data saved to localStorage:", enhancedUserObject);
          
          // Clean up URL 
          const cleanUrl = window.location.pathname + 
                        (window.location.search ? 
                          window.location.search.replace(/(\?|&)userinfo=[^&]*(&|$)/, '$1').replace(/^\?$/, '') : 
                          '') +
                        window.location.hash;
          
          window.history.replaceState({}, document.title, cleanUrl);
          
          return enhancedUserObject;
        }
      } else {
        console.warn("Could not fetch detailed user info:", userDetailResponse.status);
      }
    } catch (detailError) {
      console.error("Error fetching detailed user info:", detailError);
    }
    
    // If detailed info fetch fails, still clean up URL and return basic user object
    const cleanUrl = window.location.pathname + 
                    (window.location.search ? 
                      window.location.search.replace(/(\?|&)userinfo=[^&]*(&|$)/, '$1').replace(/^\?$/, '') : 
                      '') +
                    window.location.hash;
    
    window.history.replaceState({}, document.title, cleanUrl);
    
    return basicUserObject;
  } catch (error) {
    console.error('Error processing user info from URL:', error);
    return null;
  }
};

/**
 * Initiates Google login by redirecting to the backend's Google auth endpoint
 */
export const initiateGoogleLogin = async () => {
  try {
    console.log('Initiating Google login redirect...');
    const apiUri = import.meta.env.VITE_API_URI;
    window.location.href = `${apiUri}/auth/google/login`;
    // Return an object for consistent return values
    return { redirecting: true };
  } catch (error) {
    console.error("Google Login Error:", error);
    return { 
      error: true, 
      message: error.message || "Failed to initiate Google login" 
    };
  }
};