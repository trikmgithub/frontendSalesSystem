import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import { FaBars } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';

const cx = classNames.bind(styles);

function Navigation() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('menuToggle')}>
                    <FaBars className={cx('menuIcon')} />
                    DANH MỤC
                    <div className={cx('dropdown')}>
                        <div className={cx('dropdownContent')}>
                            <ul>
                                <li><Link to="/suc-khoe-lam-dep">Sức Khỏe - Làm Đẹp</Link></li>
                                <li>
                                    <Link to="/my-pham-high-end">
                                        Mỹ Phẩm High-End
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}>
                                                    <Link to="/nuoc-hoa-cao-cap">Nước Hoa Cao Cấp</Link>
                                                </li>
                                                <li><Link to="/calvin-klein">Calvin Klein</Link></li>
                                                <li><Link to="/carolina-herrera">Carolina Herrera</Link></li>
                                                <li><Link to="/chloe">Chloé</Link></li>
                                                <li><Link to="/giorgio-armani">Giorgio Armani</Link></li>
                                                <li><Link to="/issey-miyake">Issey Miyake</Link></li>
                                                <li><Link to="/lancome">Lancôme</Link></li>
                                                <li><Link to="/marc-jacobs">Marc Jacobs</Link></li>
                                                <li><Link to="/mcm">MCM</Link></li>
                                                <li><Link to="/moschino">Moschino</Link></li>
                                                <li><Link to="/narciso-rodriguez">Narciso Rodriguez</Link></li>
                                                <li><Link to="/salvatore-ferragamo">Salvatore Ferragamo</Link></li>
                                                <li><Link to="/tommy-hilfiger">Tommy Hilfiger</Link></li>
                                                <li><Link to="/versace">Versace</Link></li>
                                                <li><Link to="/yves-saint-laurent">Yves Saint Laurent</Link></li>
                                                <li><Link to="/paco-rabanne">Paco Rabanne</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}>
                                                    <Link to="/my-pham-cao-cap">Mỹ Phẩm Cao Cấp</Link>
                                                </li>
                                                <li><Link to="/elasten">Elasten</Link></li>
                                                <li><Link to="/elixir">Elixir</Link></li>
                                                <li><Link to="/loreal-professionnel">L'Oreal Professionnel</Link></li>
                                                <li><Link to="/martiderm">Martiderm</Link></li>
                                                <li><Link to="/marvis">Marvis</Link></li>
                                                <li><Link to="/obagi">Obagi</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/cham-soc-da-mat">
                                        Chăm Sóc Da Mặt
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection')}>
                                            <h4>Làm Sạch Da</h4>
                                            <ul>
                                                <li><Link to="/tay-trang-mat">Tẩy Trang Mặt</Link></li>
                                                <li><Link to="/sua-rua-mat">Sữa Rửa Mặt</Link></li>
                                                <li><Link to="/tay-te-bao-chet-da-mat">Tẩy Tế Bào Chết Da Mặt</Link></li>
                                                <li><Link to="/toner-nuoc-can-bang">Toner / Nước Cân Bằng Da</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Đặc Trị</h4>
                                            <ul>
                                                <li><Link to="/serum-tinh-chat">Serum / Tinh Chất</Link></li>
                                                <li><Link to="/ho-tro-tri-mun">Hỗ Trợ Trị Mụn</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Dưỡng Ẩm</h4>
                                            <ul>
                                                <li><Link to="/xit-khoang">Xịt Khoáng</Link></li>
                                                <li><Link to="/lotion-sua-duong">Lotion / Sữa Dưỡng</Link></li>
                                                <li><Link to="/kem-gel-dau-duong">Kem / Gel / Dầu Dưỡng</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Chống Nắng Da Mặt</h4>
                                            <ul>
                                                <li><Link to="/duong-mat">Dưỡng Mắt</Link></li>
                                                <li><Link to="/duong-moi">Dưỡng Môi</Link></li>
                                                <li><Link to="/mat-na">Mặt Nạ</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Vấn Đề Về Da</h4>
                                            <ul>
                                                <li><Link to="/da-dau-lo-chan-long-to">Da Dầu / Lỗ Chân Lông To</Link></li>
                                                <li><Link to="/da-kho-mat-nuoc">Da Khô / Mất Nước</Link></li>
                                                <li><Link to="/da-lao-hoa">Da Lão Hóa</Link></li>
                                                <li><Link to="/da-mun">Da Mụn</Link></li>
                                                <li><Link to="/tham-nam-tan-nhang">Thâm / Nám / Tàn Nhang</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Dụng Cụ / Phụ Kiện Chăm Sóc Da</h4>
                                            <ul>
                                                <li><Link to="/bong-tay-trang">Bông Tẩy Trang</Link></li>
                                                <li><Link to="/dung-cu-may-rua-mat">Dụng Cụ / Máy Rửa Mặt</Link></li>
                                                <li><Link to="/may-xong-mat">Máy Xông Mặt / Đẩy Tinh Chất</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection')}>
                                            <h4>Bộ Chăm Sóc Da Mặt</h4>
                                            <ul>
                                                {/* Add any specific skincare sets if needed */}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/trang-diem">
                                        Trang Điểm
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cham-soc-toc-da-dau">
                                        Chăm Sóc Tóc Và Da Đầu
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cham-soc-co-the">
                                        Chăm Sóc Cơ Thể
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cham-soc-ca-nhan">
                                        Chăm Sóc Cá Nhân
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/nuoc-hoa">
                                        Nước Hoa
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/thuc-pham-chuc-nang">
                                        Thực Phẩm Chức Năng
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/hasaki-clinic-spa">
                                        Hasaki Clinic & Spa
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dich-vu-trai-nghiem">
                                        Dịch Vụ Trải Nghiệm
                                        <IoIosArrowForward />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={cx('separator')}>|</div>
                <nav className={cx('mainNav')}>
                    <ul>
                        <li><Link to="/hasaki-deals">HASAKI DEALS</Link></li>
                        <li><Link to="/hot-deals">HOT DEALS</Link></li>
                        <li><Link to="/thuong-hieu">THƯƠNG HIỆU</Link></li>
                        <li><Link to="/hang-moi-ve">HÀNG MỚI VỀ</Link></li>
                        <li><Link to="/ban-chay">BÁN CHẠY</Link></li>
                        <li><Link to="/clinic-spa">CLINIC & SPA</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navigation; 