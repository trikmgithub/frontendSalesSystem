import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPasswordPopup.module.scss';
import { IoWarning } from "react-icons/io5";
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

function ForgotPasswordPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Use the custom hook to disable body scroll
    useDisableBodyScroll(true);

    const handleSubmit = async (e) => {
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

        try {
            setIsSubmitting(true);
            
            // Send OTP to the provided email/phone
            // Make sure we're sending the correct payload format
            const response = await fetch('http://localhost:8000/api/v1/email/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            // Check both response.ok and the success field in the response
            if (!response.ok || (data.data && data.data.success === false)) {
                const errorMessage = data.data?.message || data.message || 'Có lỗi xảy ra khi gửi mã OTP';
                throw new Error(errorMessage);
            }
            
            // Handle successful response
            // You might want to redirect to an OTP verification screen or show a success message
            alert('Mã OTP đã được gửi đến ' + email);
            onClose(); // Close the popup after successful submission
            
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gửi mã OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
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

                    <button 
                        type="submit" 
                        className={cx('submitBtn')}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPopup;