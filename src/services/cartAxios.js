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
    
    // Log the authorization token (remove sensitive parts)
    const token = localStorage.getItem('access_token');
    const tokenShort = token ? `${token.substring(0, 10)}...` : 'none';
    console.log(`Using auth token: ${tokenShort}`);
    
    // Make the request with detailed logging
    console.log(`Making request to: cart/download/${cartId}`);
    const response = await axiosConfig.get(`cart/download/${cartId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf,application/octet-stream,*/*' // Accept more formats
      }
    });
    
    // Log response info
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      dataType: typeof response.data,
      dataSize: response.data ? response.data.size : 0
    });
    
    // Check if response actually has data
    if (response.data && response.data.size > 0) {
      console.log(`Invoice data received (${response.data.size} bytes)`);
      
      // Get content type from response headers
      const contentType = response.headers?.['content-type'] || 'application/pdf';
      console.log(`Content-Type: ${contentType}`);
      
      // Try to open the file directly in a new tab first
      try {
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        
        // Try opening in a new tab first
        window.open(url, '_blank');
        
        // Clean up the object URL after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
        
        return { success: true };
      } catch (openError) {
        console.error('Error opening file in new tab:', openError);
        
        // Fall back to download approach if opening fails
        try {
          const blob = new Blob([response.data], { type: contentType });
          const url = window.URL.createObjectURL(blob);
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
        } catch (downloadError) {
          console.error('Error with download fallback:', downloadError);
          throw new Error(`Error creating downloadable file: ${downloadError.message}`);
        }
      }
    } else {
      console.error('Empty response data received');
      throw new Error('Received empty file data from server');
    }
  } catch (error) {
    console.error('Invoice download error:', error);
    
    // Check if we can access the response for more details
    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    
    // More detailed error messages
    if (error.response) {
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

// // Alternative: Direct download without processing
// const downloadInvoiceDirectAxios = async (cartId) => {
//   try {
//     // Get base URL from environment or configuration
//     const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
//     const token = localStorage.getItem('access_token');
    
//     // Create a direct URL to the invoice endpoint
//     const invoiceUrl = `${baseURL}/cart/download/${cartId}`;
    
//     // Open the URL in a new tab
//     window.open(invoiceUrl, '_blank');
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error with direct download:', error);
//     alert(`Error opening invoice: ${error.message}`);
//     return { error: true, message: error.message };
//   }
// };

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
  sendInvoiceEmailAxios
};