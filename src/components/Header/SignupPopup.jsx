import classNames from 'classnames/bind';
import styles from './SignupPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import { googleLoginAxios, registerAxios } from '~/services/authAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

// Location data for address dropdowns
const locationData = {
  regions: [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng"
  ],
  districts: {
    "Hồ Chí Minh": [
      "Quận 1",
      "Quận 2",
      "Quận 3"
    ],
    "Hà Nội": [
      "Ba Đình",
      "Hoàn Kiếm",
      "Hai Bà Trưng"
    ],
    "Đà Nẵng": [
      "Hải Châu",
      "Thanh Khê",
      "Sơn Trà"
    ]
  },
  wards: {
    "Quận 1": [
      "Phường Bến Nghé",
      "Phường Bến Thành",
      "Phường Cô Giang"
    ],
    "Quận 2": [
      "Phường Thảo Điền",
      "Phường An Phú",
      "Phường Bình An"
    ],
    "Quận 3": [
      "Phường 1",
      "Phường 2",
      "Phường 3"
    ],
    "Ba Đình": [
      "Phường Trúc Bạch",
      "Phường Vĩnh Phúc",
      "Phường Cống Vị"
    ],
    "Hoàn Kiếm": [
      "Phường Hàng Bạc",
      "Phường Hàng Bồ",
      "Phường Hàng Đào"
    ],
    "Hai Bà Trưng": [
      "Phường Bách Khoa",
      "Phường Bạch Đằng",
      "Phường Bùi Thị Xuân"
    ],
    "Hải Châu": [
      "Phường Hải Châu 1",
      "Phường Hải Châu 2",
      "Phường Nam Dương"
    ],
    "Thanh Khê": [
      "Phường Thanh Khê Đông",
      "Phường Thanh Khê Tây",
      "Phường Xuân Hà"
    ],
    "Sơn Trà": [
      "Phường An Hải Bắc",
      "Phường An Hải Đông",
      "Phường An Hải Tây"
    ]
  }
};

function SignupForm({ onClose, onShowLogin, verifiedEmail = '' }) {
  const [formData, setFormData] = useState({
    email: verifiedEmail,
    password: '',
    name: '',
    year: '',
    month: '',
    day: '',
    gender: '',
    address: '',
    selectedRegion: '',
    selectedDistrict: '',
    selectedWard: '',
    receivePromotions: false,
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addressErrors, setAddressErrors] = useState({
    region: '',
    district: '',
    ward: ''
  });

  // Use the custom hook to disable body scroll
  useDisableBodyScroll(true);

  const handleGoogleLogin = async () => {
    try {
      // Show loading state - you can use a state variable or toast
      // setIsLoading(true); // If you have a loading state

      console.log('Initiating Google login API call...');

      // Call the Google login API
      const response = await googleLoginAxios();

      if (response.error) {
        toast.error(response.message || "Đăng nhập Google thất bại", {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }

      if (response.success) {
        toast.success("Đăng nhập thành công!", {
          position: "top-center",
          autoClose: 2000
        });

        // Close any open popups
        setShowAccountPopup(false);

        // If using login modal
        if (onClose) {
          onClose();
        }

        // Call any success callbacks
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Update UI to reflect logged in state
        // For a cleaner approach, just reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 3000
      });
    } finally {
      // setIsLoading(false); // If you have a loading state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      year, month, day, acceptTerms,
      selectedRegion, selectedDistrict, selectedWard,
      ...rest
    } = formData;

    // Format birth date as YYYY-MM-DD
    const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Format address as "ward - district - region"
    const formattedAddress = selectedWard && selectedDistrict && selectedRegion
      ? `${selectedWard} - ${selectedDistrict} - ${selectedRegion}`
      : formData.address;

    // Validate required fields
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      (!formattedAddress && !formData.address) ||
      !formData.gender ||
      !year ||
      !month ||
      !day
    ) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Validate address selections
    if (!selectedRegion && !formData.address) {
      setAddressErrors(prev => ({ ...prev, region: 'Vui lòng chọn khu vực' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    if (selectedRegion && !selectedDistrict) {
      setAddressErrors(prev => ({ ...prev, district: 'Vui lòng chọn quận/huyện' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    if (selectedDistrict && !selectedWard) {
      setAddressErrors(prev => ({ ...prev, ward: 'Vui lòng chọn phường/xã' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ.');
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 32) {
      setError("Mật khẩu phải có từ 6 đến 32 ký tự.");
      return;
    }

    if (!acceptTerms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng.');
      return;
    }

    try {
      const response = await registerAxios({
        ...rest,
        dateOfBirth,
        address: formattedAddress
      });

      // Check if response has isExistedEmail flag
      if (response.isExistedEmail) {
        setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
        return;
      }

      // Check for error response
      if (response.error || response.statusCode === 400) {
        // Check if the message indicates email already exists
        if (response.message && (
          response.message.includes('đã tồn tại trong hệ thống') ||
          response.message.includes('Email already exists')
        )) {
          setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
          return;
        }

        setError(response.message || 'Đăng ký thất bại.');
        return;
      }

      // Success case
      if (response.message === 'Register success' || (response.data && !response.error)) {
        setSuccess('Đăng ký thành công! Chuyển hướng sau 3 giây...');
        setError('');

        // Wait 3 seconds before redirecting
        setTimeout(() => {
          handleShowLogin();
        }, 3000);
      }
    } catch (error) {
      // If error is a string (from the previous implementation)
      if (typeof error === 'string') {
        if (error.includes('đã tồn tại trong hệ thống') ||
          error.includes('Email already exists')) {
          setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
        } else {
          setError(error || 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.');
        }
      } else {
        setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại.');
      }
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError(''); // Clear error when the user starts typing

    // Clear address errors on change
    if (['selectedRegion', 'selectedDistrict', 'selectedWard'].includes(name)) {
      setAddressErrors(prev => ({
        ...prev,
        [name === 'selectedRegion' ? 'region' : name === 'selectedDistrict' ? 'district' : 'ward']: ''
      }));
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedRegion: region,
      selectedDistrict: '',
      selectedWard: ''
    }));
    setAddressErrors(prev => ({ ...prev, region: '' }));
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedDistrict: district,
      selectedWard: ''
    }));
    setAddressErrors(prev => ({ ...prev, district: '' }));
  };

  const handleWardChange = (e) => {
    const ward = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedWard: ward
    }));
    setAddressErrors(prev => ({ ...prev, ward: '' }));
  };

  const handleShowLogin = () => {
    onClose();
    onShowLogin();
  };

  return (
    <div className={cx('modalOverlay')} onClick={onClose}>
      <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
        <button className={cx('closeButton')} onClick={onClose}>
          ×
        </button>
        <h3>Đăng ký tài khoản</h3>
        <form className={cx('signupForm')} onSubmit={handleSubmit}>
          {error && (
            <div className={cx('errorMessage')}>
              <div className={cx('errorContent')}>
                <IoWarning size={16} />
                {error}
              </div>
              {error.includes('Email đã được sử dụng') && (
                <button type="button" className={cx('loginBtnError')} onClick={handleShowLogin}>
                  Đăng nhập ngay
                </button>
              )}
            </div>
          )}
          {success && (
            <div className={cx('successMessage')}>
              <IoCheckmarkCircle size={16} />
              {success}
            </div>
          )}
          <div className={cx('formGroup')}>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              readOnly={!!verifiedEmail}
            />
          </div>
          <div className={cx('formGroup')}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu từ 6 - 32 ký tự"
            />
          </div>
          <div className={cx('formGroup')}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Họ và tên"
            />
          </div>
          {/* Address dropdowns */}
          <div className={cx('addressGroup')}>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedRegion"
                value={formData.selectedRegion}
                onChange={handleRegionChange}
                className={addressErrors.region ? cx('error') : ''}
              >
                <option value="">Tỉnh/Thành phố</option>
                {locationData.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.region && <span className={cx('fieldError')}>{addressErrors.region}</span>}
            </div>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedDistrict"
                value={formData.selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!formData.selectedRegion}
                className={addressErrors.district ? cx('error') : ''}
              >
                <option value="">Quận/huyện</option>
                {formData.selectedRegion && locationData.districts[formData.selectedRegion]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.district && <span className={cx('fieldError')}>{addressErrors.district}</span>}
            </div>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedWard"
                value={formData.selectedWard}
                onChange={handleWardChange}
                disabled={!formData.selectedDistrict}
                className={addressErrors.ward ? cx('error') : ''}
              >
                <option value="">Phường/xã</option>
                {formData.selectedDistrict && locationData.wards[formData.selectedDistrict]?.map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.ward && <span className={cx('fieldError')}>{addressErrors.ward}</span>}
            </div>
          </div>
          <div className={cx('genderGroup')}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
              />
              <span>Nam</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
              />
              <span>Nữ</span>
            </label>
          </div>
          <div className={cx('birthDateGroup')}>
            <select name="day" value={formData.day} onChange={handleInputChange}>
              <option value="">Ngày</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select name="month" value={formData.month} onChange={handleInputChange}>
              <option value="">Tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select name="year" value={formData.year} onChange={handleInputChange}>
              <option value="">Năm</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={cx('checkboxGroup')}>
            <label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <span>
                Tôi đã đọc và đồng ý với{' '}
                <Link target="_blank" to="/terms">
                  Điều kiện giao dịch chung
                </Link>{' '}
                và{' '}
                <Link target="_blank" to="/privacy">
                  Chính sách bảo mật thông tin
                </Link>{' '}
                của BeautySkin
              </span>
            </label>
          </div>
          <button type="submit" className={cx('submitBtn')}>
            Đăng ký
          </button>
        </form>
        <div className={cx('loginLink')}>
          <span>Bạn đã có tài khoản? </span>
          <button className={cx('loginBtn')} onClick={handleShowLogin}>
            ĐĂNG NHẬP
          </button>
        </div>
        <div className={cx('socialLogin')}>
          <p>Hoặc đăng ký với:</p>
          <div className={cx('socialButtons')}>
            <button type="button" className={cx('googleBtn')} onClick={handleGoogleLogin}>
              <FcGoogle />
              Google +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;