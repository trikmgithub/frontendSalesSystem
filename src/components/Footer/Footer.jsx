import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import freeship from '~/assets/2.jpg';
import brand from '~/assets/4.jpg';
import payment from '~/assets/1.jpg';
import returnImg from '~/assets/3.jpg';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('benefits')}>
                <div className={cx('container')}>
                    <div className={cx('benefitItem')}>
                        <img src={payment} alt="Thanh toán khi nhận hàng" />
                        <div className={cx('benefitText')}>
                            <h4>Thanh toán</h4>
                            <p>khi nhận hàng</p>
                        </div>
                    </div>
                    <div className={cx('benefitItem')}>
                        <img src={freeship} alt="Giao hàng miễn phí 2H" />
                        <div className={cx('benefitText')}>
                            <h4>Giao hàng</h4>
                            <p>miễn phí 2H</p>
                        </div>
                    </div>
                    <div className={cx('benefitItem')}>
                        <img src={returnImg} alt="30 ngày đổi trả miễn phí" />
                        <div className={cx('benefitText')}>
                            <h4>30 ngày đổi trả</h4>
                            <p>miễn phí</p>
                        </div>
                    </div>
                    <div className={cx('benefitItem')}>
                        <img src={brand} alt="Thương hiệu uy tín toàn cầu" />
                        <div className={cx('benefitText')}>
                            <h4>Thương hiệu uy tín</h4>
                            <p>toàn cầu</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('mainFooter')}>
                <div className={cx('container')}>
                    <div className={cx('footerSection')}>
                        <h3>HỖ TRỢ KHÁCH HÀNG</h3>
                        <div className={cx('hotline')}>
                            <p>Hotline: <span className={cx('phone')}>1800 6324</span></p>
                            <p className={cx('note')}>(miễn phí , 08-22h kể cả T7, CN)</p>
                        </div>
                        <ul>
                            <li><Link to="/#">Các câu hỏi thường gặp</Link></li>
                            <li><Link to="/#">Gửi yêu cầu hỗ trợ</Link></li>
                            <li><Link to="/#">Hướng dẫn đặt hàng</Link></li>
                            <li><Link to="/#">Phương thức vận chuyển</Link></li>
                            <li><Link to="/#">Chính sách đổi trả</Link></li>
                        </ul>
                    </div>

                    <div className={cx('footerSection')}>
                        <h3>VỀ BEAUTYSKIN</h3>
                        <ul>
                            <li><Link to="/#">Giới thiệu BeautySkin</Link></li>
                            <li><Link to="/#">Tuyển Dụng</Link></li>
                            <li><Link to="/#">Chính sách bảo mật</Link></li>
                            <li><Link to="/#">Điều khoản sử dụng</Link></li>
                            <li><Link to="/#">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div className={cx('footerSection')}>
                        <h3>HỢP TÁC & LIÊN KẾT</h3>
                        <ul>
                            <li><Link to="/#">https://www.kieuminhtri.site/</Link></li>
                            <li><Link to="/#">BeautySkin cẩm nang</Link></li>
                        </ul>
                        <h3>THANH TOÁN</h3>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
