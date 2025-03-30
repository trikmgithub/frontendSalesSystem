import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPasswordPopup.module.scss';
import { IoWarning } from 'react-icons/io5';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

function ForgotPasswordPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isVerifyMode, setIsVerifyMode] = useState(false);
    
    // Use the custom hook to disable body scroll
    useDisableBodyScroll(true);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendOtp = async () => {
        setError('');

        if (!email) {
            setError('Vui lòng nhập email hoặc số điện thoại');
            return;
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            setError('Email hoặc số điện thoại không hợp lệ');
            return;
        }

        try {
            // Send OTP to the provided email/phone with the correct API endpoint
            const response = await fetch('https://mybeautyskinapp.azurewebsites.net/api/v1/email/send-otp-forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            // Check response status
            if (!response.ok || (data.data && data.data.success === false)) {
                const errorMessage = data.data?.message || data.message || 'Có lỗi xảy ra khi gửi mã OTP';
                throw new Error(errorMessage);
            }
            
            // Success case
            setCountdown(60);
            setIsVerifyMode(true);
            
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gửi mã OTP');
        }
    };

    const handleVerifyOtp = async () => {
        setError('');

        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        try {
            // Verify OTP with the correct API endpoint
            const response = await fetch('https://mybeautyskinapp.azurewebsites.net/api/v1/email/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            console.log("123", data);
            
            // Check response status
            if (!response.ok || !data.data.success) {
                const errorMessage = data.message || 'OTP không hợp lệ.';
                throw new Error(errorMessage);
            }
            
            // Success case - here you would typically redirect to a password reset page
            onClose();
            // window.location.href = '/reset-password?token=' + data.token;
            
        } catch (err) {
            setError(err.message || 'OTP không hợp lệ.');
        }
    };

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>×</button>
                <h2 className={cx('modalTitle')}>Quên mật khẩu tài khoản</h2>
                <p className={cx('modalDescription')}>
                    Nhập địa chỉ email hoặc số điện thoại của bạn dưới đây và hệ thống sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn
                </p>

                {error && (
                    <div className={cx('errorMessage')}>
                        <IoWarning />
                        {error}
                    </div>
                )}

                {isVerifyMode ? (
                    <>
                        <div className={cx('inputField')}>
                            <input
                                type="text"
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className={cx('otpInputs')}>
                            <button className={cx('countdownButton')} disabled>
                                {countdown}s
                            </button>
                            <input
                                type="text"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={cx('otpInput')}
                            />
                        </div>
                        <button
                            className={cx('verifyButton')}
                            onClick={handleVerifyOtp}
                        >
                            Xác minh
                        </button>
                    </>
                ) : (
                    <>
                        <div className={cx('inputField')}>
                            <input
                                type="text"
                                placeholder="Nhập email hoặc số điện thoại"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            className={cx('submitButton')}
                            onClick={handleSendOtp}
                        >
                            Gửi
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPopup;