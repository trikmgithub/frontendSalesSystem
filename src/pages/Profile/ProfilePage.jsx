// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './styles/ProfileShared.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import AccountInfo from './components/AccountInfo/AccountInfo';
import SecuritySection from './components/SecuritySection/SecuritySection';
import PhoneSection from './components/PhoneSection/PhoneSection';
import EditProfileModal from './components/common/EditProfileModal/EditProfileModal';
import Toast from './components/common/Toast/Toast';
import { updateUserAxios, getPhoneAxios, updatePhoneAxios } from '~/services/userAxios';

const cx = classNames.bind(styles);

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // User data state
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    address: '',
    avatar: null,
    userId: '',
    phone: ''
  });

  // Load user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Set up the userData state
      const newUserData = {
        fullName: user.name || '',
        email: user.email || '',
        gender: user.gender?.toLowerCase() || '',
        address: user.address || '',
        userId: user._id || '',
        avatar: user.avatar || null,
        phone: user.phone || '',
        day: '',
        month: '',
        year: ''
      };

      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);
        newUserData.day = date.getDate().toString();
        newUserData.month = (date.getMonth() + 1).toString();
        newUserData.year = date.getFullYear().toString();
      }

      setUserData(newUserData);
    } else {
      console.warn('Không tìm thấy dữ liệu người dùng trong localStorage');
    }
  }, []);

  // Load phone number from API
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await getPhoneAxios();
        if (response && response.error) {
          throw new Error(response.message);
        }
        
        // Check if phone property exists in the response
        if (response && typeof response.phone !== 'undefined') {
          setUserData((prev) => ({ ...prev, phone: response.phone }));
        } else {
          console.warn('Không tìm thấy số điện thoại trong phản hồi API');
        }
      } catch (error) {
        console.error('Lỗi khi tải số điện thoại:', error);
        showToast('Không thể tải số điện thoại', 'error');
      }
    };

    fetchPhone();
  }, []);

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Close toast notification
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Open the edit modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the edit modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    // Check if policy is agreed to
    if (!formData.agreeToPolicy) {
      showToast('Vui lòng đồng ý với chính sách xử lý dữ liệu cá nhân', 'error');
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      showToast('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.', 'error');
      return;
    }

    // Format day and month with leading zeros
    const formattedDay = String(formData.day).padStart(2, '0');
    const formattedMonth = String(formData.month).padStart(2, '0');

    // Only include dateOfBirth if all date parts are provided
    let dateOfBirth;
    if (formData.year && formData.month && formData.day) {
      dateOfBirth = `${formData.year}-${formattedMonth}-${formattedDay}T00:00:00.000Z`;
    }

    // Prepare data to send
    const updateData = {
      _id: userData.userId,
      email: userData.email,
      name: formData.fullName,
      gender: formData.gender,
      role: 'user',
      address: formData.address,
    };

    // Only include dateOfBirth if it's valid
    if (dateOfBirth) {
      updateData.dateOfBirth = dateOfBirth;
    }

    setIsLoading(true);

    try {
      // Call API through userAxios
      const response = await updateUserAxios(updateData);
      if (response.error) {
        throw new Error(response.message);
      }

      // Update userData state with new values
      setUserData(prev => ({
        ...prev,
        fullName: formData.fullName,
        gender: formData.gender,
        day: formData.day,
        month: formData.month,
        year: formData.year,
        address: formData.address
      }));

      // Also update the user in localStorage
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.name = formData.fullName;
          user.gender = formData.gender;
          user.address = formData.address;
          if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
          }
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật người dùng trong localStorage:', err);
      }

      showToast('Thông tin đã được cập nhật thành công!', 'success');
      closeModal();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);

      // Log additional error details if available
      if (error.response) {
        console.error('Dữ liệu phản hồi lỗi:', error.response.data);
        console.error('Trạng thái phản hồi lỗi:', error.response.status);
      }

      showToast(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone number update
  const handleUpdatePhone = async (phone) => {
    setIsUpdatingPhone(true);
    try {
      const response = await updatePhoneAxios({ phone });
      if (response && response.error) {
        throw new Error(response.message || 'Không thể cập nhật số điện thoại');
      }
      
      // Update userData state
      setUserData(prev => ({ ...prev, phone }));
      
      // Update localStorage
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.phone = phone;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật số điện thoại trong localStorage:', err);
      }
      
      showToast('Cập nhật số điện thoại thành công!', 'success');
    } catch (error) {
      console.error('Lỗi khi cập nhật số điện thoại:', error);
      showToast(error.message || 'Không thể cập nhật số điện thoại', 'error');
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  return (
    <div className={cx('pageContainer')}>
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        selectedTab={selectedTab} 
        userInfo={userData} 
      />
      
      {/* Main Content */}
      <div className={cx('mainContent')}>
        {/* Account Information */}
        <AccountInfo 
          userData={userData} 
          onEditClick={openModal} 
        />
        
        {/* Security Section */}
        <SecuritySection />
        
        {/* Phone Section */}
        <PhoneSection 
          phone={userData.phone} 
          onUpdatePhone={handleUpdatePhone} 
          isUpdating={isUpdatingPhone} 
        />
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        userData={userData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfilePage;