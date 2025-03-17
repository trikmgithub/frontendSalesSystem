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

export { createCartAxios, getAllCartsAxios, updateCartStatusAxios, getUserOrdersAxios };