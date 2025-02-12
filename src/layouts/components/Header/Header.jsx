import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaPhone, FaStore } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/logo.jpg';
import { useState, useEffect, useRef } from 'react';
import LoginForm from './LoginPopup';
import SignupForm from './SignupPopup';
import Navigation from '../Navigation/Navigation';
import { logoutAxios } from '~/services/authAxios';
//navigation is error right now
const cx = classNames.bind(styles);

function Header() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const popupRef = useRef(null);
    const [userInfo, setUserInfo] = useState('');
    console.log(userInfo);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowAccountPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAccountClick = () => {
        setShowAccountPopup(!showAccountPopup);
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
        setShowAccountPopup(false);
    };

    const handleSignOutClick = async () => {
        try {
            const response = await logoutAxios();
        } catch (error) {
            throw new Error(error);
        }
    };

    const handleSignupClick = () => {
        setShowSignupForm(true);
        setShowAccountPopup(false);
    };

    const userLocalStorage = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        setUserInfo(userLocalStorage);
    }, []);

    return (
        <>
            <header className={cx('wrapper')}>
                <div className={cx('container')}>
                    <Link to="/" className={cx('logo')}>
                        <img src={logo} alt="BeautySkin" />
                    </Link>

                    <div className={cx('searchSection')}>
                        <nav className={cx('headerNav')}>
                            <ul className={cx('navMenu')}>
                                <li>
                                    <Link to="/kem-chong-nang">Kem Chống Nắng</Link>
                                </li>
                                <li>
                                    <Link to="/tay-trang">Tẩy Trang</Link>
                                </li>
                                <li>
                                    <Link to="/toner">Toner</Link>
                                </li>
                                <li>
                                    <Link to="/sua-rua-mat">Sữa Rửa Mặt</Link>
                                </li>
                                <li>
                                    <Link to="/tay-te-bao-chet">Tẩy tế bào chết</Link>
                                </li>
                                <li>
                                    <Link to="/retinol">Retinol</Link>
                                </li>
                            </ul>
                        </nav>

                        <div className={cx('searchContainer')}>
                            <input
                                type="text"
                                placeholder="Giảm 50% Ủ Trắng Các Vùng - Mua 5 Tặng 5"
                                className={cx('searchInput')}
                            />
                            <button className={cx('searchButton')}>
                                <IoSearch />
                            </button>
                        </div>
                    </div>

                    <div className={cx('headerActions')}>
                        <div ref={popupRef} className={cx('actionItem', 'accountItem')} onClick={handleAccountClick}>
                            <FaUser className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                {userInfo.name ? (
                                    <span>{userInfo.name}</span>
                                ) : (
                                    <div>
                                        <span>Đăng nhập / Đăng ký</span>
                                        <span>Tài khoản</span>
                                    </div>
                                )}
                            </div>

                            {showAccountPopup &&
                                (userInfo?.name ? (
                                    <div className={cx('accountPopup')} onClick={handleSignOutClick}>
                                        logout
                                    </div>
                                ) : (
                                    <div className={cx('accountPopup')}>
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
                                        <button className={cx('loginBtn')} onClick={handleLoginClick}>
                                            Đăng nhập
                                        </button>
                                        <div className={cx('registerLink')}>
                                            <span>Bạn chưa có tài khoản?</span>
                                            <button className={cx('signupBtn')} onClick={handleSignupClick}>
                                                ĐĂNG KÝ NGAY
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className={cx('actionItem')}>
                            <FaStore className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Hệ thống</span>
                                <span>cửa hàng</span>
                            </div>
                        </div>

                        <div className={cx('actionItem')}>
                            <FaPhone className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Hỗ trợ</span>
                                <span>khách hàng</span>
                            </div>
                        </div>

                        <div className={cx('actionItem', 'cart')}>
                            <FaShoppingCart className={cx('icon')} />
                            <span className={cx('cartCount')}>0</span>
                        </div>
                    </div>
                </div>

                {showLoginForm && (
                    <LoginForm
                        onClose={() => setShowLoginForm(false)}
                        onShowSignup={() => {
                            setShowLoginForm(false);
                            setShowSignupForm(true);
                        }}
                    />
                )}

                {showSignupForm && (
                    <SignupForm
                        onClose={() => setShowSignupForm(false)}
                        onShowLogin={() => {
                            setShowSignupForm(false);
                            setShowLoginForm(true);
                        }}
                    />
                )}
            </header>
            <Navigation />
        </>
    );
}

export default Header;
