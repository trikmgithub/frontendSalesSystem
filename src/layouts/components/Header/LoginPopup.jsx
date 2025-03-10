import classNames from 'classnames/bind';
import styles from './LoginPopup.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning } from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa';
import ForgotPasswordPopup from './ForgotPasswordPopup';
import { googleLoginAxios, googleRedirectAxios, loginAxios } from '~/services/authAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

function LoginForm({ onClose, onShowSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const location = useLocation();

    // Use the custom hook to disable body scroll
    useDisableBodyScroll(true);

    useEffect(() => {
        // Handle Google OAuth Redirection
        const handleGoogleRedirect = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            
            // Check if we're on the Google redirect path or have a code parameter
            if (location.pathname.includes("auth/google/redirect") || code) {
                try {
                    await googleRedirectAxios();
                } catch (error) {
                    console.error("Google Redirect Error:", error);
                }
            }
        };
        
        handleGoogleRedirect();
    }, [location]);

    const handleGoogleLogin = async () => {
        try {
            await googleLoginAxios();
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Validate empty fields
        if (!email && !password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }

        if (!email) {
            setError('Vui lòng nhập email');
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
        try {
            setIsLoading(true); // Start loading
            const response = await loginAxios({ username: email, password });

            if (response.message === 'Login success') {
                console.log('Login success');
                onClose();
            }
        } catch (error) {
            setIsLoading(false); // Stop loading on error
            console.error('Login Popup Error:', error);
            
            // Check if this is an auth error
            if (error.response?.status === 401) {
                setError('Email hoặc mật khẩu không chính xác.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
            }
        }
    };

    const handleShowSignup = () => {
        onClose();
        onShowSignup();
    };

    return (
        <>
            <div className={cx('modalOverlay')} onClick={onClose}>
                <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                    <button className={cx('closeButton')} onClick={onClose}>
                        ×
                    </button>
                    <h3>Đăng nhập với</h3>
                    <div className={cx('socialButtons')}>
                        <button className={cx('googleBtn')} onClick={handleGoogleLogin}>
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
                                placeholder="Nhập email"
                                className={cx({ error: error && !email })}
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                        <div className={cx('formOptions')}>
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
                        <button 
                            type="submit" 
                            className={cx('submitBtn')}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className={cx('loadingWrapper')}>
                                    <FaSpinner className={cx('loadingIcon')} />
                                    Đang đăng nhập...
                                </span>
                            ) : 'Đăng nhập'}
                        </button>
                    </form>
                    <div className={cx('registerLink')}>
                        <span>Bạn chưa có tài khoản? </span>
                        <button className={cx('signupBtn')} onClick={handleShowSignup}>
                            ĐĂNG KÝ NGAY
                        </button>
                    </div>
                </div>
            </div>
            {showForgotPassword && <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} />}
        </>
    );
}

export default LoginForm;