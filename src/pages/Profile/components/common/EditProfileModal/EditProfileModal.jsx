// src/pages/Profile/components/common/EditProfileModal/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, User, MapPin } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './EditProfileModal.module.scss';
import sharedStyles from '../../../styles/ProfileShared.module.scss';
import AddressSelector from '~/components/AddressSelector';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  userData, 
  onSubmit, 
  isLoading 
}) => {
  // Form data state
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    gender: userData.gender || '',
    day: userData.day || '',
    month: userData.month || '',
    year: userData.year || '',
    agreeToPolicy: false
  });
  
  // Address data from AddressSelector
  const [addressData, setAddressData] = useState(null);
  
  // Form validation errors
  const [errors, setErrors] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    policy: ''
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        gender: userData.gender || '',
        day: userData.day || '',
        month: userData.month || '',
        year: userData.year || '',
        agreeToPolicy: false
      });
    }
  }, [userData]);

  // Disable body scroll when modal is open
  useDisableBodyScroll(isOpen);
  
  if (!isOpen) return null;

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle address changes from AddressSelector
  const handleAddressChange = (newAddressData) => {
    setAddressData(newAddressData);
    
    // Clear address error when address is updated
    if (errors.address) {
      setErrors(prev => ({
        ...prev,
        address: ''
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      policy: ''
    };
    
    let isValid = true;
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      isValid = false;
    }
    
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Vui lòng chọn giới tính';
      isValid = false;
    }
    
    // Validate date of birth
    if (formData.day || formData.month || formData.year) {
      // If any date field is provided, all are required
      if (!formData.day || !formData.month || !formData.year) {
        newErrors.dateOfBirth = 'Vui lòng nhập đầy đủ ngày, tháng, năm sinh';
        isValid = false;
      }
    }
    
    // Validate address
    if (!addressData || !addressData.formattedAddress) {
      newErrors.address = 'Vui lòng nhập địa chỉ đầy đủ';
      isValid = false;
    }
    
    // Validate policy agreement
    if (!formData.agreeToPolicy) {
      newErrors.policy = 'Vui lòng đồng ý với chính sách xử lý dữ liệu cá nhân';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      address: addressData.formattedAddress
    };
    
    // Update user data in localStorage to ensure address is immediately available
    try {
      const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUserData && storedUserData._id) {
        // Update the address in the user object
        storedUserData.address = addressData.formattedAddress;
        
        // Save the updated user back to localStorage
        localStorage.setItem('user', JSON.stringify(storedUserData));
        
        // Dispatch storage event for real-time updates in other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(storedUserData),
          url: window.location.href
        }));
        
        console.log('User address updated in localStorage and event dispatched');
      }
    } catch (error) {
      console.error('Error updating user address in localStorage:', error);
    }
    
    // Call the onSubmit callback to handle API update
    onSubmit(submissionData);
  };

  // Array of days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Array of months (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Array of years (current year - 100 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className={cx('modalOverlay')}>
      <div className={cx('modalContent')}>
        <div className={cx('modalHeader')}>
          <h3>Chỉnh sửa thông tin tài khoản</h3>
          <button 
            className={cx('closeButton')} 
            onClick={onClose}
            aria-label="Đóng"
            style={{ border: 'none', outline: 'none' }}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={cx('modalBody', 'customScroll')}>
          {/* Personal Information Section */}
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <User size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Thông tin cá nhân</h4>
              
              {/* Full Name */}
              <div className={cx('formGroup', { hasError: !!errors.fullName })}>
                <label className={cx('formLabel')}>Họ và tên <span className={cx('requiredMark')}>*</span></label>
                <input
                  type="text"
                  className={cx('formInput')}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                />
                {errors.fullName && <span className={cx('errorMessage')}>{errors.fullName}</span>}
              </div>
              
              {/* Email (disabled) */}
              <div className={cx('formGroup')}>
                <label className={cx('formLabel')}>Email</label>
                <div className={cx('inputWithIcon')}>
                  <input
                    type="email"
                    className={cx('formInput', 'disabled')}
                    value={userData.email || ''}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              
              {/* Gender */}
              <div className={cx('formGroup', { hasError: !!errors.gender })}>
                <label className={cx('formLabel')}>Giới tính <span className={cx('requiredMark')}>*</span></label>
                <div className={cx('radioGroup')}>
                  <label className={cx('radioLabel')}>
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'male'}
                      onChange={() => handleChange('gender', 'male')}
                      className={cx('radioInput')}
                    />
                    <div className={cx('customRadio', { checked: formData.gender === 'male' })}>
                      {formData.gender === 'male' && <Check size={12} />}
                    </div>
                    <span>Nam</span>
                  </label>
                  
                  <label className={cx('radioLabel')}>
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'female'}
                      onChange={() => handleChange('gender', 'female')}
                      className={cx('radioInput')}
                    />
                    <div className={cx('customRadio', { checked: formData.gender === 'female' })}>
                      {formData.gender === 'female' && <Check size={12} />}
                    </div>
                    <span>Nữ</span>
                  </label>
                </div>
                {errors.gender && <span className={cx('errorMessage')}>{errors.gender}</span>}
              </div>
            </div>
          </div>
          
          {/* Date of Birth Section */}
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <Calendar size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Ngày sinh <span className={cx('requiredMark')}>*</span></h4>
              
              <div className={cx('dateSelects', { hasError: !!errors.dateOfBirth })}>
                <div className={cx('dateSelect')}>
                  <select 
                    value={formData.day} 
                    onChange={(e) => handleChange('day', e.target.value)}
                    className={cx('formInput')}
                    aria-label="Ngày"
                  >
                    <option value="">Ngày</option>
                    {days.map(day => (
                      <option key={`day-${day}`} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div className={cx('dateSelect')}>
                  <select 
                    value={formData.month} 
                    onChange={(e) => handleChange('month', e.target.value)}
                    className={cx('formInput')}
                    aria-label="Tháng"
                  >
                    <option value="">Tháng</option>
                    {months.map(month => (
                      <option key={`month-${month}`} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div className={cx('dateSelect')}>
                  <select 
                    value={formData.year} 
                    onChange={(e) => handleChange('year', e.target.value)}
                    className={cx('formInput')}
                    aria-label="Năm"
                  >
                    <option value="">Năm</option>
                    {years.map(year => (
                      <option key={`year-${year}`} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.dateOfBirth && <span className={cx('errorMessage')}>{errors.dateOfBirth}</span>}
            </div>
          </div>
          
          {/* Address Section */}
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <MapPin size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Địa chỉ <span className={cx('requiredMark')}>*</span></h4>
              
              <div className={cx('addressContainer', { hasError: !!errors.address })}>
                <AddressSelector 
                  initialAddress={userData.address || ''} 
                  onAddressChange={handleAddressChange}
                  className={cx('addressSelector')}
                />
                {errors.address && <span className={cx('errorMessage')}>{errors.address}</span>}
              </div>
            </div>
          </div>
          
          {/* Privacy Policy Agreement */}
          <div className={cx('agreement', { hasError: !!errors.policy })}>
            <label className={cx('checkboxLabel')}>
              <input
                type="checkbox"
                checked={formData.agreeToPolicy}
                onChange={() => handleChange('agreeToPolicy', !formData.agreeToPolicy)}
                className={cx('checkboxInput')}
              />
              <div className={cx('customCheckbox', { checked: formData.agreeToPolicy })}>
                {formData.agreeToPolicy && <Check size={12} />}
              </div>
              <span>
                Tôi đồng ý với <a href="#" className={cx('policyLink')}>chính sách xử lý dữ liệu cá nhân</a> của Beauty Skin
              </span>
            </label>
            {errors.policy && <span className={cx('errorMessage')}>{errors.policy}</span>}
          </div>
        
          <div className={cx('modalFooter')}>
            <button
              type="button"
              className={cx('button', 'secondary')}
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
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
                'Cập nhật'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;