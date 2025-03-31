import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UpdatePasswordPopup.module.scss';
import { forgetPasswordAxios } from '~/services/userAxios';

const cx = classNames.bind(styles);

function UpdatePasswordPopup({ onClose, initialEmail = '' }) {
    const [email, setEmail] = useState(initialEmail);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Update email state if initialEmail prop changes
    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    // Hàm kiểm tra input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
        } else if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }

        // Kiểm tra ngay khi người dùng nhập mật khẩu
        if (name === 'confirmPassword' || name === 'newPassword') {
            if (value !== (name === 'newPassword' ? confirmPassword : newPassword)) {
                setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            } else {
                setError('');
            }
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        // Check for email
        if (!email) {
            setError('Vui lòng nhập địa chỉ email');
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin mật khẩu');
            return;
        }

        // Validate passwords match locally
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            // Send with the correct field names: email, password, recheck
            const response = await forgetPasswordAxios({ 
                email: email.trim(),
                password: newPassword,
                recheck: confirmPassword  // Use the recheck field as shown in the API docs
            });

            if (response.error) {
                throw new Error(response.message || 'Cập nhật mật khẩu thất bại');
            }

            setSuccess('Cập nhật mật khẩu thành công!');
            setTimeout(() => {
                onClose(); // Đóng popup
                window.location.reload(); // Reload trang
            }, 3000);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>×</button>
                <h2 className={cx('modalTitle')}>Cập nhật mật khẩu</h2>

                {error && (
                    <div className={cx('errorMessage')}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={cx('successMessage')}>
                        {success}
                    </div>
                )}
                
                <div className={cx('inputField')}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={handleInputChange}
                        readOnly={initialEmail !== ''} // Make it read-only if initialEmail was provided
                    />
                </div>
                <div className={cx('inputField')}>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={cx('inputField')}>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <button
                    className={cx('submitButton')}
                    onClick={handleSubmit}
                    disabled={!!error} // Vô hiệu hóa nút nếu có lỗi
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}

export default UpdatePasswordPopup;