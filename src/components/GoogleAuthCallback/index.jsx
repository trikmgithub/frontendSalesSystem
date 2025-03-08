// src/components/GoogleAuthCallback/index.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './GoogleAuthCallback.module.scss';

const cx = classNames.bind(styles);

function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Đang xử lý thông tin đăng nhập...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to parse and process the authentication data
    const processAuthData = () => {
      try {
        setStatus('Đang xử lý dữ liệu...');
        console.log('URL hiện tại:', window.location.href);
        
        // Get the query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const encodedData = searchParams.get('data');
        
        if (!encodedData) {
          const errorMsg = 'Không tìm thấy dữ liệu xác thực trong URL';
          console.error(errorMsg);
          setError(errorMsg);
          setStatus('Xác thực thất bại');
          setTimeout(() => navigate('/', { replace: true }), 3000);
          return;
        }
        
        // Decode and parse the JSON data
        setStatus('Đang giải mã dữ liệu...');
        const userData = JSON.parse(decodeURIComponent(encodedData));
        setStatus('Phân tích dữ liệu thành công');
        
        // Store the authentication data in localStorage
        if (userData.access_token) {
          setStatus('Đang lưu thông tin đăng nhập...');
          localStorage.setItem('access_token', userData.access_token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar
            })
          );
          
          setStatus('Đăng nhập thành công! Đang chuyển hướng...');
          // Navigate to the home page
          setTimeout(() => navigate('/', { replace: true }), 1000);
        } else {
          const errorMsg = 'Dữ liệu xác thực không hợp lệ: thiếu access token';
          console.error(errorMsg);
          setError(errorMsg);
          setStatus('Xác thực thất bại');
          setTimeout(() => navigate('/', { replace: true }), 3000);
        }
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