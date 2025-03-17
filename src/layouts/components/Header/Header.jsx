import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaPhone, FaStore, FaClipboardList, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/beautySkin.png';
import { useState, useEffect, useRef, useContext } from 'react';
import LoginForm from './LoginPopup';
import SignupForm from './SignupPopup';
import OtpForm from './OtpForm';
import Navigation from '../Navigation/Navigation';
import { getItemsAxios } from '~/services/itemAxios';
import { googleLoginAxios, googleRedirectAxios, logoutAxios } from '~/services/authAxios';
import { CartContext } from '~/context/CartContext';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function Header() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const popupRef = useRef(null);
    const searchRef = useRef(null);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const { cartItems } = useContext(CartContext);
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem('recentSearches')) || []
    );

    useEffect(() => {
        // When header mounts or user info changes, check for staff role
        if (userInfo && userInfo.role && ['STAFF', 'MANAGER', 'ADMIN'].includes(userInfo.role)) {
            navigate(routes.staff);
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        // This effect will run whenever the header component is rendered
        const checkUserRole = () => {
            const userData = JSON.parse(localStorage.getItem('user') || 'null');
            if (userData && userData.role && ['STAFF', 'MANAGER', 'ADMIN'].includes(userData.role)) {
                // Only update if the role has changed to prevent infinite redirects
                if (!userInfo.role || userInfo.role !== userData.role) {
                    setUserInfo(userData);
                    navigate(routes.staff);
                }
            }
        };
        
        checkUserRole();
        
        // Set up an event listener for storage changes (in case another tab updates login state)
        window.addEventListener('storage', checkUserRole);
        
        return () => {
            window.removeEventListener('storage', checkUserRole);
        };
    }, [navigate]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getItemsAxios();

                // Check if response is an array (API directly returns items)
                if (Array.isArray(response.data)) {
                    setItems(response.data);
                } else {
                    console.error("Invalid API response:", response);
                    setItems([]);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                setItems([]);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        // Handle Google OAuth Redirection
        const handleGoogleRedirect = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            // Check if we're on the Google redirect path or have a code parameter
            if (location.pathname.includes("auth/google/redirect") || code) {
                try {
                    const response = await googleRedirectAxios();

                    // If successful, update user state
                    if (response?.data) {
                        setUserInfo({
                            _id: response.data._id,
                            name: response.data.name,
                            email: response.data.email,
                            role: response.data.role,
                            avatar: response.data.avatar
                        });
                    }
                } catch (error) {
                    console.error("Google Redirect Error:", error);
                }
            }
        };

        handleGoogleRedirect();
    }, [location]);

    // Click outside handler for search suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowAccountPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGoogleLogin = async () => {
        try {
            await googleLoginAxios();
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    // Client-side search functionality
    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        setShowSuggestions(!!value);

        if (value.length > 0) {
            setIsLoading(true);
            // Debounce search
            const timer = setTimeout(() => {
                searchItemsLocally(value);
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
            setIsLoading(false);
        }
    };

    // Perform search on the client side using the items already fetched
    const searchItemsLocally = (searchTerm) => {
        const term = searchTerm.toLowerCase().trim();

        // Skip searching if term is too short
        if (term.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        // Get all unique brands from items
        const uniqueBrands = new Map();

        // Find matching items
        const matchingItems = items.filter(item => {
            const nameMatch = item.name && item.name.toLowerCase().includes(term);
            const brandMatch = item.brand && item.brand.name && item.brand.name.toLowerCase().includes(term);

            // Collect unique brands for the "Brands" category
            if (brandMatch && item.brand) {
                uniqueBrands.set(item.brand._id, {
                    _id: item.brand._id,
                    name: item.brand.name,
                    type: 'brand'
                });
            }

            return nameMatch || brandMatch;
        });

        // Convert matching items to suggestion format
        const productSuggestions = matchingItems.slice(0, 6).map(item => ({
            ...item,
            type: 'product'
        }));

        // Get brand suggestions (up to 3)
        const brandSuggestions = Array.from(uniqueBrands.values()).slice(0, 3);

        // Combine results
        setSuggestions([...brandSuggestions, ...productSuggestions]);
        setIsLoading(false);
    };

    const handleSearch = () => {
        if (query.trim()) {
            // Add to recent searches
            const updatedSearches = [
                query,
                ...recentSearches.filter(term => term !== query)
            ].slice(0, 5); // Keep only 5 most recent

            setRecentSearches(updatedSearches);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

            // Navigate to search results
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // Add to recent searches
        const updatedSearches = [
            suggestion.name,
            ...recentSearches.filter(term => term !== suggestion.name)
        ].slice(0, 5);

        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

        // Navigate based on suggestion type
        if (suggestion.type === 'brand') {
            navigate(`/brand/${suggestion._id}`);  // Use the updated URL format for brand pages
        } else {
            navigate(`/product/${suggestion._id}`);
        }

        setShowSuggestions(false);
        setQuery('');
    };

    const handleRecentSearchClick = (term) => {
        setQuery(term);
        navigate(`/search?q=${encodeURIComponent(term)}`);
        setShowSuggestions(false);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

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
        setShowOtpForm(true);
        setShowAccountPopup(false);
    };

    // Group suggestions by type for display
    const brandSuggestions = suggestions.filter(item => item.type === 'brand');
    const productSuggestions = suggestions.filter(item => item.type === 'product');

    return (
        <>
            <header className={cx('wrapper')}>
                <div className={cx('container')}>
                    <Link to={routes.home} className={cx('logo')}>
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

                        <div ref={searchRef} className={cx('searchContainer')}>
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowSuggestions(!!query || recentSearches.length > 0)}
                                placeholder="Tìm kiếm sản phẩm..."
                                className={cx('searchInput')}
                            />
                            <button className={cx('searchButton')} onClick={handleSearch}>
                                <IoSearch />
                            </button>

                            {/* Enhanced search suggestions dropdown */}
                            {showSuggestions && (
                                <div className={cx('enhancedSuggestions')}>
                                    {isLoading ? (
                                        <div className={cx('loadingIndicator')}>
                                            <div className={cx('spinner')}></div>
                                            <span>Đang tìm kiếm...</span>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <>
                                            {/* Brand suggestions */}
                                            {brandSuggestions.length > 0 && (
                                                <div className={cx('suggestionGroup')}>
                                                    <div className={cx('suggestionGroupTitle')}>Thương hiệu</div>
                                                    {brandSuggestions.map(brand => (
                                                        <div
                                                            key={`brand-${brand._id}`}
                                                            className={cx('suggestionItem', 'brandItem')}
                                                            onClick={() => handleSuggestionClick(brand)}
                                                        >
                                                            <div className={cx('brandIcon')}>
                                                                <IoSearch />
                                                            </div>
                                                            <div className={cx('suggestionContent')}>
                                                                <div className={cx('suggestionName')}>{brand.name}</div>
                                                                <div className={cx('suggestionType')}>Thương hiệu</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Product suggestions */}
                                            {productSuggestions.length > 0 && (
                                                <div className={cx('suggestionGroup')}>
                                                    <div className={cx('suggestionGroupTitle')}>Sản phẩm</div>
                                                    {productSuggestions.map(product => (
                                                        <div
                                                            key={`product-${product._id}`}
                                                            className={cx('suggestionItem', 'productItem')}
                                                            onClick={() => handleSuggestionClick(product)}
                                                        >
                                                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                                                <img
                                                                    src={product.imageUrls[0]}
                                                                    alt={product.name}
                                                                    className={cx('productImage')}
                                                                />
                                                            ) : (
                                                                <div className={cx('productImagePlaceholder')}>
                                                                    <IoSearch />
                                                                </div>
                                                            )}
                                                            <div className={cx('suggestionContent')}>
                                                                <div className={cx('suggestionName')}>{product.name}</div>
                                                                {product.brand && (
                                                                    <div className={cx('productBrand')}>{product.brand.name}</div>
                                                                )}
                                                                <div className={cx('productPrice')}>
                                                                    {product.price?.toLocaleString()} đ
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* View all results */}
                                            <div className={cx('viewAllResults')}>
                                                <Link
                                                    to={`/search?q=${encodeURIComponent(query)}`}
                                                    onClick={() => setShowSuggestions(false)}
                                                >
                                                    Xem tất cả kết quả cho "{query}"
                                                </Link>
                                            </div>
                                        </>
                                    ) : query ? (
                                        <div className={cx('noResults')}>
                                            Không tìm thấy kết quả cho "{query}"
                                        </div>
                                    ) : recentSearches.length > 0 ? (
                                        <div className={cx('recentSearches')}>
                                            <div className={cx('recentSearchesHeader')}>
                                                <span>Tìm kiếm gần đây</span>
                                                <button
                                                    className={cx('clearRecentSearches')}
                                                    onClick={clearRecentSearches}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                            {recentSearches.map((term, index) => (
                                                <div
                                                    key={`recent-${index}`}
                                                    className={cx('recentSearchItem')}
                                                    onClick={() => handleRecentSearchClick(term)}
                                                >
                                                    <IoSearch className={cx('recentSearchIcon')} />
                                                    <span>{term}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cx('headerActions')}>
                        <div ref={popupRef} className={cx('actionItem', 'accountItem')} onClick={handleAccountClick}>
                            <FaUser className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                {userInfo.name ? (
                                    <div>
                                        <div><span>Chào {userInfo.name}</span></div>
                                        <div><span>Tài khoản</span></div>
                                    </div>
                                ) : (
                                    <div>
                                        <div><span>Đăng nhập / Đăng ký</span></div>
                                        <div><span>Tài khoản</span></div>
                                    </div>
                                )}
                            </div>

                            {showAccountPopup &&
                                (userInfo?.name ? (
                                    <div className={cx('accountPopupAfter')}>
                                        <ul>
                                            <li onClick={() => {
                                                navigate(routes.profile);
                                                setShowAccountPopup(false);
                                            }}><FaUser /> Tài khoản của bạn</li>
                                            <li onClick={() => {
                                                navigate(routes.ordersPage);
                                                setShowAccountPopup(false);
                                            }}><FaClipboardList /> Quản lý đơn hàng</li>
                                            <li onClick={() => {
                                                navigate(routes.favorites);
                                                setShowAccountPopup(false);
                                            }}><FaHeart /> Sản phẩm yêu thích</li>
                                            <li onClick={handleSignOutClick}><FaSignOutAlt /> Thoát</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className={cx('accountPopup')}>
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

                        <Link to={routes.support} className={cx('actionItem')}>
                            <FaPhone className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Hỗ trợ</span>
                                <span>khách hàng</span>
                            </div>
                        </Link>

                        <Link to={routes.cart} className={cx('actionItem', 'cart')}>
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

                {showOtpForm && (
                    <OtpForm
                        onClose={() => setShowOtpForm(false)}
                        onShowLogin={() => {
                            setShowSignupForm(false);
                            setShowLoginForm(true);
                        }}
                        onVerificationSuccess={(email) => {
                            setVerifiedEmail(email);
                            setShowOtpForm(false);
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
                        verifiedEmail={verifiedEmail}
                    />
                )}
            </header>
            <Navigation />
        </>
    );
}

export default Header;