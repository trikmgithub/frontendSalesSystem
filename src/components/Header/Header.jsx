import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaPhone, FaCheckSquare, FaClipboardList, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/beautySkin.png';
import { useState, useEffect, useRef, useContext } from 'react';
import Navigation from '../Navigation/Navigation';
import { getItemsAxios, checkUserSkinTypeAxios } from '~/services/itemAxios';
import { logoutAxios } from '~/services/authAxios';
import { CartContext } from '~/context/CartContext';
import { useAuth } from '~/context/AuthContext';
import routes from '~/config/routes';
import SearchLink from '../SearchLink/SearchLink';
import { toast } from 'react-toastify';
import * as axiosConfig from '~/utils/axiosConfig';

const cx = classNames.bind(styles);

// Function to get cookie by name
const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
};

function Header() {
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const popupRef = useRef(null);
    const searchRef = useRef(null);
    const { cartItems } = useContext(CartContext);
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem('recentSearches')) || []
    );

    // Use our Auth context
    const {
        userInfo,
        openLogin,
        openSignup,
        isLoggedIn,
        handleLoginSuccess
    } = useAuth();

    // Process user_info cookie and save to localStorage
    const processUserInfoCookie = async () => {
        try {
            const userInfoCookie = getCookie('user_info');
            
            if (!userInfoCookie) {
                console.log("No user_info cookie found");
                return null;
            }
            
            // Parse the cookie data (handling 'j:' prefix if exists)
            const cookieData = JSON.parse(userInfoCookie.startsWith('j:') ? 
                userInfoCookie.substring(2) : userInfoCookie);
                
            console.log("Retrieved user data from cookie:", cookieData);
            
            // Store access token
            if (cookieData.access_token) {
                localStorage.setItem('access_token', cookieData.access_token);
                
                // Clean up user data before storing
                const basicUserData = { ...cookieData };
                // Don't store refresh token in localStorage for security
                if (basicUserData.refresh_token) {
                    delete basicUserData.refresh_token;
                }
                
                // Store basic user info immediately
                localStorage.setItem('user', JSON.stringify(basicUserData));
                console.log("Basic user data from cookie saved to localStorage");
                
                // Clear the cookie after processing
                document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                // Get detailed user info if we have an ID
                if (basicUserData._id) {
                    try {
                        // Import axiosConfig at the top of the file
                        const endpoint = `users/info/${basicUserData._id}`;
                        
                        const userDetailsRes = await axiosConfig.get(endpoint, {
                            headers: {
                                Authorization: `Bearer ${basicUserData.access_token}`
                            }
                        });
                        
                        // Check the structure of the response to extract user data correctly
                        const userData = userDetailsRes.data?.user || userDetailsRes.data;
                        
                        if (userData) {
                            // Ensure password is not included
                            if (userData.password) {
                                delete userData.password;
                            }
                            
                            // Make sure to preserve access token and basic info
                            const completeUserData = {
                                ...basicUserData,
                                ...userData,
                                access_token: basicUserData.access_token
                            };
                            
                            // Update localStorage with complete user data
                            localStorage.setItem('user', JSON.stringify(completeUserData));
                            console.log("Updated user data in localStorage with details:", completeUserData);
                            
                            return completeUserData;
                        }
                    } catch (detailsError) {
                        console.error('Error fetching user details:', detailsError.message);
                        // We already saved the basic info, so login still succeeds
                    }
                }
                
                return basicUserData;
            }
        } catch (error) {
            console.error('Error processing user_info cookie:', error);
        }
        
        return null;
    };

    useEffect(() => {
        // Check for user_info cookie on component mount
        const checkForUserCookie = async () => {
            const userData = await processUserInfoCookie();
            if (userData) {
                console.log("Found and processed user_info cookie on component mount");
                
                // Notify user of successful login
                toast.success("Đăng nhập thành công!", {
                    position: "top-center",
                    autoClose: 2000
                });
                
                // Call handleLoginSuccess to update auth context
                if (handleLoginSuccess) {
                    handleLoginSuccess();
                }
            }
        };
        
        checkForUserCookie();
        
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
    }, [handleLoginSuccess]);

    // Click outside handler for search suggestions and account popup
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

    const handleGoogleLogin = () => {
        try {
            console.log('Initiating Google login redirect...');
            
            // Redirect to Google login endpoint
            window.location.href = `${import.meta.env.VITE_API_URI}/auth/google/login`;
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error("Đăng nhập Google thất bại. Vui lòng thử lại sau.", {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const handleSkinQuizClick = async () => {
        // Only proceed if user is logged in
        if (!isLoggedIn()) {
            // If not logged in, show login popup
            openLogin(() => {
                // After login, check if user has taken the quiz and navigate accordingly
                checkQuizStatusAndNavigate();
            });
            return;
        }

        // If logged in, check quiz status and navigate
        checkQuizStatusAndNavigate();
    };

    const checkQuizStatusAndNavigate = async () => {
        try {
            // Show loading state (optional)
            // You could add a loading state here if desired

            // Check if user has taken the quiz
            const response = await checkUserSkinTypeAxios();

            if (response.hasTakenQuiz) {
                // User has taken the quiz before, navigate directly to results
                console.log('User has taken quiz before, navigating to results');
                navigate(`/skin-quiz/results/${response.skinType}`, {
                    state: {
                        fromDirectNavigation: true,
                        skinType: response.skinType
                    }
                });
            } else {
                // User hasn't taken the quiz, navigate to quiz page
                console.log('User has not taken quiz, navigating to quiz page');
                navigate('/skin-quiz');
            }
        } catch (error) {
            console.error('Error checking quiz status:', error);
            // If any error occurs, default to navigating to the quiz page
            navigate('/skin-quiz');
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

    const handleSignOutClick = async () => {
        // Close the account popup first
        setShowAccountPopup(false);

        try {
            // Call the logout API directly
            await logoutAxios();

            // Manually perform local logout (clear local storage) after API call
            localStorage.removeItem('access_token');
            localStorage.setItem('user', 'null');
            localStorage.setItem('cartItems', 'null');
            localStorage.setItem('favoriteItems', 'null');

            // Redirect to homepage after logout
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Still perform local logout even if API call fails
            localStorage.removeItem('access_token');
            localStorage.setItem('user', 'null');
            localStorage.setItem('cartItems', 'null');
            localStorage.setItem('favoriteItems', 'null');
            // Redirect to homepage
            window.location.href = '/';
        }
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
                                    <SearchLink
                                        text="Kem Chống Nắng"
                                        className={cx('navLink')}
                                    />
                                </li>
                                <li>
                                    <SearchLink
                                        text="Tẩy Trang"
                                        className={cx('navLink')}
                                    />
                                </li>
                                <li>
                                    <SearchLink
                                        text="Toner"
                                        className={cx('navLink')}
                                    />
                                </li>
                                <li>
                                    <SearchLink
                                        text="Sữa Rửa Mặt"
                                        className={cx('navLink')}
                                    />
                                </li>
                                <li>
                                    <SearchLink
                                        text="Tẩy tế bào chết"
                                        className={cx('navLink')}
                                    />
                                </li>
                                <li>
                                    <SearchLink
                                        text="Retinol"
                                        className={cx('navLink')}
                                    />
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
                                {isLoggedIn() && userInfo ? (
                                    <div>
                                        <div><span>Chào {userInfo?.name || 'Khách hàng'}</span></div>
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
                                (isLoggedIn() && userInfo ? (
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
                                        <button className={cx('loginBtn')} onClick={openLogin}>
                                            Đăng nhập
                                        </button>
                                        <div className={cx('registerLink')}>
                                            <span>Bạn chưa có tài khoản?</span>
                                            <button className={cx('signupBtn')} onClick={openSignup}>
                                                ĐĂNG KÝ NGAY
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div
                            className={cx('actionItem')}
                            onClick={handleSkinQuizClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <FaCheckSquare className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Kiểm tra</span>
                                <span>loại da</span>
                            </div>
                        </div>

                        <Link to={routes.support} className={cx('actionItem')}>
                            <FaPhone className={cx('icon')} />
                            <div className={cx('actionContent')}>
                                <span>Hỗ trợ</span>
                                <span>khách hàng</span>
                            </div>
                        </Link>

                        {/* Conditional cart link based on login status */}
                        {isLoggedIn() ? (
                            <Link to={routes.cart} className={cx('actionItem', 'cart')}>
                                <FaShoppingCart className={cx('icon')} />
                                <span className={cx('cartCount')}>{cartCount}</span>
                            </Link>
                        ) : (
                            <div
                                className={cx('actionItem', 'cart')}
                                onClick={() => {
                                    console.log("Cart icon clicked, showing login popup");
                                    openLogin(() => {
                                        // After login, navigate to cart
                                        navigate(routes.cart);
                                    });
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <FaShoppingCart className={cx('icon')} />
                                <span className={cx('cartCount')}>{cartCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <Navigation />
        </>
    );
}

export default Header;