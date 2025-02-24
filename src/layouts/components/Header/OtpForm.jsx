import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './OtpForm.module.scss';
import SignupForm from './SignupPopup';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import { sendOtpAxios, verifyOtpAxios } from '~/services/otpAxios';

const cx = classNames.bind(styles);

function OtpForm({ onVerificationSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSendOtp = async () => {
    setOtpError('');
    setOtpSuccess('');

    if (!email) {
      setOtpError('Vui lòng nhập email.');
      return;
    }

    try {
      await sendOtpAxios({ email });
      setOtpSuccess('OTP đã được gửi! Vui lòng kiểm tra email.');
      setOtpSent(true);
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
      await verifyOtpAxios({ email, otp });
      onVerificationSuccess(email);
      setVerified(true);
    } catch (error) {
      setOtpError('OTP không hợp lệ.');
    }
  };

  if (verified) {
    return <SignupForm email={email} onClose={onClose} />;
  }

  return (
    <div className={cx('modalOverlay')} onClick={(e) => e.stopPropagation()}>
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

        <button
          className={cx('submitButton')}
          onClick={handleSendOtp}
        >
          Gửi OTP
        </button>

        {otpSent && (
          <>
            <div className={cx('inputContainer')}>
              <input
                type="text"
                className={cx('inputField')}
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
          </>
        )}
      </div>
    </div>
  );
}

export default OtpForm;