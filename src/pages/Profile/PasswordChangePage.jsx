import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import cx from 'classnames';
import styles from './ProfilePage.module.scss';
import { useNavigate } from 'react-router-dom';

const PasswordChangePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Use navigate for redirecting to other pages
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.email) {
          setEmail(user.email);
          console.log("Email from user object:", user.email);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    
    // If we couldn't get the email from the user object,
    // extract it from the token as a fallback
    if (!email) {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjdkZTdjZWFmMzk0NDAwNmRkYTA2N2Y4IiwibmFtZSI6IlNvbiBOZ3V5ZW4iLCJlbWFpbCI6Im5ndGhlc29uMjI0QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQyNjQyNDk5LCJleHAiOjE3NDI2NDYwOTl9.zeo1v9RusIgIh6dF9N__HdLFP6lgHNiY2OMafRLFApg';
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.email) {
          setEmail(payload.email);
          console.log("Email from token:", payload.email);
        }
      } catch (error) {
        console.error('Error extracting email from token:', error);
      }
    }
  }, []);

  const validateForm = () => {
    // Reset previous message
    setMessage({ text: '', type: '' });

    // Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ 
        text: 'Vui lòng điền đầy đủ thông tin', 
        type: 'error' 
      });
      return false;
    }

    // Check if new password meets requirements (6-32 characters)
    if (newPassword.length < 6 || newPassword.length > 32) {
      setMessage({ 
        text: 'Mật khẩu mới phải từ 6 đến 32 ký tự', 
        type: 'error' 
      });
      return false;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage({ 
        text: 'Mật khẩu nhập lại không khớp', 
        type: 'error' 
      });
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    // Check that we have an email before proceeding
    if (!email) {
      setMessage({
        text: 'Không thể xác định email người dùng',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Lấy access token từ localStorage
      let accessToken = localStorage.getItem('access_token');
      
      // Nếu không có trong localStorage, dùng token cứng
      if (!accessToken) {
        accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjdkZTdjZWFmMzk0NDAwNmRkYTA2N2Y4IiwibmFtZSI6IlNvbiBOZ3V5ZW4iLCJlbWFpbCI6Im5ndGhlc29uMjI0QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQyNjQyNDk5LCJleHAiOjE3NDI2NDYwOTl9.zeo1v9RusIgIh6dF9N__HdLFP6lgHNiY2OMafRLFApg';
      }
      
      // Trim mật khẩu để loại bỏ khoảng trắng không mong muốn
      const trimmedPassword = currentPassword.trim();
      const trimmedNewPassword = newPassword.trim();
      
      const requestData = {
        email: email,
        password: trimmedPassword,
        newPassword: trimmedNewPassword
      };
      
      console.log('Sending password update request:', JSON.stringify(requestData));
      
      const response = await fetch('http://localhost:8000/api/v1/users/password', {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        // Password updated successfully
        setMessage({ 
          text: 'Cập nhật mật khẩu thành công', 
          type: 'success' 
        });
        
        // Clear form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Server returned an error
        setMessage({ 
          text: data.message || 'Cập nhật mật khẩu thất bại', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ 
        text: 'Đã có lỗi xảy ra, vui lòng thử lại sau', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx(styles.profileContainer)}>
      {/* Sidebar - Giữ nguyên từ ProfilePage */}
      <div className={cx(styles.sidebar)}>
        <div className={cx(styles.sidebarHeader)}>
          <div className={cx(styles.avatarPlaceholder)}>
            <User size={32} className={cx(styles.avatarIcon)} />
          </div>
          <div className={cx(styles.userInfo)}>
            <h2 className={cx(styles.userGreeting)}>Chào (K18 HCM)</h2>
            <p className={cx(styles.editAccount)}>Chỉnh sửa tài khoản</p>
          </div>
        </div>
        
        <div className={cx(styles.navigation)}>
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'profile' })}
            onClick={() => setSelectedTab('profile')}
          >
            Thông tin tài khoản
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'orders' })}
            onClick={() => navigate('/profile/orders')}
          >
            Đơn hàng của tôi
          </button>
          
          <button 
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'favorites' })}
            onClick={() => navigate('/profile/favorites')}
          >
            Danh sách yêu thích
          </button>
        </div>
      </div>

      {/* Main Content - Trang đổi mật khẩu */}
      <div className={cx(styles.mainContent)}>
        <div className={cx(styles.contentSection)}>
          <h1 className={cx(styles.sectionTitle)}>Thay đổi mật khẩu</h1>
          
          {message.text && (
            <div className={cx(styles.messageBox, {
              [styles.errorMessage]: message.type === 'error',
              [styles.successMessage]: message.type === 'success'
            })}>
              {message.text}
            </div>
          )}
          
          {/* Removed email display */}
          
          <div className={cx(styles.passwordForm)}>
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Mật khẩu hiện tại:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Nhập mật khẩu cũ"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="off" // Ngăn trình duyệt tự động điền
              />
            </div>
            
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Mật khẩu mới:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Mật khẩu từ 6 đến 32 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className={cx(styles.passwordField)}>
              <label className={cx(styles.passwordLabel)}>Nhập lại:</label>
              <input 
                type="password" 
                className={cx(styles.textInput)}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className={cx(styles.passwordFormActions)}>
              <button 
                className={cx(styles.updatePasswordButton, {
                  [styles.buttonLoading]: isLoading
                })}
                onClick={handleUpdatePassword}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangePage;