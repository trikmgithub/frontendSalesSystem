import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaPhone, FaStore } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import styles from './Header.module.scss';
import logo from '~/assets/logo.jpg';

function Header() {
    return (
        <header className={styles.wrapper}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src={logo} alt="Hasaki.vn" />
                </Link>

                <div className={styles.searchSection}>
                    {/* Navigation menu */}
                    <nav className={styles.headerNav}>
                        <ul className={styles.navMenu}>
                            <li><Link to="/kem-chong-nang">Kem Chống Nắng</Link></li>
                            <li><Link to="/tay-trang">Tẩy Trang</Link></li>
                            <li><Link to="/toner">Toner</Link></li>
                            <li><Link to="/sua-rua-mat">Sữa Rửa Mặt</Link></li>
                            <li><Link to="/tay-te-bao-chet">Tẩy tế bào chết</Link></li>
                            <li><Link to="/retinol">Retinol</Link></li>
                        </ul>
                    </nav>

                    {/* Search bar */}
                    <div className={styles.searchContainer}>
                        <input 
                            type="text" 
                            placeholder="Giảm 50% Ủ Trắng Các Vùng - Mua 5 Tặng 5"
                            className={styles.searchInput}
                        />
                        <button className={styles.searchButton}>
                            <IoSearch />
                        </button>
                    </div>
                </div>

                {/* Header actions */}
                <div className={styles.headerActions}>
                    <div className={styles.actionItem}>
                        <FaUser className={styles.icon} />
                        <div className={styles.actionContent}>
                            <span>Đăng nhập / Đăng ký</span>
                            <span>Tài khoản</span>
                        </div>
                    </div>
                    
                    <div className={styles.actionItem}>
                        <FaStore className={styles.icon} />
                        <div className={styles.actionContent}>
                            <span>Hệ thống</span>
                            <span>cửa hàng</span>
                        </div>
                    </div>

                    <div className={styles.actionItem}>
                        <FaPhone className={styles.icon} />
                        <div className={styles.actionContent}>
                            <span>Hỗ trợ</span>
                            <span>khách hàng</span>
                        </div>
                    </div>

                    <div className={`${styles.actionItem} ${styles.cart}`}>
                        <FaShoppingCart className={styles.icon} />
                        <span className={styles.cartCount}>0</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
