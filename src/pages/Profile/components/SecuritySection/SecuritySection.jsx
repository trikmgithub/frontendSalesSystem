// src/pages/Profile/components/SecuritySection/SecuritySection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './SecuritySection.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';
import routes from '~/config/routes';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const SecuritySection = () => {
  const navigate = useNavigate();
  
  const handleChangePassword = () => {
    navigate(routes.passwordChangePage);
  };
  
  return (
    <div className={cx('card')}>
      <div className={cx('cardHeader')}>
        <div className={cx('headerWithIcon')}>
          <Shield size={20} className={cx('headerIcon')} />
          <h2>Bảo mật</h2>
        </div>
      </div>
      
      <div className={cx('cardBody')}>
        <div className={cx('securityItem')}>
          <div className={cx('securityInfo')}>
            <div className={cx('securityIcon')}>
              <Lock size={20} />
            </div>
            <div className={cx('securityText')}>
              <h3 className={cx('securityTitle')}>Mật khẩu</h3>
              <p className={cx('securityDescription')}>
                Quản lý mật khẩu đăng nhập của bạn
              </p>
            </div>
          </div>
          
          <button 
            className={cx('button', 'secondary')}
            onClick={handleChangePassword}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;