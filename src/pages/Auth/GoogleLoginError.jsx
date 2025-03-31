// src/pages/Auth/GoogleLoginError.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import styles from './GoogleLoginError.module.scss';
import classNames from 'classnames/bind';
import { IoWarning } from 'react-icons/io5';

const cx = classNames.bind(styles);

function GoogleLoginError() {
  const { openLogin } = useAuth();

  return (
    <div className={cx('container')}>
      <div className={cx('error-box')}>
        <IoWarning className={cx('warning-icon')} />
        <h2>Đăng nhập không thành công</h2>
        <p>
          Email này đã được đăng ký trong hệ thống. Vui lòng đăng nhập bằng mật khẩu thay vì sử dụng đăng nhập Google.
        </p>
        <p>
          Nếu bạn không nhớ mật khẩu, vui lòng sử dụng chức năng "Quên mật khẩu" để đặt lại mật khẩu của bạn.
        </p>
        <div className={cx('actions')}>
          <button className={cx('login-btn')} onClick={openLogin}>
            Đăng nhập
          </button>
          <Link to="/" className={cx('home-btn')}>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GoogleLoginError;