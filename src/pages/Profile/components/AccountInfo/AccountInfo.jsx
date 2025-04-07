// src/pages/Profile/components/AccountInfo/AccountInfo.jsx
import React from 'react';
import { Edit2, User, Calendar, MapPin } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './AccountInfo.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const AccountInfo = ({ userData, onEditClick }) => {
  // Format date of birth if available
  const formatDateOfBirth = () => {
    if (userData.day && userData.month && userData.year) {
      return `${userData.day}/${userData.month}/${userData.year}`;
    }
    return 'Chưa cập nhật';
  };

  // Format gender for display
  const formatGender = () => {
    switch (userData.gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Chưa cập nhật';
    }
  };

  return (
    <div className={cx('card')}>
      <div className={cx('cardHeader')}>
        <h2>Thông tin tài khoản</h2>
        <button
          className={cx('button', 'text', 'editButton')}
          onClick={onEditClick}
          aria-label="Chỉnh sửa thông tin"
        >
          <Edit2 size={16} />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      <div className={cx('cardBody')}>
        {/* User profile header with avatar */}
        <div className={cx('profileHeader')}>
          <div className={cx('avatar', 'large')}>
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.fullName || 'User avatar'}
                className={cx('avatarImage')}
              />
            ) : (
              <User size={40} />
            )}
          </div>
          
          <div className={cx('profileHeaderInfo')}>
            <h3 className={cx('profileName')}>{userData.fullName || 'Chưa cập nhật'}</h3>
            <p className={cx('profileEmail')}>{userData.email}</p>
          </div>
        </div>

        {/* Profile information grid */}
        <div className={cx('infoGrid')}>
          <div className={cx('infoItem')}>
            <div className={cx('infoLabel')}>
              <User size={16} />
              <span>Họ và tên</span>
            </div>
            <div className={cx('infoValue')}>{userData.fullName || 'Chưa cập nhật'}</div>
          </div>
          
          <div className={cx('infoItem')}>
            <div className={cx('infoLabel')}>
              <span>Giới tính</span>
            </div>
            <div className={cx('infoValue')}>{formatGender()}</div>
          </div>
          
          <div className={cx('infoItem')}>
            <div className={cx('infoLabel')}>
              <Calendar size={16} />
              <span>Ngày sinh</span>
            </div>
            <div className={cx('infoValue')}>{formatDateOfBirth()}</div>
          </div>
          
          <div className={cx('infoItem', 'fullWidth')}>
            <div className={cx('infoLabel')}>
              <MapPin size={16} />
              <span>Địa chỉ</span>
            </div>
            <div className={cx('infoValue')}>
              {userData.address || 'Chưa cập nhật địa chỉ'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;