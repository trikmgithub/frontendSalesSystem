import classNames from 'classnames/bind';
import styles from './SignupPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const cx = classNames.bind(styles);

function SignupForm({ onClose, onShowLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: '',
        password: '',
        fullName: '',
        gender: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        agreeToTerms: false,
        receivePromotions: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleGetCode = () => {
        console.log('Getting verification code for:', formData.email);
    };

    const handleShowLogin = () => {
        onClose();
        onShowLogin();
    };

    return (
        <div className={cx('modalOverlay')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>×</button>
                <h3>Đăng ký tài khoản</h3>
                <form className={cx('signupForm')} onSubmit={handleSubmit}>
                    <div className={cx('formGroup')}>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email hoặc số điện thoại"
                        />
                    </div>
                    <div className={cx('formGroup', 'verificationGroup')}>
                        <input
                            type="text"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleInputChange}
                            placeholder="Nhập mã xác thực 6 số"
                        />
                        <button type="button" onClick={handleGetCode} className={cx('getCodeBtn')}>
                            lấy mã
                        </button>
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
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Họ tên"
                        />
                    </div>
                    <div className={cx('genderGroup')}>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="unknown"
                                checked={formData.gender === 'unknown'}
                                onChange={handleInputChange}
                            />
                            <span>Không xác định</span>
                        </label>
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
                        <select name="birthDay" value={formData.birthDay} onChange={handleInputChange}>
                            <option value="">Ngày</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange}>
                            <option value="">Tháng</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select name="birthYear" value={formData.birthYear} onChange={handleInputChange}>
                            <option value="">Năm</option>
                            {[...Array(100)].map((_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                    <div className={cx('checkboxGroup')}>
                        <label>
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                            />
                            <span>
                                Tôi đã đọc và đồng ý với{' '}
                                <Link to="/terms">Điều kiện giao dịch chung</Link> và{' '}
                                <Link to="/privacy">Chính sách bảo mật thông tin</Link> của BeautySkin
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
                    <button 
                        className={cx('loginBtn')} 
                        onClick={handleShowLogin}
                    >
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