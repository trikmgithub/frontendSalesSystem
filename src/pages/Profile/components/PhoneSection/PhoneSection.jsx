// src/pages/Profile/components/PhoneSection/PhoneSection.jsx
import React, { useState } from 'react';
import { Phone, Check } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './PhoneSection.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const PhoneSection = ({ phone, onUpdatePhone, isUpdating }) => {
  const [phoneNumber, setPhoneNumber] = useState(phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Validate phone number - updated to require exactly 10 digits
  const validatePhone = (number) => {
    // Check if input is empty
    if (!number) {
      setValidationError('Vui lòng nhập số điện thoại');
      return false;
    }
    
    // Check if input has exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(number)) {
      setValidationError('Vui lòng nhập số điện thoại đúng 10 chữ số');
      return false;
    }
    
    return true;
  };
  
  const handlePhoneChange = (e) => {
    // Only allow numeric input
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    
    // Clear validation error when typing
    if (validationError) {
      setValidationError('');
    }
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset the phone number
      setPhoneNumber(phone || '');
      setValidationError('');
    }
    
    setIsEditing(!isEditing);
  };
  
  const handleSubmit = () => {
    if (!validatePhone(phoneNumber)) {
      return; // Validation error is already set by validatePhone function
    }
    
    onUpdatePhone(phoneNumber);
    setIsEditing(false);
  };
  
  return (
    <div className={cx('card')}>
      <div className={cx('cardHeader')}>
        <div className={cx('headerWithIcon')}>
          <Phone size={20} className={cx('headerIcon')} />
          <h2>Số điện thoại</h2>
        </div>
      </div>
      
      <div className={cx('cardBody')}>
        <div className={cx('phoneContainer')}>
          {isEditing ? (
            // Edit mode
            <div className={cx('phoneEditForm')}>
              <div className={cx('formGroup', { hasError: !!validationError })}>
                <input
                  type="tel"
                  className={cx('formInput')}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Nhập số điện thoại 10 chữ số"
                  disabled={isUpdating}
                  maxLength={10} // Limit input to 10 characters
                />
                {validationError && (
                  <p className={cx('errorMessage')}>{validationError}</p>
                )}
              </div>
              
              <div className={cx('actionButtons')}>
                <button 
                  className={cx('button', 'secondary')}
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                
                <button 
                  className={cx('button', 'primary')}
                  onClick={handleSubmit}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className={cx('spinner')}></span>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Lưu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Display mode
            <div className={cx('phoneDisplay')}>
              <div className={cx('phoneInfo')}>
                <div className={cx('phoneIcon')}>
                  <Phone size={20} />
                </div>
                
                <div className={cx('phoneText')}>
                  <h3 className={cx('phoneLabel')}>Số điện thoại</h3>
                  <p className={cx('phoneValue')}>
                    {phone ? phone : 'Chưa cập nhật số điện thoại'}
                  </p>
                </div>
              </div>
              
              <button 
                className={cx('button', 'secondary')}
                onClick={handleEditToggle}
              >
                {phone ? 'Cập nhật' : 'Thêm số điện thoại'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneSection;