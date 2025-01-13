import classNames from 'classnames/bind';
import styles from './LoginPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const cx = classNames.bind(styles);

function LoginForm({ onClose, onShowSignup }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
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

    const handleShowSignup = () => {
        onClose();
        onShowSignup();
    };

    return (
        <div className={cx('modalOverlay')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('closeButton')} onClick={onClose}>×</button>
                <h3>Đăng nhập với</h3>
                <div className={cx('socialButtons')}>
                    <button className={cx('facebookBtn')}>
                        <FaFacebook />
                        Facebook
                    </button>
                    <button className={cx('googleBtn')}>
                        <FcGoogle />
                        Google +
                    </button>
                </div>
                <div className={cx('divider')}>
                    <span>Hoặc đăng nhập với BeautySkin</span>
                </div>
                <form className={cx('loginForm')} onSubmit={handleSubmit}>
                    <div className={cx('formGroup')}>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email hoặc số điện thoại"
                        />
                    </div>
                    <div className={cx('formGroup')}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Nhập password"
                        />
                    </div>
                    <div className={cx('formOptions')}>
                        <label className={cx('rememberMe')}>
                            <input
                                type="checkbox"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleInputChange}
                            />
                            <span>Nhớ mật khẩu</span>
                        </label>
                        <Link to="/forgot-password" className={cx('forgotPassword')}>
                            Quên mật khẩu
                        </Link>
                    </div>
                    <button type="submit" className={cx('submitBtn')}>
                        Đăng nhập
                    </button>
                </form>
                <div className={cx('registerLink')}>
                    <span>Bạn chưa có tài khoản? </span>
                    <button 
                        className={cx('signupBtn')} 
                        onClick={handleShowSignup}
                    >
                        ĐĂNG KÝ NGAY
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm; 