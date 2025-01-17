import classNames from 'classnames/bind';
import styles from './LoginPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning } from "react-icons/io5";
import ForgotPasswordPopup from './ForgotPasswordPopup';

const cx = classNames.bind(styles);

function LoginForm({ onClose, onShowSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate empty fields
        if (!email && !password) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }
        
        if (!email) {
            setError('Vui lòng nhập email hoặc số điện thoại');
            return;
        }

        if (!password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            setError('Email hoặc số điện thoại không hợp lệ');
            return;
        }

        // Handle login logic here
    };

    const handleShowSignup = () => {
        onClose();
        onShowSignup();
    };

    return (
        <>
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
                        {error && (
                            <div className={cx('errorMessage')}>
                                <IoWarning size={16} />
                                {error}
                            </div>
                        )}
                        
                        <div className={cx('formGroup')}>
                            <input
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email hoặc số điện thoại"
                                className={cx({ error: error && !email })}
                            />
                        </div>
                        <div className={cx('formGroup')}>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập password"
                                className={cx({ error: error && !password })}
                            />
                        </div>
                        <div className={cx('formOptions')}>
                            <label className={cx('rememberMe')}>
                                <input
                                    type="checkbox"
                                    name="remember"
                                />
                                <span>Nhớ mật khẩu</span>
                            </label>
                            <Link 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowForgotPassword(true);
                                }} 
                                to="/forgot-password" 
                                className={cx('forgotPassword')}
                            >
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
            {showForgotPassword && (
                <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} />
            )}
        </>
    );
}

export default LoginForm; 