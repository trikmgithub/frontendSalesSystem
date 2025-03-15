import * as axiosConfig from '~/utils/axiosConfig';

// ✅ Initiate Payment with PayOS
const payosPayAxios = async (cartItems, totalAmount) => {
    try {
        // Format items data from cart items
        const items = cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        // Prepare payment data
        const paymentData = {
            amount: totalAmount,
            description: "Thanh toán đơn hàng test",
            items: items,
            returnUrl: "http://localhost:8000/success.html",
            cancelUrl: "http://localhost:8000/cancel.html"
        };

        // Call the PayOS API endpoint
        const response = await axiosConfig.post('payos', paymentData, { 
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}` 
            }
        });

        // Check different possible locations for checkoutUrl
        if (response && typeof response === 'object') {
            if (response.data) {
                if (response.data.data && response.data.data.checkoutUrl) {
                    window.location.href = response.data.data.checkoutUrl;
                    return response;
                }
                
                if (response.data.checkoutUrl) {
                    window.location.href = response.data.checkoutUrl;
                    return response;
                }
            }
            
            if (response.checkoutUrl) {
                window.location.href = response.checkoutUrl;
                return response;
            }
        }
        
        throw new Error('Could not find checkout URL in payment gateway response');
    } catch (error) {
        // Handle specific error types with clean error messages
        if (error.response) {
            throw new Error(`Payment API error: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from payment gateway');
        } else {
            throw new Error(`Payment setup error: ${error.message}`);
        }
    }
};

export { payosPayAxios };