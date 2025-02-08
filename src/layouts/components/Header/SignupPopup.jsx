import classNames from 'classnames/bind';
import styles from './SignupPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import LoginForm from './LoginPopup';
import { registerAxios } from '~/services/registerAxios';

const cx = classNames.bind(styles);

function SignupForm({ onClose, onShowLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        year: '',
        month: '',
        day: '',
        gender: '',
        address: '',
        receivePromotions: false,
        acceptTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { year, month, day, acceptTerms, receivePromotions, ...rest } = formData;
        const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        try {
            if (acceptTerms) {
                const response = await registerAxios({ ...rest, dateOfBirth });

                // console.log(response);

                if (response.error) {
                    setError(response.message);
                }

                if (response.message === 'Register success') {
                    handleShowLogin();
                }
            } else {
                setError('Phải đồng ý chính sách');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleShowLogin = () => {
        onClose();
        onShowLogin();
    };

    return (
        <div className={cx('modalOverlay')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>
                    ×
                </button>
                <h3>Đăng ký tài khoản</h3>
                <form className={cx('signupForm')} onSubmit={handleSubmit}>
                    {error && (
                        <div className={cx('errorMessage')}>
                            <IoWarning size={16} />
                            {error}
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
                            placeholder="Họ tên"
                        />
                    </div>
                    <div className={cx('formGroup')}>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Địa chỉ"
                        />
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
                    <div className={cx('checkboxGroup')}>
                        <label>
                            <input
                                type="checkbox"
                                name="receivePromotions"
                                checked={formData.receivePromotions}
                                onChange={handleInputChange}
                            />
                            <span>Nhận thông tin khuyến mãi qua e-mail</span>
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
                    <p>Hoặc đăng nhập với:</p>
                    <div className={cx('socialButtons')}>
                        <button type="button" className={cx('facebookBtn')}>
                            <FaFacebook />
                            Facebook
                        </button>
                        <button type="button" className={cx('googleBtn')}>
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
