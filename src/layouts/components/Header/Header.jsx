import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaPhone, FaStore } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/beautySkin.png';
import { useState, useEffect, useRef, useContext } from 'react';
import LoginForm from './LoginPopup';
import SignupForm from './SignupPopup';
import Navigation from '../Navigation/Navigation';
import { logoutAxios } from '~/services/authAxios';
import { CartContext } from '~/context/CartContext';

const cx = classNames.bind(styles);

function Header() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const popupRef = useRef(null);
    const [userInfo, setUserInfo] = useState('');
    const { cartItems } = useContext(CartContext);
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Fetch all items from API
    useEffect(() => {
        fetch('http://localhost:8000/api/v1/items/all')
            .then((res) => res.json())
            .then((data) => {
                if (data.data && Array.isArray(data.data)) {
                    setItems(data.data); // ✅ Use "data" instead of "results"
                } else {
                    console.error("Invalid API response:", data);
                    setItems([]); // Prevents errors if the structure is wrong
                }
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                setItems([]);
            });
    }, []);

    // Handle input change and filter suggestions
    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 0) {
            const filteredResults = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(value.toLowerCase()) ||
                    (item.brand?.name && item.brand.name.toLowerCase().includes(value.toLowerCase()))
            );
            setSuggestions(filteredResults);
        } else {
            setSuggestions([]);
        }
    };

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
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Tìm kiếm sản phẩm..."
                                className={cx('searchInput')}
                            />
                            <button className={cx('searchButton')}>
                                <IoSearch />
                            </button>

                            {/* Display search suggestions */}
                            {suggestions.length > 0 && (
                                <ul className={cx('suggestionsDropdown')}>
                                    {suggestions.map((item) => (
                                        <li
                                            key={item._id}
                                            onClick={() => setQuery(item.name)}
                                            className={cx('suggestionItem')}
                                        >
                                            <strong>{item.name}</strong> - {item.brand?.name || "No Brand"}
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                                        <div><span>Đăng nhập / Đăng ký</span></div>
                                        <div><span>Tài khoản</span></div>
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

                        <Link to="/support" className={cx('actionItem')}>
                            <FaPhone className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Hỗ trợ</span>
                                <span>khách hàng</span>
                            </div>
                        </Link>

                        <Link to="/cart" className={cx('actionItem', 'cart')}>
                            <FaShoppingCart className={cx('icon')} />
                            <span className={cx('cartCount')}>{cartCount}</span>
                        </Link>
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