import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPasswordPopup.module.scss';
import { IoWarning } from 'react-icons/io5';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';
import { sendOtpForPasswordResetAxios, verifyOtpAxios } from '~/services/otpAxios';
import UpdatePasswordPopup from './UpdatePasswordPopup';

const cx = classNames.bind(styles);

function ForgotPasswordPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isVerifyMode, setIsVerifyMode] = useState(false);
    const [showUpdatePasswordPopup, setShowUpdatePasswordPopup] = useState(false);
    
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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            setError('Email hoặc số điện thoại không hợp lệ');
            return;
        }

        try {
            const response = await sendOtpForPasswordResetAxios(email);

            if (response.success) {
                setCountdown(60);
                setIsVerifyMode(true);
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi gửi mã OTP');
            }
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

        if (!/^\d{6}$/.test(otp)) {
            setError('OTP phải là 6 chữ số');
            return;
        }

        try {
            const response = await verifyOtpAxios(email, otp);

            if (response.success) {
                setShowUpdatePasswordPopup(true);
            } else {
                throw new Error(response.message || 'OTP không hợp lệ.');
            }
        } catch (err) {
            setError(err.message || 'OTP không hợp lệ.');
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className={cx('modalOverlay')} onClick={handleClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={handleClose}>×</button>
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
                            {countdown > 0 ? (
                                <button className={cx('countdownButton')} disabled>
                                    {countdown}s
                                </button>
                            ) : (
                                <button
                                    className={cx('resendButton')}
                                    onClick={handleSendOtp}
                                >
                                    Gửi lại OTP
                                </button>
                            )}
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

                {showUpdatePasswordPopup && (
                    <UpdatePasswordPopup onClose={() => setShowUpdatePasswordPopup(false)} />
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPopup;