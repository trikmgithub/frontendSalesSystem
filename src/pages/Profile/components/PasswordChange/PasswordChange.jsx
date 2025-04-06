// src/pages/Profile/components/PasswordChange/PasswordChange.jsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './PasswordChange.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';
import { updatePasswordAxios } from '~/services/userAxios';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const PasswordChange = ({ email, onSuccess, onError }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: ''
    };
    let isValid = true;

    // Check if current password is provided
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
      isValid = false;
    }

    // Check if new password is provided
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (newPassword.length < 6 || newPassword.length > 32) {
      newErrors.newPassword = 'Mật khẩu mới phải từ 6 đến 32 ký tự';
      isValid = false;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check that we have an email before proceeding
    if (!email) {
      setErrors(prev => ({ ...prev, general: 'Không thể xác định email người dùng' }));
      return;
    }

    setIsLoading(true);

    try {
      // Trim passwords to remove unwanted whitespace
      const trimmedPassword = currentPassword.trim();
      const trimmedNewPassword = newPassword.trim();
      
      const requestData = {
        email: email,
        password: trimmedPassword,
        newPassword: trimmedNewPassword
      };
      
      // Use the axios service
      const response = await updatePasswordAxios(requestData);

      if (!response.error) {
        // Password updated successfully
        onSuccess('Cập nhật mật khẩu thành công');
        
        // Clear form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          general: ''
        });
      } else {
        // Server returned an error
        onError(response.message || 'Cập nhật mật khẩu thất bại');
        
        // If it's an authentication error, highlight the current password field
        if (response.status === 401) {
          setErrors(prev => ({ ...prev, currentPassword: 'Mật khẩu hiện tại không chính xác' }));
        } else {
          setErrors(prev => ({ ...prev, general: response.message || 'Đã có lỗi xảy ra' }));
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      onError('Đã có lỗi xảy ra, vui lòng thử lại sau');
      setErrors(prev => ({ ...prev, general: 'Đã có lỗi xảy ra, vui lòng thử lại sau' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx('card')}>
      <div className={cx('cardHeader')}>
        <div className={cx('headerWithIcon')}>
          <Lock size={20} className={cx('headerIcon')} />
          <h2>Đổi mật khẩu</h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={cx('cardBody')}>
        {errors.general && (
          <div className={cx('errorAlert')}>
            {errors.general}
          </div>
        )}
        
        <div className={cx('formGroup', { hasError: !!errors.currentPassword })}>
          <label className={cx('formLabel')}>Mật khẩu hiện tại</label>
          <div className={cx('passwordInputWrapper')}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              className={cx('formInput')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              disabled={isLoading}
            />
            <button
              type="button"
              className={cx('passwordToggle')}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={isLoading}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className={cx('errorMessage')}>{errors.currentPassword}</p>
          )}
        </div>
        
        <div className={cx('formGroup', { hasError: !!errors.newPassword })}>
          <label className={cx('formLabel')}>Mật khẩu mới</label>
          <div className={cx('passwordInputWrapper')}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              className={cx('formInput')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu từ 6 đến 32 ký tự"
              disabled={isLoading}
            />
            <button
              type="button"
              className={cx('passwordToggle')}
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isLoading}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className={cx('errorMessage')}>{errors.newPassword}</p>
          )}
        </div>
        
        <div className={cx('formGroup', { hasError: !!errors.confirmPassword })}>
          <label className={cx('formLabel')}>Nhập lại mật khẩu mới</label>
          <div className={cx('passwordInputWrapper')}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={cx('formInput')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              disabled={isLoading}
            />
            <button
              type="button"
              className={cx('passwordToggle')}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={cx('errorMessage')}>{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className={cx('formActions')}>
          <button
            type="submit"
            className={cx('button', 'primary')}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={cx('spinner')}></span>
                <span>Đang xử lý...</span>
              </>
            ) : (
              'Cập nhật mật khẩu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;