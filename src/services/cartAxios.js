import * as axiosConfig from '~/utils/axiosConfig';

/**
 * Create a new cart/order record
 * @param {Object} cartData - Cart data including userId, items, totalAmount, etc.
 * @returns {Promise} - API response
 */
const createCartAxios = async (cartData) => {
  try {
    const response = await axiosConfig.post('cart/create', cartData);
    return response;
  } catch (error) {
    console.error('Create cart error:', error);

    // Return the error response data if available
    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    // If there's no structured error response, throw a generic error
    throw new Error('Failed to create cart record');
  }
};

/**
 * Get all cart/order records (Staff/Admin only)
 * @returns {Promise} - API response with all cart records
 */
const getAllCartsAxios = async () => {
  try {
    const response = await axiosConfig.get('cart/all');
    return response;
  } catch (error) {
    console.error('Get all carts error:', error);

    // Return the error response data if available
    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to fetch cart records');
  }
};

/**
 * Get pending orders
 * @returns {Promise} - API response with pending orders
 */
const getPendingOrdersAxios = async () => {
  try {
    const response = await axiosConfig.get('cart/pending');
    return response;
  } catch (error) {
    console.error('Get pending orders error:', error);

    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to fetch pending orders');
  }
};

/**
 * Get completed orders
 * @returns {Promise} - API response with completed orders
 */
const getCompletedOrdersAxios = async () => {
  try {
    const response = await axiosConfig.get('cart/done');
    return response;
  } catch (error) {
    console.error('Get completed orders error:', error);

    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to fetch completed orders');
  }
};

/**
 * Get cancelled orders
 * @returns {Promise} - API response with cancelled orders
 */
const getCancelledOrdersAxios = async () => {
  try {
    const response = await axiosConfig.get('cart/cancel');
    return response;
  } catch (error) {
    console.error('Get cancelled orders error:', error);

    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to fetch cancelled orders');
  }
};

/**
 * Get detailed information for a specific cart/order
 * @param {string} cartId - The cart ID to get details for
 * @returns {Promise} - API response with detailed cart information
 */
const getCartDetailAxios = async (cartId) => {
  try {
    // Get the authorization token
    const token = localStorage.getItem('access_token');
    const config = token ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    } : {};

    const response = await axiosConfig.get(`cart/info/${cartId}`, config);
    return response;
  } catch (error) {
    console.error(`Error fetching cart details for ${cartId}:`, error);
    
    // Return the error response data if available
    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }
    
    return {
      error: true,
      message: error.message || 'Failed to fetch cart details'
    };
  }
};

/**
 * Get user's orders by user ID
 * @param {string} userId - The user ID to fetch orders for
 * @returns {Promise} - API response with user's orders
 */
const getUserOrdersAxios = async (userId) => {
  try {
    const response = await axiosConfig.get(`cart/user/${userId}`);

    // Check response format and ensure we return properly structured data
    if (response && response.data) {
      // If data is already in correct format, return it
      return {
        data: Array.isArray(response.data) ? response.data :
          response.data?.data ? response.data.data :
            response.data?.orders ? response.data.orders :
              [],
        message: response.message || 'Orders retrieved successfully'
      };
    }

    return response;
  } catch (error) {
    console.error('Get user orders error:', error);

    // Return the error response data if available
    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    return {
      error: true,
      message: error.message || 'Failed to fetch user orders',
      data: []
    };
  }
};

/**
 * Update cart/order status
 * @param {string} cartId - ID of the cart to update
 * @param {string} status - New status (pending, done, cancelled)
 * @returns {Promise} - API response
 */
const updateCartStatusAxios = async (cartId, status) => {
  try {
    const response = await axiosConfig.patch(`cart/${cartId}`, { status });
    return response;
  } catch (error) {
    console.error('Update cart status error:', error);

    // Return the error response data if available
    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to update cart status');
  }
};

/**
 * Download invoice for a specific order
 * @param {string} cartId - The cart/order ID
 * @returns {Promise} - The file download response
 */
const downloadInvoiceAxios = async (cartId) => {
  try {
    console.log(`Attempting to download invoice for cart ID: ${cartId}`);

    // Get the authorization token
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Get base URL from environment variables with fallback
    const baseURL = import.meta.env.VITE_API_URI ||
      import.meta.env.VITE_API_URL ||
      '';

    // Log token for debugging (hide most of it)
    const tokenShort = token ? `${token.substring(0, 10)}...` : 'none';
    console.log(`Using auth token: ${tokenShort}`);
    console.log(`Making request to download invoice for cart ID: ${cartId}`);

    // Try approach 1: Using axios with blob response type
    try {
      const response = await axiosConfig.get(`cart/download/${cartId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf,application/octet-stream,*/*'
        }
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        dataSize: response.data ? response.data.size : 0
      });

      // Check if response actually has data
      if (response.data && response.data.size > 0) {
        const contentType = response.headers?.['content-type'] || 'application/pdf';
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        // Try to download the file
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${cartId}.pdf`);
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 1000);

        return { success: true };
      } else {
        console.warn('Empty response data received, trying fetch API approach');
        throw new Error('Empty response data');
      }
    } catch (axiosError) {
      console.warn('Axios approach failed, trying fetch API approach', axiosError);

      // Try approach 2: Fetch API approach
      const response = await fetch(`${baseURL}/cart/download/${cartId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf,application/octet-stream,*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Server returned empty file');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${cartId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 1000);

      return { success: true, method: 'fetch' };
    }
  } catch (error) {
    console.error('Invoice download error:', error);

    // Check if error was caused by CORS
    const errorMessage = error.message || '';
    if (errorMessage.includes('CORS') ||
      errorMessage.includes('cross-origin') ||
      error.name === 'NetworkError') {
      console.warn('Possible CORS issue detected, trying alternative download method');
      return downloadInvoiceDirectAxios(cartId);
    }

    // Provide helpful error messages based on error type
    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        statusText: error.response.statusText
      });

      if (error.response.status === 404) {
        alert('Invoice not found. The invoice may not exist for this order yet.');
      } else if (error.response.status === 403) {
        alert('You do not have permission to download this invoice.');
      } else {
        alert(`Server error (${error.response.status}): ${error.response.statusText}`);
      }
    } else if (error.request) {
      alert('Could not connect to the server. Please check your internet connection.');
    } else {
      alert(`Error downloading invoice: ${error.message}`);
    }

    return { error: true, message: error.message };
  }
};

// Direct download fallback function
const downloadInvoiceDirectAxios = async (cartId) => {
  try {
    // Get base URL from environment or configuration
    const baseURL = import.meta.env.VITE_API_URI ||
      import.meta.env.VITE_API_URL ||
      '';

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Approach 1: Using Fetch API with proper headers
    try {
      const response = await fetch(`${baseURL}/cart/download/${cartId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf,application/octet-stream,*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Server returned empty file');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${cartId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 1000);

      return { success: true, method: 'fetch' };
    } catch (fetchError) {
      console.warn('Fetch API approach failed:', fetchError);

      // Approach 2: Open in new window with proper auth
      // This can work for same-origin downloads and avoids CORS issues
      const popupWindow = window.open('', '_blank');
      if (!popupWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Write a form to the new window that will POST with the auth token
      popupWindow.document.write(`
        <html>
          <body>
            <form id="downloadForm" action="${baseURL}/cart/download/${cartId}" method="GET">
              <input type="hidden" name="token" value="${token}">
            </form>
            <script>
              // Add auth header to all requests in this window
              const originalFetch = window.fetch;
              window.fetch = function(url, options = {}) {
                if (!options.headers) options.headers = {};
                options.headers['Authorization'] = 'Bearer ${token}';
                return originalFetch(url, options);
              };
              
              // Submit the form
              document.getElementById('downloadForm').submit();
              
              // Display message while loading
              document.write('<div style="font-family: sans-serif; padding: 20px; text-align: center;">'+
                '<h3>Downloading invoice, please wait...</h3>'+
                '<p>If download doesn\'t start automatically, please check your popup settings.</p>'+
              '</div>');
            </script>
          </body>
        </html>
      `);

      return { success: true, method: 'popup' };
    }
  } catch (error) {
    console.error('Error with direct download:', error);
    alert(`Error opening invoice: ${error.message}`);
    return { error: true, message: error.message };
  }
};

// Function to test API configuration
const testApiConfig = () => {
  try {
    // Get what axiosConfig is using as the base URL
    let baseURL = "Unknown";

    // Check available environment variables
    const envVars = {
      VITE_API_URI: import.meta.env.VITE_API_URI,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      NODE_ENV: import.meta.env.NODE_ENV
    };

    // Check if axiosConfig has a default base URL
    if (axiosConfig.defaults && axiosConfig.defaults.baseURL) {
      baseURL = axiosConfig.defaults.baseURL;
    }

    console.info('API Configuration:', {
      detectedBaseURL: baseURL,
      environmentVariables: envVars,
      authTokenExists: !!localStorage.getItem('access_token')
    });

    return {
      baseURL,
      envVars,
      hasToken: !!localStorage.getItem('access_token')
    };
  } catch (error) {
    console.error('Error checking API configuration:', error);
    return { error: true, message: error.message };
  }
};

/**
 * Send invoice to customer's email
 * @param {string} cartId - The cart/order ID
 * @param {string} email - The email address to send to
 * @returns {Promise} - API response
 */
const sendInvoiceEmailAxios = async (cartId, email) => {
  try {
    const response = await axiosConfig.post('email/send-invoice', {
      cartId,
      email
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response;
  } catch (error) {
    console.error('Send invoice email error:', error);

    if (error.response && error.response.data) {
      return {
        error: true,
        ...error.response.data
      };
    }

    throw new Error('Failed to send invoice email');
  }
};

export {
  createCartAxios,
  getAllCartsAxios,
  getPendingOrdersAxios,
  getCompletedOrdersAxios,
  getCancelledOrdersAxios,
  updateCartStatusAxios,
  getUserOrdersAxios,
  downloadInvoiceAxios,
  sendInvoiceEmailAxios,
  downloadInvoiceDirectAxios,
  testApiConfig,
  getCartDetailAxios
};