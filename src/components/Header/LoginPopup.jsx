// src/components/Header/LoginPopup.jsx
import classNames from 'classnames/bind';
import styles from './LoginPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning } from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa';
import ForgotPasswordPopup from './ForgotPasswordPopup';
import { googleLoginAxios, loginAxios } from '~/services/authAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function LoginForm({ onClose, onShowSignup, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { handleLoginSuccess } = useAuth();

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
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
                if (handleLoginSuccess) {
                    handleLoginSuccess();
                }
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

    return (
        <>
            <div className={cx('modalOverlay')} onClick={onClose}>
                <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                    <button className={cx('closeButton')} onClick={onClose}>
                        ×
                    </button>
                    <h3>Đăng nhập với</h3>
                    <div className={cx('socialButtons')}>
                        <button
                            className={cx('googleBtn')}
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className={cx('loadingWrapper')}>
                                    <FaSpinner className={cx('loadingIcon')} />
                                    Đang xử lý...
                                </span>
                            ) : (
                                <>
                                    <FcGoogle />
                                    Google +
                                </>
                            )}
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
                        <button className={cx('signupBtn')} onClick={onShowSignup}>
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