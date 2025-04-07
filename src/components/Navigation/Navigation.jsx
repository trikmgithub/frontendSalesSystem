// src/components/Navigation/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import { FaBars } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';
import LoginForm from '~/components/Header/LoginPopup';
import { updateAddressAxios } from '~/services/userAxios';
import AddressSelector from '~/components/AddressSelector';
import { useAuth } from '~/context/AuthContext'; // Import useAuth hook

const cx = classNames.bind(styles);

function Navigation() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const locationSelectorRef = useRef(null);
    const navigate = useNavigate();
    const { userInfo } = useAuth(); // Get userInfo from AuthContext

    // State to hold the user's address
    const [userAddress, setUserAddress] = useState("Chọn khu vực của bạn");
    
    // State for the address data from selector
    const [addressData, setAddressData] = useState({
        region: "",
        district: "",
        ward: "",
        formattedAddress: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize address from user data in localStorage
    useEffect(() => {
        const loadAddressFromUser = () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                if (userData && userData.address) {
                    setUserAddress(userData.address);
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
            }
        };

        loadAddressFromUser();
    }, []);

    // Update address when userInfo changes (from AuthContext)
    useEffect(() => {
        if (userInfo && userInfo.address) {
            setUserAddress(userInfo.address);
        }
    }, [userInfo]);

    // Listen for storage events to update address when changed in other components
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                try {
                    const userData = JSON.parse(e.newValue || '{}');
                    if (userData && userData.address) {
                        setUserAddress(userData.address);
                    }
                } catch (error) {
                    console.error("Error parsing user data from storage event:", error);
                }
            }
        };

        // Add event listener for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        // Clean up
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Create NavSearchLink component for category links
    const NavSearchLink = ({ to, children, className }) => {
        const navigate = useNavigate();

        const handleClick = (e) => {
            e.preventDefault();
            // Extract the search term from the link text
            const searchTerm = typeof children === 'string' ? children : to.replace(/^\//, '').replace(/-/g, ' ');
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        };

        return (
            <a
                href="#"
                onClick={handleClick}
                className={className}
            >
                {children}
            </a>
        );
    };

    const handleChangeAddress = () => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser && storedUser !== "null" ? JSON.parse(storedUser) : null;

        if (!user) {
            setShowLoginForm(true); // Show login popup if user is not logged in
            return;
        }
        setIsAddressModalOpen(true); // Proceed to open address modal if logged in
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (locationSelectorRef.current && !locationSelectorRef.current.contains(event.target)) {
                setIsLocationOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [locationSelectorRef]);

    // Handle address change from AddressSelector
    const handleAddressChange = (newAddressData) => {
        setAddressData(newAddressData);
    };

    const handleSubmit = async () => {
        if (!addressData.formattedAddress) {
            return; // Address is incomplete
        }

        setIsSubmitting(true);
        const newAddress = addressData.formattedAddress;

        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('user') || '{}');

            // Update address in the backend if the user is logged in
            if (userData && userData.email) {
                try {
                    await updateAddressAxios({
                        email: userData.email,
                        address: newAddress
                    });
                    console.log("Address updated successfully via API");
                } catch (apiError) {
                    console.error("API address update failed:", apiError);
                }

                // Always update localStorage with new address regardless of API success
                userData.address = newAddress;
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Force a storage event to notify other components
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'user',
                    newValue: JSON.stringify(userData)
                }));
            }

            // Update state
            setUserAddress(newAddress);

            // Close modal and reset form
            setIsAddressModalOpen(false);
            setIsLocationOpen(false);
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('menuToggle')}>
                    <FaBars className={cx('menuIcon')} />
                    DANH MỤC
                    <div className={cx('dropdown')}>
                        <div className={cx('dropdownContent')}>
                            <ul>
                                <li>
                                    <NavSearchLink to="/my-pham-high-end">
                                        Mỹ Phẩm High-End
                                        <IoIosArrowForward />
                                    </NavSearchLink>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}>
                                                    <NavSearchLink to="/nuoc-hoa-cao-cap">Nước Hoa Cao Cấp</NavSearchLink>
                                                </li>
                                                <li><NavSearchLink to="/calvin-klein">Calvin Klein</NavSearchLink></li>
                                                <li><NavSearchLink to="/carolina-herrera">Carolina Herrera</NavSearchLink></li>
                                                <li><NavSearchLink to="/chloe">Chloé</NavSearchLink></li>
                                                <li><NavSearchLink to="/giorgio-armani">Giorgio Armani</NavSearchLink></li>
                                                <li><NavSearchLink to="/issey-miyake">Issey Miyake</NavSearchLink></li>
                                                <li><NavSearchLink to="/lancome">Lancôme</NavSearchLink></li>
                                                <li><NavSearchLink to="/marc-jacobs">Marc Jacobs</NavSearchLink></li>
                                                <li><NavSearchLink to="/mcm">MCM</NavSearchLink></li>
                                                <li><NavSearchLink to="/moschino">Moschino</NavSearchLink></li>
                                                <li><NavSearchLink to="/narciso-rodriguez">Narciso Rodriguez</NavSearchLink></li>
                                                <li><NavSearchLink to="/salvatore-ferragamo">Salvatore Ferragamo</NavSearchLink></li>
                                                <li><NavSearchLink to="/tommy-hilfiger">Tommy Hilfiger</NavSearchLink></li>
                                                <li><NavSearchLink to="/versace">Versace</NavSearchLink></li>
                                                <li><NavSearchLink to="/yves-saint-laurent">Yves Saint Laurent</NavSearchLink></li>
                                                <li><NavSearchLink to="/paco-rabanne">Paco Rabanne</NavSearchLink></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}>
                                                    <NavSearchLink to="/my-pham-cao-cap">Mỹ Phẩm Cao Cấp</NavSearchLink>
                                                </li>
                                                <li><NavSearchLink to="/elasten">Elasten</NavSearchLink></li>
                                                <li><NavSearchLink to="/elixir">Elixir</NavSearchLink></li>
                                                <li><NavSearchLink to="/loreal-professionnel">L'Oreal Professionnel</NavSearchLink></li>
                                                <li><NavSearchLink to="/martiderm">Martiderm</NavSearchLink></li>
                                                <li><NavSearchLink to="/marvis">Marvis</NavSearchLink></li>
                                                <li><NavSearchLink to="/obagi">Obagi</NavSearchLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <NavSearchLink to="/cham-soc-da-mat">
                                        Chăm Sóc Da Mặt
                                        <IoIosArrowForward />
                                    </NavSearchLink>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/lam-sach-da">Làm Sạch Da</NavSearchLink></li>
                                                <li><NavSearchLink to="/tay-trang-mat">Tẩy Trang Mặt</NavSearchLink></li>
                                                <li><NavSearchLink to="/sua-rua-mat">Sữa Rửa Mặt</NavSearchLink></li>
                                                <li><NavSearchLink to="/tay-te-bao-chet-da-mat">Tẩy Tế Bào Chết Da Mặt</NavSearchLink></li>
                                                <li><NavSearchLink to="/toner-nuoc-can-bang">Toner / Nước Cân Bằng Da</NavSearchLink></li>

                                                <li className={cx('sectionTitle')}><NavSearchLink to="/dac-tri">Đặc Trị</NavSearchLink></li>
                                                <li><NavSearchLink to="/serum-tinh-chat">Serum / Tinh Chất</NavSearchLink></li>
                                                <li><NavSearchLink to="/ho-tro-tri-mun">Hỗ Trợ Trị Mụn</NavSearchLink></li>

                                                <li className={cx('sectionTitle')}><NavSearchLink to="/duong-am">Dưỡng Ẩm</NavSearchLink></li>
                                                <li><NavSearchLink to="/xit-khoang">Xịt Khoáng</NavSearchLink></li>
                                                <li><NavSearchLink to="/lotion-sua-duong">Lotion / Sữa Dưỡng</NavSearchLink></li>
                                                <li><NavSearchLink to="/kem-gel-dau-duong">Kem / Gel / Dầu Dưỡng</NavSearchLink></li>

                                                <li className={cx('sectionTitle', 'boldText')}><NavSearchLink to="/bo-cham-soc-da-mat">Bộ Chăm Sóc Da Mặt</NavSearchLink></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('boldText')}><NavSearchLink to="/chong-nang-da-mat">Chống Nắng Da Mặt</NavSearchLink></li>
                                                <li className={cx('boldText')}><NavSearchLink to="/duong-moi">Dưỡng Môi</NavSearchLink></li>
                                                <li className={cx('boldText')}><NavSearchLink to="/mat-na">Mặt Nạ</NavSearchLink></li>

                                                <li className={cx('boldText')}><NavSearchLink to="/van-de-ve-da">Vấn Đề Về Da</NavSearchLink></li>
                                                <li><NavSearchLink to="/da-dau-lo-chan-long-to">Da Dầu / Lỗ Chân Lông To</NavSearchLink></li>
                                                <li><NavSearchLink to="/da-kho-mat-nuoc">Da Khô / Mất Nước</NavSearchLink></li>
                                                <li><NavSearchLink to="/da-lao-hoa">Da Lão Hóa</NavSearchLink></li>
                                                <li><NavSearchLink to="/da-mun">Da Mụn</NavSearchLink></li>
                                                <li><NavSearchLink to="/tham-nam-tan-nhang">Thâm / Nám / Tàn Nhang</NavSearchLink></li>

                                                <li className={cx('sectionTitle')}><NavSearchLink to="/dung-cu-phu-kien">Dụng Cụ / Phụ Kiện Chăm Sóc Da</NavSearchLink></li>
                                                <li><NavSearchLink to="/bong-tay-trang">Bông Tẩy Trang</NavSearchLink></li>
                                                <li><NavSearchLink to="/dung-cu-may-rua-mat">Dụng Cụ / Máy Rửa Mặt</NavSearchLink></li>
                                                <li><NavSearchLink to="/may-xong-mat">Máy Xông Mặt / Đẩy Tinh Chất</NavSearchLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <NavSearchLink to="/cham-soc-toc-da-dau">
                                        Chăm Sóc Da Đầu
                                        <IoIosArrowForward />
                                    </NavSearchLink>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/dau-goi-va-dau-xa">Dầu Gội Và Dầu Xả</NavSearchLink></li>
                                                <li><NavSearchLink to="/dau-goi">Dầu Gội</NavSearchLink></li>
                                                <li><NavSearchLink to="/dau-xa">Dầu Xả</NavSearchLink></li>
                                                <li><NavSearchLink to="/dau-goi-xa-2in1">Dầu Gội Xả 2in1</NavSearchLink></li>
                                                <li><NavSearchLink to="/bo-goi-xa">Bộ Gội Xả</NavSearchLink></li>

                                                <li className={cx('sectionTitle')}><NavSearchLink to="/tay-te-bao-chet-da-dau">Tẩy Tế Bào Chết Da Đầu</NavSearchLink></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/top-thuong-hieu">Top Thương Hiệu</NavSearchLink></li>
                                                <li><NavSearchLink to="/cocoon">Cocoon</NavSearchLink></li>
                                                <li><NavSearchLink to="/dr-forhair">Dr.ForHair</NavSearchLink></li>
                                                <li><NavSearchLink to="/fino">Fino</NavSearchLink></li>
                                                <li><NavSearchLink to="/girlz-only">Girlz Only</NavSearchLink></li>
                                                <li><NavSearchLink to="/loreal">L'Oréal</NavSearchLink></li>
                                                <li><NavSearchLink to="/loreal-professionnel">L'Oreal Professionnel</NavSearchLink></li>
                                                <li><NavSearchLink to="/nguyen-xuan">Nguyên Xuân</NavSearchLink></li>
                                                <li><NavSearchLink to="/ogx">OGX</NavSearchLink></li>
                                                <li><NavSearchLink to="/palmolive">Palmolive</NavSearchLink></li>
                                                <li><NavSearchLink to="/selsun">Selsun</NavSearchLink></li>
                                                <li><NavSearchLink to="/tresemme">TRESemmé</NavSearchLink></li>
                                                <li><NavSearchLink to="/tsubaki">Tsubaki</NavSearchLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <NavSearchLink to="/cham-soc-co-the">
                                        Chăm Sóc Cơ Thể
                                        <IoIosArrowForward />
                                    </NavSearchLink>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/sua-tam">Sữa Tắm</NavSearchLink></li>
                                                <li><NavSearchLink to="/xa-phong">Xà Phòng</NavSearchLink></li>
                                                <li><NavSearchLink to="/tay-te-bao-chet-body">Tẩy Tế Bào Chết Body</NavSearchLink></li>
                                                <li><NavSearchLink to="/duong-the">Dưỡng Thể</NavSearchLink></li>
                                                <li><NavSearchLink to="/duong-da-tay-chan">Dưỡng Da Tay / Chân</NavSearchLink></li>
                                                <li><NavSearchLink to="/chong-nang-co-the">Chống Nắng Cơ Thể</NavSearchLink></li>
                                                <li><NavSearchLink to="/khu-mui">Khử Mùi</NavSearchLink></li>

                                                <li className={cx('sectionTitle')}><NavSearchLink to="/bo-cham-soc-co-the">Bộ Chăm Sóc Cơ Thể</NavSearchLink></li>

                                                <li className={cx('boldText')}><NavSearchLink to="/bong-tam-phu-kien-tam">Bông Tắm / Phụ Kiện Tắm</NavSearchLink></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/top-thuong-hieu">Top Thương Hiệu</NavSearchLink></li>
                                                <li><NavSearchLink to="/angels-liquid">Angel's Liquid</NavSearchLink></li>
                                                <li><NavSearchLink to="/biore">Bioré</NavSearchLink></li>
                                                <li><NavSearchLink to="/cetaphil">Cetaphil</NavSearchLink></li>
                                                <li><NavSearchLink to="/cocoon">Cocoon</NavSearchLink></li>
                                                <li><NavSearchLink to="/dove">Dove</NavSearchLink></li>
                                                <li><NavSearchLink to="/etiaxil">EtiaXil</NavSearchLink></li>
                                                <li><NavSearchLink to="/hatomugi">Hatomugi</NavSearchLink></li>
                                                <li><NavSearchLink to="/lifebuoy">Lifebuoy</NavSearchLink></li>
                                                <li><NavSearchLink to="/nivea">Nivea</NavSearchLink></li>
                                                <li><NavSearchLink to="/old-spice">Old Spice</NavSearchLink></li>
                                                <li><NavSearchLink to="/paulas-choice">Paula's Choice</NavSearchLink></li>
                                                <li><NavSearchLink to="/secret-key">Secret Key</NavSearchLink></li>
                                                <li><NavSearchLink to="/sunplay">Sunplay</NavSearchLink></li>
                                                <li><NavSearchLink to="/vaseline">Vaseline</NavSearchLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <NavSearchLink to="/thuc-pham-chuc-nang">
                                        Thực Phẩm Chức Năng
                                        <IoIosArrowForward />
                                    </NavSearchLink>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/ho-tro-lam-dep">Hỗ Trợ Làm Đẹp</NavSearchLink></li>
                                                <li><NavSearchLink to="/lam-dep-da">Làm Đẹp Da</NavSearchLink></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><NavSearchLink to="/top-thuong-hieu">Top Thương Hiệu</NavSearchLink></li>
                                                <li><NavSearchLink to="/82x">82X</NavSearchLink></li>
                                                <li><NavSearchLink to="/adiva">Adiva</NavSearchLink></li>
                                                <li><NavSearchLink to="/blackmores">Blackmores</NavSearchLink></li>
                                                <li><NavSearchLink to="/blossomy">Blossomy</NavSearchLink></li>
                                                <li><NavSearchLink to="/costar">Costar</NavSearchLink></li>
                                                <li><NavSearchLink to="/dhc">DHC</NavSearchLink></li>
                                                <li><NavSearchLink to="/elasten">Elasten</NavSearchLink></li>
                                                <li><NavSearchLink to="/gilaa">Gilaa</NavSearchLink></li>
                                                <li><NavSearchLink to="/heliocare">Heliocare</NavSearchLink></li>
                                                <li><NavSearchLink to="/innerb">Innerb</NavSearchLink></li>
                                                <li><NavSearchLink to="/itoh-kanpo">Itoh kanpo</NavSearchLink></li>
                                                <li><NavSearchLink to="/menard">Menard</NavSearchLink></li>
                                                <li><NavSearchLink to="/nucos">Nucos</NavSearchLink></li>
                                                <li><NavSearchLink to="/orihiro">Orihiro</NavSearchLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={cx('separator')}>|</div>
                <nav className={cx('mainNav')}>
                    <ul>
                        <li><Link to="/thuong-hieu" className={cx('navLink')}>THƯƠNG HIỆU</Link></li>
                    </ul>
                </nav>
                <div ref={locationSelectorRef} className={cx('locationSelector')} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                    <span>{userAddress}</span>
                    {isLocationOpen && (
                        <div className={cx('locationDropdown')}>
                            <div className={cx('locationHeader')}>Khu vực bạn chọn hiện tại</div>
                            <div className={cx('locationContent')}>
                                <div className={cx('locationRow')}>
                                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                                    <span className={cx('locationText')}>{userAddress}</span>
                                </div>
                                <button className={cx('changeLocation')} onClick={handleChangeAddress}>
                                    Đổi địa chỉ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}

                {isAddressModalOpen && (
                    <div className={cx('modalOverlay')} onClick={() => setIsAddressModalOpen(false)}>
                        <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('modalContent')}>
                                <div className={cx('locationLabel')}>
                                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                                    <span>Chọn khu vực của bạn</span>
                                </div>

                                <AddressSelector 
                                    initialAddress={userAddress} 
                                    onAddressChange={handleAddressChange}
                                />

                                <div className={cx('modalActions')}>
                                    <button
                                        className={cx('closeButton')}
                                        onClick={() => setIsAddressModalOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        className={cx('confirmButton')}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navigation;