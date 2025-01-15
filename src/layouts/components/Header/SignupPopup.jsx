import classNames from 'classnames/bind';
import styles from './SignupPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning, IoCheckmarkCircle } from "react-icons/io5";

const cx = classNames.bind(styles);

function SignupForm({ onClose, onShowLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
        name: '',
        gender: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        acceptTerms: false,
        acceptNewsletter: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email/phone
        if (!formData.email) {
            setError('Vui lòng nhập email hoặc số điện thoại');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.email)) {
            setError('Email hoặc số điện thoại không hợp lệ');
            return;
        }

        // Check if email is already registered (example)
        if (formData.email === 'abc@gmail.com') {
            setError('Email đã đăng ký, vui lòng đăng ký bằng email khác.');
            return;
        }

        // Validate verification code
        if (!formData.verificationCode) {
            setError('Vui lòng nhập mã xác thực');
            return;
        }

        if (formData.verificationCode.length !== 6) {
            setError('Nhập mã xác thực 6 số!');
            return;
        }

        // Validate password
        if (!formData.password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        // Validate name
        if (!formData.name) {
            setError('Vui lòng nhập họ tên');
            return;
        }

        // Validate terms acceptance
        if (!formData.acceptTerms) {
            setError('Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        // If all validations pass, proceed with signup
        // ... signup logic here
    };

    const validateEmail = (email) => {
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        // This will ensure the domain has at least 2 characters after the dot
        // For example: @gmail.com is valid, but @gmail.c is not
        return emailRegex.test(email) || phoneRegex.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Validate email when it changes
        if (name === 'email') {
            setIsEmailValid(validateEmail(value));
        }
        
        setError('');
    };

    const handleGetCode = (e) => {
        e.preventDefault();
        
        // Validate email first
        if (!formData.email) {
            setError('Vui lòng nhập email hoặc số điện thoại');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.email)) {
            setError('Email hoặc số điện thoại không hợp lệ');
            return;
        }

        // Start countdown (10 minutes = 600 seconds)
        setCountdown(600);
        // Show success message
        setSuccess('BeautySkin đã gửi mã xác thực vào Email của bạn vui lòng kiểm tra lại');
        setError('');
    };

    // Countdown timer effect
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // Format countdown time as mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
                            placeholder="Nhập email hoặc số điện thoại"
                        />
                    </div>
                    <div className={cx('formGroup', 'verificationGroup')}>
                        <input
                            type="text"
                            name="verificationCode"
                            placeholder="Nhập mã xác thực 6 số"
                            value={formData.verificationCode}
                            onChange={handleInputChange}
                        />
                        {countdown > 0 ? (
                            <button type="button" className={cx('getCodeBtn', 'counting')} disabled>
                                {formatTime(countdown)}
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className={cx('getCodeBtn', { active: isEmailValid })}
                                onClick={handleGetCode}
                                disabled={!isEmailValid}
                            >
                                lấy mã
                            </button>
                        )}
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