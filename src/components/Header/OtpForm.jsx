// src/components/Header/OtpForm.jsx
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './OtpForm.module.scss';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import { sendOtpAxios, verifyOtpAxios } from '~/services/otpAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

function OtpForm({ onVerificationSuccess, onClose, onShowLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // Use the custom hook to disable body scroll
  useDisableBodyScroll(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    setOtpError('');
    setOtpSuccess('');

    if (!email) {
      setOtpError('Vui lòng nhập email.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setOtpError('Email không hợp lệ.');
      return;
    }

    try {
      const response = await sendOtpAxios(email);
      
      // Check if response has error and is about existing email
      if (response.error || response.statusCode === 400) {
        // Check for isExistedEmail flag or email existed message
        if (response.isExistedEmail || 
            (response.message && (
              response.message.includes('Email is existed') || 
              response.message.includes('đã tồn tại')
            ))) {
          setOtpError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
          return;
        }
        
        // Handle other errors
        setOtpError(response.message || 'Lỗi gửi OTP, vui lòng thử lại.');
        return;
      }
      
      setOtpSuccess('OTP đã được gửi! Vui lòng kiểm tra email.');
      setCountdown(60);
    } catch (error) {
      setOtpError('Lỗi gửi OTP, vui lòng thử lại.');
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    setOtpSuccess('');

    if (!otp) {
      setOtpError('Vui lòng nhập mã OTP.');
      return;
    }

    try {
      const response = await verifyOtpAxios(email, otp);
      
      // Check if response has errors
      if (response.error || !response.success) {
        setOtpError(response.message || 'OTP không hợp lệ.');
        return;
      }
      
      // If verification successful
      setOtpSuccess('Xác minh thành công!');
      
      // Delay slightly before calling onVerificationSuccess to ensure UI updates
      setTimeout(() => {
        if (onVerificationSuccess) {
          console.log('Calling onVerificationSuccess with email:', email);
          onVerificationSuccess(email);
        }
        
        // Don't call onClose here - we need to wait for onVerificationSuccess to complete first
        // The parent component should handle closing this modal after showing the signup form
      }, 500);
    } catch (error) {
      setOtpError('OTP không hợp lệ.');
    }
  };

  // Handle login redirect when email exists
  const handleShowLogin = () => {
    onClose();
    if (onShowLogin) {
      onShowLogin(); // This would open the login form
    }
  };

  return (
    <div className={cx('modalOverlay')} onClick={onClose}>
      <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
        <button className={cx('closeButton')} onClick={onClose}>×</button>
        <h2 className={cx('modalTitle')}>Xác minh tài khoản</h2>
        <p className={cx('modalDescription')}>
          Nhập địa chỉ email của bạn dưới đây, bấm gửi và hệ thống sẽ gửi đến email bạn một mã OTP
        </p>

        {otpError && (
          <div className={cx('errorMessage')}>
            <IoWarning size={16} />
            {otpError}
            {otpError.includes('Email đã được sử dụng') && (
              <button 
                className={cx('loginLinkBtn')} 
                onClick={handleShowLogin}
              >
                Đăng nhập ngay
              </button>
            )}
          </div>
        )}

        {otpSuccess && (
          <div className={cx('successMessage')}>
            <IoCheckmarkCircle size={16} />
            {otpSuccess}
          </div>
        )}

        <div className={cx('inputContainer')}>
          <input
            type="text"
            className={cx('inputField')}
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={cx('otpGroup')}>
          {countdown > 0 ? (
            <button className={cx('resendButton')} disabled>
              {countdown}s
            </button>
          ) : (
            <button className={cx('submitButton')} onClick={handleSendOtp}>
              Gửi OTP
            </button>
          )}
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <button
          className={cx('verifyButton')}
          onClick={handleVerifyOtp}
        >
          Xác minh
        </button>
      </div>
    </div>
  );
}

export default OtpForm;