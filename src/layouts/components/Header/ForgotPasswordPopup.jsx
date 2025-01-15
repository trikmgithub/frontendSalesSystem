import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPasswordPopup.module.scss';
import { IoWarning } from "react-icons/io5";

const cx = classNames.bind(styles);

function ForgotPasswordPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

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

        if (!captcha) {
            setError('Vui lòng nhập mã captcha');
            return;
        }

        // Handle password reset logic here
    };

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={e => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>×</button>
                <h3>Quên mật khẩu tài khoản</h3>
                
                <p className={cx('description')}>
                    Nhập địa chỉ email hoặc số điện thoại của bạn dưới đây và hệ thống sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn
                </p>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className={cx('errorMessage')}>
                            <IoWarning size={16} />
                            {error}
                        </div>
                    )}

                    <div className={cx('formGroup')}>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email hoặc số điện thoại"
                            className={cx({ error: error && !email })}
                        />
                    </div>

                    <div className={cx('captchaGroup')}>
                        <div className={cx('captchaImage')}>
                            <img src="/path-to-captcha-image.jpg" alt="CAPTCHA" />
                        </div>
                        <input
                            type="text"
                            value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)}
                            placeholder="Nhập captcha"
                            className={cx({ error: error && !captcha })}
                        />
                    </div>

                    <button type="submit" className={cx('submitBtn')}>
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPopup; 