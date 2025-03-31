import React, { useState, useEffect } from 'react';
import { User, Lock, Check, Upload } from 'lucide-react';
import cx from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import routes from '~/config/routes';
import { updateUserAxios } from '~/services/userAxios';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile');
  const [gender, setGender] = useState('');
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setGender(user.gender?.toLowerCase() || '');
      setAddress(user.address || '');
      setUserId(user._id || '');

      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);
        setDay(date.getDate().toString());
        setMonth((date.getMonth() + 1).toString());
        setYear(date.getFullYear().toString());
      }

      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    } else {
      console.warn('No user data found in localStorage');
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');
    console.log('Token từ localStorage:', token);
    if (!token) {
      alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
      return;
    }

    // Chuẩn bị dữ liệu để gửi
    const userData = {
      _id: userId,
      email: email,
      name: fullName,
      dateOfBirth: `${year}-${month}-${day}T00:00:00.000Z`, // Định dạng ISO 8601
      gender: gender,
      role: 'user',
      address: address,
    };

    console.log('Dữ liệu gửi đi:', userData);

    try {
      // Gọi API thông qua userAxios
      const response = await updateUserAxios(userData);
      if (response.error) {
        throw new Error(response.message);
      }

      console.log('Cập nhật thành công:', response);
      alert('Thông tin đã được cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  return (
    <div className={cx(styles.profileContainer)}>
      {/* Sidebar */}
      <div className={cx(styles.sidebar)}>
        <div className={cx(styles.sidebarHeader)}>
          <div className={cx(styles.avatarPlaceholder)}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className={cx(styles.avatarImage)}
              />
            ) : (
              <User size={32} className={cx(styles.avatarIcon)} />
            )}
          </div>
          <div className={cx(styles.userInfo)}>
            <h2 className={cx(styles.userGreeting)}>Chào {fullName ? fullName.split(' ').pop() : '(K18 HCM)'}</h2>
            <p className={cx(styles.editAccount)}>Chỉnh sửa tài khoản</p>
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
            {/* Profile Information Section */}
            <div className={cx(styles.contentSection)}>
              <h1 className={cx(styles.sectionTitle)}>Thông tin tài khoản</h1>

              <form className={cx(styles.profileForm)} onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className={cx(styles.avatarSection)}>
                  <div className={cx(styles.avatarUpload)}>
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className={cx(styles.avatarPreview)}
                      />
                    ) : (
                      <User size={40} className={cx(styles.avatarIcon)} />
                    )}

                    <div className={cx(styles.uploadOverlay)}>
                      <Upload size={24} className={cx(styles.uploadIcon)} />
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className={cx(styles.fileInput)}
                      id="avatar-upload"
                    />
                  </div>
                  <label htmlFor="avatar-upload" className={cx(styles.avatarLabel)}>
                    Tải ảnh của bạn
                  </label>
                </div>

                {/* Form Section */}
                <div className={cx(styles.formFields)}>
                  <div className={cx(styles.formField)}>
                    <input
                      type="text"
                      className={cx(styles.textInput)}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Họ và tên"
                    />
                  </div>

                  <div className={cx(styles.formField)}>
                    <input
                      type="email"
                      className={cx(styles.textInput, styles.disabledInput)}
                      value={email}
                      readOnly
                      placeholder="Email"
                    />
                  </div>

                  <div className={cx(styles.genderSelection)}>
                    <label className={cx(styles.checkboxLabel)}>
                      <div className={cx(styles.customCheckbox, { [styles.checked]: gender === 'male' })}>
                        {gender === 'male' && <Check size={14} className={cx(styles.checkIcon)} />}
                      </div>
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className={cx(styles.radioInput, styles.hidden)}
                      />
                      <span className={cx(styles.radioText)}>Nam</span>
                    </label>

                    <label className={cx(styles.checkboxLabel)}>
                      <div className={cx(styles.customCheckbox, { [styles.checked]: gender === 'female' })}>
                        {gender === 'female' && <Check size={14} className={cx(styles.checkIcon)} />}
                      </div>
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className={cx(styles.radioInput, styles.hidden)}
                      />
                      <span className={cx(styles.radioText)}>Nữ</span>
                    </label>
                  </div>

                  <div className={cx(styles.birthdayField)}>
                    <p className={cx(styles.birthdayLabel)}>Ngày sinh (Không bắt buộc)</p>
                    <div className={cx(styles.dateSelects)}>
                      <select
                        className={cx(styles.dateSelect)}
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                      >
                        <option value="">Ngày</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>

                      <select
                        className={cx(styles.dateSelect)}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">Tháng</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>

                      <select
                        className={cx(styles.dateSelect)}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">Năm</option>
                        {[...Array(100)].map((_, i) => (
                          <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className={cx(styles.checkboxLabel)}>
                    <div className={cx(styles.customCheckbox, { [styles.checked]: agreeToPolicy })}>
                      {agreeToPolicy && <Check size={14} className={cx(styles.checkIcon)} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={agreeToPolicy}
                      onChange={() => setAgreeToPolicy(!agreeToPolicy)}
                      className={cx(styles.checkboxInput, styles.hidden)}
                    />
                    <span className={cx(styles.checkboxText)}>
                      Tôi đồng ý với <a href="#" className={cx(styles.policyLink)}>chính sách xử lý dữ liệu cá nhân</a> của Beauty Skin
                    </span>
                  </label>

                  <div className={cx(styles.formActions)}>
                    <button type="submit" className={cx(styles.updateButton)}>
                      Cập nhật
                    </button>
                  </div>
                </div>
              </form>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;