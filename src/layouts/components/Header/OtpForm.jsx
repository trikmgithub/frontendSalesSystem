import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './OtpForm.module.scss';
import SignupForm from './SignupPopup';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import { sendOtpAxios, verifyOtpAxios } from '~/services/otpAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

function OtpForm({ onVerificationSuccess, onClose }) {
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

    try {
      await sendOtpAxios(email);
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
      await verifyOtpAxios(email, otp);
      onVerificationSuccess(email);
      onClose();
    } catch (error) {
      setOtpError('OTP không hợp lệ.');
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