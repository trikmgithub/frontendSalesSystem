import * as axiosConfig from '~/utils/axiosConfig';

// ✅ Send OTP to Email
const sendOtpAxios = async (email) => {
    try {
        const res = await axiosConfig.post('email/send-otp', { email }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Send OTP Error:', error);
        
        // Return the error response data if available
        if (error.response && error.response.data) {
            return error.response.data;
        }
        
        throw new Error('Failed to send OTP.');
    }
};

// ✅ Verify OTP
const verifyOtpAxios = async (email, otp) => {
    try {
        const res = await axiosConfig.post('email/verify-otp', { email, otp }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Verify OTP Error:', error);
        
        // Return the error response data if available
        if (error.response && error.response.data) {
            return error.response.data;
        }
        
        throw new Error('Invalid OTP. Please try again.');
    }
};

// ✅ Send OTP for Password Reset
const sendOtpForPasswordResetAxios = async (email) => {
    try {
        const res = await axiosConfig.post('email/send-otp-forget-password', { email }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Send OTP for Password Reset Error:', error);
        
        // Return the error response data if available
        if (error.response && error.response.data) {
            return error.response.data;
        }
        
        throw new Error('Failed to send OTP for password reset.');
    }
};

export { sendOtpAxios, verifyOtpAxios, sendOtpForPasswordResetAxios };