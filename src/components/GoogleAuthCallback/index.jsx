// src/components/GoogleAuthCallback/index.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './GoogleAuthCallback.module.scss';
import { googleRedirectAxios } from '~/services/authAxios';

const cx = classNames.bind(styles);

function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Đang xử lý thông tin đăng nhập...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to process the authentication data
    const processAuthData = async () => {
      try {
        setStatus('Đang xử lý dữ liệu...');
        console.log('URL hiện tại:', window.location.href);
        
        // Process the authentication data using our updated service function
        const response = await googleRedirectAxios();
        
        if (response.error) {
          const errorMsg = response.message || 'Lỗi xác thực không xác định';
          console.error(errorMsg);
          setError(errorMsg);
          setStatus('Xác thực thất bại');
          setTimeout(() => navigate('/', { replace: true }), 3000);
          return;
        }
        
        if (response.success) {
          setStatus('Đăng nhập thành công! Đang chuyển hướng...');
          // Navigate to the home page
          setTimeout(() => navigate('/', { replace: true }), 1000);
          return;
        }
        
        // If we get here, something unexpected happened
        setError('Không thể xác thực. Vui lòng thử lại.');
        setStatus('Xác thực thất bại');
        setTimeout(() => navigate('/', { replace: true }), 3000);
      } catch (error) {
        const errorMsg = `Lỗi xử lý dữ liệu xác thực: ${error.message}`;
        console.error(errorMsg, error);
        setError(errorMsg);
        setStatus('Xác thực thất bại');
        setTimeout(() => navigate('/', { replace: true }), 3000);
      }
    };

    // Process authentication data when component mounts
    processAuthData();
  }, [navigate, location]);

  return (
    <div className={cx('google-auth-callback')}>
      <div className={cx('loading-container')}>
        <div className={cx('spinner')}></div>
        <p className={cx('status')}>{status}</p>
        
        {error && (
          <div className={cx('error-container')}>
            <p className={cx('error-title')}>Lỗi:</p>
            <p className={cx('error-message')}>{error}</p>
            <p className={cx('error-help')}>Bạn sẽ được chuyển hướng đến trang chủ trong giây lát.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleAuthCallback;