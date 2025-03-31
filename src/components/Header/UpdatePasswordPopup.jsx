import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './UpdatePasswordPopup.module.scss';
import { updatePasswordAxios } from '~/services/userAxios';

const cx = classNames.bind(styles);

function UpdatePasswordPopup({ onClose }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        try {
            const response = await updatePasswordAxios({
                newPassword,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.error) {
                throw new Error(response.message || 'Cập nhật mật khẩu thất bại');
            }

            setSuccess('Cập nhật mật khẩu thành công!');
            setTimeout(() => {
                onClose(); // Đóng popup sau khi thành công
            }, 2000);
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
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={cx('inputField')}>
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button className={cx('submitButton')} onClick={handleSubmit}>
                    Gửi
                </button>
            </div>
        </div>
    );
}

export default UpdatePasswordPopup;