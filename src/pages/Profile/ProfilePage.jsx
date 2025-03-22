import React, { useState, useEffect } from 'react';
import { User, Lock, Check } from 'lucide-react';
import cx from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import routes from '~/config/routes';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile');
  const [gender, setGender] = useState('unspecified');
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [fullName, setFullName] = useState('Nguyen The Son (K18 HCM)');
  const [email, setEmail] = useState('sonntse184319@fpt.edu.vn');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case routes.profile:
        setSelectedTab('profile');
        break;
      case routes.ordersPage:
        setSelectedTab('orders');
        break;
      case routes.addresses:
        setSelectedTab('addresses');
        break;
      case routes.favorites:
        setSelectedTab('favorites');
        break;
      default:
        setSelectedTab('profile');
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Form submitted:', { fullName, gender, day, month, year, agreeToPolicy });
    // You could call an API to update the user's profile here
  };

  return (
    <div className={cx(styles.profileContainer)}>
      {/* Sidebar */}
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
                    <User size={40} className={cx(styles.avatarIcon)} />
                  </div>
                  <p className={cx(styles.avatarLabel)}>Tải ảnh của bạn</p>
                </div>
                
                {/* Form Section */}
                <div className={cx(styles.formFields)}>
                  <div className={cx(styles.formField)}>
                    <input 
                      type="text" 
                      className={cx(styles.textInput)}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly
                    />
                  </div>
                  
                  <div className={cx(styles.formField)}>
                    <input 
                      type="text" 
                      className={cx(styles.textInput)}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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
                    
                    <label className={cx(styles.checkboxLabel)}>
                      <div className={cx(styles.customCheckbox, { [styles.checked]: gender === 'unspecified' })}>
                        {gender === 'unspecified' && <Check size={14} className={cx(styles.checkIcon)} />}
                      </div>
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={gender === 'unspecified'} 
                        onChange={() => setGender('unspecified')}
                        className={cx(styles.radioInput, styles.hidden)}
                      />
                      <span className={cx(styles.radioText)}>Không xác định</span>
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
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      
                      <select 
                        className={cx(styles.dateSelect)}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">Tháng</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      
                      <select 
                        className={cx(styles.dateSelect)}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">Năm</option>
                        {[...Array(100)].map((_, i) => (
                          <option key={2025-i} value={2025-i}>{2025-i}</option>
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
            
            {/* Email Section */}
            <div className={cx(styles.contentSection)}>
              <div className={cx(styles.sectionHeader)}>
                <svg className={cx(styles.sectionIcon)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className={cx(styles.sectionSubtitle)}>Số điện thoại và Email</h2>
              </div>
              
              <div className={cx(styles.emailSection)}>
                <div className={cx(styles.fieldGroup)}>
                  <label className={cx(styles.fieldLabel)}>Email</label>
                  <input 
                    type="email" 
                    className={cx(styles.textInput, styles.disabledInput)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;