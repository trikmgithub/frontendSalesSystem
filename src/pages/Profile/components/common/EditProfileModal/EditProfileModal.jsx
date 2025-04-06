// src/pages/Profile/components/common/EditProfileModal/EditProfileModal.jsx
import React, { useState } from 'react';
import { X, Check, Calendar, User, MapPin } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './EditProfileModal.module.scss';
import sharedStyles from '../../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  userData, 
  onSubmit, 
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    gender: userData.gender || '',
    day: userData.day || '',
    month: userData.month || '',
    year: userData.year || '',
    address: userData.address || '',
    agreeToPolicy: false
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={cx('modalBody')}>
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <User size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Thông tin cá nhân</h4>
              
              <div className={cx('formGroup')}>
                <label className={cx('formLabel')}>Họ và tên</label>
                <input
                  type="text"
                  className={cx('formInput')}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              
              <div className={cx('formGroup')}>
                <label className={cx('formLabel')}>Email</label>
                <input
                  type="email"
                  className={cx('formInput', 'disabled')}
                  value={userData.email || ''}
                  disabled
                  readOnly
                />
                <p className={cx('inputHelp')}>Email không thể thay đổi</p>
              </div>
              
              <div className={cx('formGroup')}>
                <label className={cx('formLabel')}>Giới tính</label>
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
              </div>
            </div>
          </div>
          
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <Calendar size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Ngày sinh</h4>
              <p className={cx('sectionDescription')}>Thông tin này không bắt buộc</p>
              
              <div className={cx('dateSelects')}>
                <div className={cx('dateSelect')}>
                  <select 
                    value={formData.day} 
                    onChange={(e) => handleChange('day', e.target.value)}
                    className={cx('formInput')}
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
                  >
                    <option value="">Năm</option>
                    {years.map(year => (
                      <option key={`year-${year}`} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cx('formSection')}>
            <div className={cx('sectionIcon')}>
              <MapPin size={18} />
            </div>
            <div className={cx('sectionContent')}>
              <h4 className={cx('sectionTitle')}>Địa chỉ</h4>
              
              <div className={cx('formGroup')}>
                <input
                  type="text"
                  className={cx('formInput')}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ đầy đủ của bạn"
                />
              </div>
            </div>
          </div>
          
          <div className={cx('agreement')}>
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
              disabled={isLoading || !formData.agreeToPolicy}
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