import * as axiosConfig from '~/utils/axiosConfig';

// ✅ Initiate Payment with Momo
const momoPayAxios = async (paymentData) => {
    try {
        const res = await axiosConfig.post('momo/pay', paymentData, { withCredentials: true });
        if (res.data?.payUrl) {
            window.location.href = res.data.payUrl; // Redirect user to Momo payment page
        }
        return res;
    } catch (error) {
        console.error('Momo Pay Error:', error);
        throw new Error('Failed to initiate payment.');
    }
};

// ✅ Handle Redirect After Payment
const momoPayRedirectAxios = async () => {
    try {
        const res = await axiosConfig.get('momo/pay-redirect', { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Momo Pay Redirect Error:', error);
        throw new Error('Payment redirect failed.');
    }
};

// ✅ Handle Payment Success
const momoSuccessAxios = async (transactionId) => {
    try {
        const res = await axiosConfig.post('momo/success', { transactionId }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Momo Payment Success Error:', error);
        throw new Error('Failed to process successful payment.');
    }
};

// ✅ Handle Instant Payment Notification (IPN)
const momoIpnAxios = async (ipnData) => {
    try {
        const res = await axiosConfig.post('momo/ipn', ipnData, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Momo IPN Error:', error);
        throw new Error('Instant Payment Notification failed.');
    }
};

// ✅ Initiate Payment with Zalopay
const zaloPayAxios = async (paymentData) => {
    try {
        const res = await axiosConfig.post('zalo/pay', paymentData, { withCredentials: true });
        if (res.data?.payUrl) {
            window.location.href = res.data.payUrl; // Redirect user to Zalo payment page
        }
        return res;
    } catch (error) {
        console.error('Zalo Pay Error:', error);
        throw new Error('Failed to initiate payment.');
    }
};

export { momoPayAxios, momoPayRedirectAxios, momoSuccessAxios, momoIpnAxios, zaloPayAxios };
