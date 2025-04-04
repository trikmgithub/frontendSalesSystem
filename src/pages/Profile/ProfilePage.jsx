import React, { useState, useEffect } from 'react';
import { User, Lock, Edit2, X, Check, Phone } from 'lucide-react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import routes from '~/config/routes';
import { updateUserAxios, getPhoneAxios, updatePhoneAxios } from '~/services/userAxios';
import ToastNotification from './ToastNotification';

const ProfilePage = () => {
  // State variables
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Form data state (for the modal)
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    address: '',
    agreeToPolicy: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const navigate = useNavigate();

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

      // Also initialize the form data
      setFormData({
        fullName: newUserData.fullName,
        gender: newUserData.gender,
        day: newUserData.day,
        month: newUserData.month,
        year: newUserData.year,
        address: newUserData.address,
        agreeToPolicy: false
      });
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

  // Format the date of birth for display
  const formatDateOfBirth = () => {
    if (userData.day && userData.month && userData.year) {
      return `${userData.day}/${userData.month}/${userData.year}`;
    }
    return 'Chưa cập nhật';
  };

  // Open the edit modal
  const openModal = () => {
    setFormData({
      fullName: userData.fullName,
      gender: userData.gender,
      day: userData.day,
      month: userData.month,
      year: userData.year,
      address: userData.address,
      agreeToPolicy: false
    });
    setIsModalOpen(true);
  };

  // Close the edit modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle changes in form fields
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    // Basic validation - phone should be numeric and have a reasonable length
    if (!phone) return false;
    const phoneRegex = /^\d{9,15}$/; // 9-15 digits
    return phoneRegex.test(phone);
  };

  // Submit the form data
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

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

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Close toast notification
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    // Only allow numeric input
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserData(prev => ({ ...prev, phone: value }));
  };

  // Update phone number
  const updatePhone = async () => {
    // Validate phone number before sending to API
    if (!validatePhoneNumber(userData.phone)) {
      showToast('Vui lòng nhập số điện thoại hợp lệ (9-15 chữ số)', 'error');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await updatePhoneAxios({ phone: userData.phone });
      if (response && response.error) {
        throw new Error(response.message || 'Không thể cập nhật số điện thoại');
      }
      
      // Update localStorage
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.phone = userData.phone;
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
    <div className={cx(styles.profileContainer)}>
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Sidebar */}
      <div className={cx(styles.sidebar)}>
        <div className={cx(styles.sidebarHeader)}>
          <div className={cx(styles.avatarPlaceholder)}>
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt="Avatar"
                className={cx(styles.avatarImage)}
              />
            ) : (
              <User size={32} className={cx(styles.avatarIcon)} />
            )}
          </div>
          <div className={cx(styles.userInfo)}>
            <h2 className={cx(styles.userGreeting)}>
              Chào {userData.fullName ? userData.fullName.split(' ').pop() : '(K18 HCM)'}
            </h2>
            <p className={cx(styles.editAccount)} onClick={openModal}>
              Chỉnh sửa tài khoản
            </p>
          </div>
        </div>

        <div className={cx(styles.navigation)}>
          <button
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'profile' })}
            onClick={() => {
              setSelectedTab('profile');
              navigate(routes.profile);
            }}
          >
            Thông tin tài khoản
          </button>

          <button
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'orders' })}
            onClick={() => {
              setSelectedTab('orders');
              navigate(routes.ordersPage);
            }}
          >
            Đơn hàng của tôi
          </button>

          <button
            className={cx(styles.navItem, { [styles.active]: selectedTab === 'favorites' })}
            onClick={() => {
              setSelectedTab('favorites');
              navigate(routes.favorites);
            }}
          >
            Danh sách yêu thích
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cx(styles.mainContent)}>
        {selectedTab === 'profile' && (
          <>
            {/* Profile Information Card */}
            <div className={cx(styles.contentSection)}>
              <div className={cx(styles.profileHeader)}>
                <h1 className={cx(styles.sectionTitle)}>Thông tin tài khoản</h1>
                <button
                  className={cx(styles.editProfileButton)}
                  onClick={openModal}
                >
                  <Edit2 size={16} />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              {/* Profile Information Display */}
              <div className={cx(styles.profileInfo)}>
                {/* Avatar Display Section */}
                <div className={cx(styles.avatarDisplaySection)}>
                  <div className={cx(styles.avatarLarge)}>
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Avatar"
                        className={cx(styles.avatarImage)}
                      />
                    ) : (
                      <User size={64} className={cx(styles.avatarIconLarge)} />
                    )}
                  </div>
                  <div className={cx(styles.avatarInfo)}>
                    <h3 className={cx(styles.userName)}>{userData.fullName || 'Chưa cập nhật'}</h3>
                    <p className={cx(styles.userEmail)}>{userData.email}</p>
                  </div>
                </div>

                <div className={cx(styles.profileRow)}>
                  <div className={cx(styles.profileField)}>
                    <span className={cx(styles.fieldLabel)}>Họ và tên</span>
                    <span className={cx(styles.fieldValue)}>
                      {userData.fullName || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className={cx(styles.profileField)}>
                    <span className={cx(styles.fieldLabel)}>Email</span>
                    <span className={cx(styles.fieldValue)}>
                      {userData.email}
                    </span>
                  </div>
                </div>

                <div className={cx(styles.profileRow)}>
                  <div className={cx(styles.profileField)}>
                    <span className={cx(styles.fieldLabel)}>Giới tính</span>
                    <span className={cx(styles.fieldValue)}>
                      {userData.gender === 'male' ? 'Nam' :
                        userData.gender === 'female' ? 'Nữ' :
                          'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className={cx(styles.profileField)}>
                    <span className={cx(styles.fieldLabel)}>Ngày sinh</span>
                    <span className={cx(styles.fieldValue)}>
                      {formatDateOfBirth()}
                    </span>
                  </div>
                </div>

                <div className={cx(styles.profileRow)}>
                  <div className={cx(styles.profileField, styles.fullWidth)}>
                    <span className={cx(styles.fieldLabel)}>Địa chỉ</span>
                    <span className={cx(styles.fieldValue)}>
                      {userData.address || 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className={cx(styles.contentSection)}>
              <div className={cx(styles.sectionHeader)}>
                <Lock className={cx(styles.sectionIcon)} />
                <h2 className={cx(styles.sectionSubtitle)}>Bảo mật</h2>
              </div>

              <div className={cx(styles.passwordSection)}>
                <span className={cx(styles.passwordLabel)}>Đổi mật khẩu</span>
                <button
                  className={cx(styles.secondaryButton)}
                  onClick={() => navigate(routes.passwordChangePage)}
                >
                  Cập nhật
                </button>
              </div>
            </div>

            {/* Phone Section */}
            <div className={cx(styles.contentSection)}>
              <div className={cx(styles.sectionHeader)}>
                <Phone className={cx(styles.sectionIcon)} />
                <h2 className={cx(styles.sectionSubtitle)}>Số điện thoại</h2>
              </div>

              <div className={cx(styles.phoneSection)}>
                <div className={cx(styles.fieldGroup)}>
                  <label className={cx(styles.fieldLabel)}>Số điện thoại</label>
                  <div className={cx(styles.phoneInputWrapper)}>
                    <input
                      type="text"
                      className={cx(styles.textInput)}
                      value={userData.phone || ''}
                      onChange={handlePhoneChange}
                      placeholder="Nhập số điện thoại"
                    />
                    <button
                      className={cx(styles.updateButton)}
                      onClick={updatePhone}
                      disabled={isUpdatingPhone}
                    >
                      {isUpdatingPhone ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className={cx(styles.modalOverlay)}>
          <div className={cx(styles.modalContent)}>
            <div className={cx(styles.modalHeader)}>
              <h2 className={cx(styles.modalTitle)}>Chỉnh sửa thông tin tài khoản</h2>
              <button className={cx(styles.closeButton)} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form className={cx(styles.modalForm)} onSubmit={handleSubmit}>
              <div className={cx(styles.formField)}>
                <label className={cx(styles.formLabel)}>Họ và tên</label>
                <input
                  type="text"
                  className={cx(styles.textInput)}
                  value={formData.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  placeholder="Họ và tên"
                />
              </div>

              <div className={cx(styles.formField)}>
                <label className={cx(styles.formLabel)}>Email</label>
                <input
                  type="email"
                  className={cx(styles.textInput, styles.disabledInput)}
                  value={userData.email}
                  readOnly
                  placeholder="Email"
                />
                <small className={cx(styles.fieldHint)}>Email không thể thay đổi</small>
              </div>

              <div className={cx(styles.formField)}>
                <label className={cx(styles.formLabel)}>Giới tính</label>
                <div className={cx(styles.genderSelection)}>
                  <label className={cx(styles.checkboxLabel)}>
                    <div className={cx(styles.customCheckbox, { [styles.checked]: formData.gender === 'male' })}>
                      {formData.gender === 'male' && <Check size={14} className={cx(styles.checkIcon)} />}
                    </div>
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'male'}
                      onChange={() => handleFormChange('gender', 'male')}
                      className={cx(styles.radioInput, styles.hidden)}
                    />
                    <span className={cx(styles.radioText)}>Nam</span>
                  </label>

                  <label className={cx(styles.checkboxLabel)}>
                    <div className={cx(styles.customCheckbox, { [styles.checked]: formData.gender === 'female' })}>
                      {formData.gender === 'female' && <Check size={14} className={cx(styles.checkIcon)} />}
                    </div>
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'female'}
                      onChange={() => handleFormChange('gender', 'female')}
                      className={cx(styles.radioInput, styles.hidden)}
                    />
                    <span className={cx(styles.radioText)}>Nữ</span>
                  </label>
                </div>
              </div>

              <div className={cx(styles.formField)}>
                <label className={cx(styles.formLabel)}>Ngày sinh (Không bắt buộc)</label>
                <div className={cx(styles.dateSelects)}>
                  <select
                    className={cx(styles.dateSelect)}
                    value={formData.day}
                    onChange={(e) => handleFormChange('day', e.target.value)}
                  >
                    <option value="">Ngày</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select
                    className={cx(styles.dateSelect)}
                    value={formData.month}
                    onChange={(e) => handleFormChange('month', e.target.value)}
                  >
                    <option value="">Tháng</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select
                    className={cx(styles.dateSelect)}
                    value={formData.year}
                    onChange={(e) => handleFormChange('year', e.target.value)}
                  >
                    <option value="">Năm</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={cx(styles.formField)}>
                <label className={cx(styles.formLabel)}>Địa chỉ</label>
                <input
                  type="text"
                  className={cx(styles.textInput)}
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder="Địa chỉ"
                />
              </div>

              <label className={cx(styles.checkboxLabel, styles.policyCheckbox)}>
                <div className={cx(styles.customCheckbox, { [styles.checked]: formData.agreeToPolicy })}>
                  {formData.agreeToPolicy && <Check size={14} className={cx(styles.checkIcon)} />}
                </div>
                <input
                  type="checkbox"
                  checked={formData.agreeToPolicy}
                  onChange={() => handleFormChange('agreeToPolicy', !formData.agreeToPolicy)}
                  className={cx(styles.checkboxInput, styles.hidden)}
                />
                <span className={cx(styles.checkboxText)}>
                  Tôi đồng ý với <a href="#" className={cx(styles.policyLink)}>chính sách xử lý dữ liệu cá nhân</a> của Beauty Skin
                </span>
              </label>

              <div className={cx(styles.modalActions)}>
                <button
                  type="button"
                  className={cx(styles.cancelButton)}
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={cx(styles.updateButton)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;