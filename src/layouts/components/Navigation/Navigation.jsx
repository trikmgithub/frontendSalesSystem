import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import { FaBars } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

const locationData = {
    regions: [
        "Hồ Chí Minh",
        "Hà Nội",
        "Đà Nẵng"
    ],
    districts: {
        "Hồ Chí Minh": [
            "Quận 1",
            "Quận 2",
            "Quận 3"
        ],
        "Hà Nội": [
            "Ba Đình",
            "Hoàn Kiếm",
            "Hai Bà Trưng"
        ],
        "Đà Nẵng": [
            "Hải Châu",
            "Thanh Khê",
            "Sơn Trà"
        ]
    },
    wards: {
        "Quận 1": [
            "Phường Bến Nghé",
            "Phường Bến Thành",
            "Phường Cô Giang"
        ],
        "Quận 2": [
            "Phường Thảo Điền",
            "Phường An Phú",
            "Phường Bình An"
        ],
        "Quận 3": [
            "Phường 1",
            "Phường 2",
            "Phường 3"
        ],
        "Ba Đình": [
            "Phường Trúc Bạch",
            "Phường Vĩnh Phúc",
            "Phường Cống Vị"
        ],
        "Hoàn Kiếm": [
            "Phường Hàng Bạc",
            "Phường Hàng Bồ",
            "Phường Hàng Đào"
        ],
        "Hai Bà Trưng": [
            "Phường Bách Khoa",
            "Phường Bạch Đằng",
            "Phường Bùi Thị Xuân"
        ],
        "Hải Châu": [
            "Phường Hải Châu 1",
            "Phường Hải Châu 2",
            "Phường Nam Dương"
        ],
        "Thanh Khê": [
            "Phường Thanh Khê Đông",
            "Phường Thanh Khê Tây",
            "Phường Xuân Hà"
        ],
        "Sơn Trà": [
            "Phường An Hải Bắc",
            "Phường An Hải Đông",
            "Phường An Hải Tây"
        ]
    }
};

function Navigation() {
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const locationSelectorRef = useRef(null);
    // Địa chỉ được xác nhận
    const [confirmedAddress, setConfirmedAddress] = useState(
        localStorage.getItem('confirmedAddress') || "Chọn khu vực của bạn"
    );
    // Dữ liệu form tạm thời
    const [temporarySelectedRegion, setTemporarySelectedRegion] = useState("");
    const [temporarySelectedDistrict, setTemporarySelectedDistrict] = useState("");
    const [temporarySelectedWard, setTemporarySelectedWard] = useState("");
    const [errors, setErrors] = useState({
        region: "",
        district: "",
        ward: ""
    });

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

    const handleRegionChange = (region) => {
        setTemporarySelectedRegion(region);
        setTemporarySelectedDistrict("");
        setTemporarySelectedWard("");
        setErrors({ ...errors, region: "" });
    };

    const handleDistrictChange = (district) => {
        setTemporarySelectedDistrict(district);
        setTemporarySelectedWard("");
        setErrors({ ...errors, district: "" });
    };

    const handleWardChange = (ward) => {
        setTemporarySelectedWard(ward);
        setErrors({ ...errors, ward: "" });
    };

    const validateForm = () => {
        const newErrors = {
            region: !temporarySelectedRegion ? "Vui lòng chọn khu vực" : "",
            district: !temporarySelectedDistrict ? "Vui lòng chọn quận/ huyện" : "",
            ward: !temporarySelectedWard ? "Vui lòng chọn phường/ xã" : ""
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const newAddress = `${temporarySelectedWard}, ${temporarySelectedDistrict}, ${temporarySelectedRegion}`;
            setConfirmedAddress(newAddress);
            localStorage.setItem('confirmedAddress', newAddress);
            setIsAddressModalOpen(false);
            setIsLocationOpen(false);
            clearForm();
        }
    };

    const clearForm = () => {
        setTemporarySelectedRegion("");
        setTemporarySelectedDistrict("");
        setTemporarySelectedWard("");
        setErrors({ region: "", district: "", ward: "" });
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
                                <li className={cx('boldText')}><Link to="/suc-khoe-lam-dep">Sức Khỏe - Làm Đẹp</Link></li>
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
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/lam-sach-da">Làm Sạch Da</Link></li>
                                                <li><Link to="/tay-trang-mat">Tẩy Trang Mặt</Link></li>
                                                <li><Link to="/sua-rua-mat">Sữa Rửa Mặt</Link></li>
                                                <li><Link to="/tay-te-bao-chet-da-mat">Tẩy Tế Bào Chết Da Mặt</Link></li>
                                                <li><Link to="/toner-nuoc-can-bang">Toner / Nước Cân Bằng Da</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/dac-tri">Đặc Trị</Link></li>
                                                <li><Link to="/serum-tinh-chat">Serum / Tinh Chất</Link></li>
                                                <li><Link to="/ho-tro-tri-mun">Hỗ Trợ Trị Mụn</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/duong-am">Dưỡng Ẩm</Link></li>
                                                <li><Link to="/xit-khoang">Xịt Khoáng</Link></li>
                                                <li><Link to="/lotion-sua-duong">Lotion / Sữa Dưỡng</Link></li>
                                                <li><Link to="/kem-gel-dau-duong">Kem / Gel / Dầu Dưỡng</Link></li>

                                                <li className={cx('sectionTitle', 'boldText')}><Link to="/bo-cham-soc-da-mat">Bộ Chăm Sóc Da Mặt</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('boldText')}><Link to="/chong-nang-da-mat">Chống Nắng Da Mặt</Link></li>
                                                <li className={cx('boldText')}><Link to="/duong-mat">Dưỡng Mắt</Link></li>
                                                <li className={cx('boldText')}><Link to="/duong-moi">Dưỡng Môi</Link></li>
                                                <li className={cx('boldText')}><Link to="/mat-na">Mặt Nạ</Link></li>

                                                <li className={cx('boldText')}><Link to="/van-de-ve-da">Vấn Đề Về Da</Link></li>
                                                <li><Link to="/da-dau-lo-chan-long-to">Da Dầu / Lỗ Chân Lông To</Link></li>
                                                <li><Link to="/da-kho-mat-nuoc">Da Khô / Mất Nước</Link></li>
                                                <li><Link to="/da-lao-hoa">Da Lão Hóa</Link></li>
                                                <li><Link to="/da-mun">Da Mụn</Link></li>
                                                <li><Link to="/tham-nam-tan-nhang">Thâm / Nám / Tàn Nhang</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/dung-cu-phu-kien">Dụng Cụ / Phụ Kiện Chăm Sóc Da</Link></li>
                                                <li><Link to="/bong-tay-trang">Bông Tẩy Trang</Link></li>
                                                <li><Link to="/dung-cu-may-rua-mat">Dụng Cụ / Máy Rửa Mặt</Link></li>
                                                <li><Link to="/may-xong-mat">Máy Xông Mặt / Đẩy Tinh Chất</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/trang-diem">
                                        Trang Điểm
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/trang-diem-mat">Trang Điểm Mặt</Link></li>
                                                <li><Link to="/kem-lot">Kem Lót</Link></li>
                                                <li><Link to="/kem-nen">Kem Nền</Link></li>
                                                <li><Link to="/phan-nuoc-cushion">Phấn Nước Cushion</Link></li>
                                                <li><Link to="/che-khuyet-diem">Che Khuyết Điểm</Link></li>
                                                <li><Link to="/ma-hong">Má Hồng</Link></li>
                                                <li><Link to="/tao-khoi-highlight">Tạo Khối / Highlight</Link></li>
                                                <li><Link to="/phan-phu">Phấn Phủ</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/trang-diem-mat">Trang Điểm Mắt</Link></li>
                                                <li><Link to="/ke-mat">Kẻ Mắt</Link></li>
                                                <li><Link to="/ke-may">Kẻ Mày</Link></li>
                                                <li><Link to="/phan-mat">Phấn Mắt</Link></li>
                                                <li><Link to="/mascara">Mascara</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/bo-trang-diem">Bộ Trang Điểm</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/trang-diem-moi">Trang Điểm Môi</Link></li>
                                                <li><Link to="/son-duong-moi">Son Dưỡng Môi</Link></li>
                                                <li><Link to="/son-kem-tint">Son Kem / Tint</Link></li>
                                                <li><Link to="/son-thoi">Son Thỏi</Link></li>
                                                <li><Link to="/son-bong">Son Bóng</Link></li>
                                                <li><Link to="/chi-ke-vien-moi">Chì Kẻ Viền Môi</Link></li>
                                                <li><Link to="/tay-trang-mat-moi">Tẩy Trang Mắt / Môi</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/trang-diem-mong">Trang Điểm Móng</Link></li>
                                                <li><Link to="/son-mong">Son Móng</Link></li>
                                                <li><Link to="/dung-cu-phu-kien-lam-mong">Dụng Cụ / Phụ Kiện Làm Móng</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/dung-cu-trang-diem">Dụng Cụ Trang Điểm</Link></li>
                                                <li><Link to="/bong-mut-trang-diem">Bông / Mút Trang Điểm</Link></li>
                                                <li><Link to="/co-trang-diem">Cọ Trang Điểm</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/cham-soc-toc-da-dau">
                                        Chăm Sóc Tóc Và Da Đầu
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/dau-goi-va-dau-xa">Dầu Gội Và Dầu Xả</Link></li>
                                                <li><Link to="/dau-goi">Dầu Gội</Link></li>
                                                <li><Link to="/dau-xa">Dầu Xả</Link></li>
                                                <li><Link to="/dau-goi-xa-2in1">Dầu Gội Xả 2in1</Link></li>
                                                <li><Link to="/bo-goi-xa">Bộ Gội Xả</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/tay-te-bao-chet-da-dau">Tẩy Tế Bào Chết Da Đầu</Link></li>

                                                <li className={cx('boldText')}><Link to="/duong-toc">Dưỡng Tóc</Link></li>
                                                <li><Link to="/mat-na-kem-u-toc">Mặt Nạ / Kem Ủ Tóc</Link></li>
                                                <li><Link to="/serum-dau-duong-toc">Serum / Dầu Dưỡng Tóc</Link></li>
                                                <li><Link to="/xit-duong-toc">Xịt Dưỡng Tóc</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/thuoc-nhuom-toc">Thuốc Nhuộm Tóc</Link></li>

                                                <li className={cx('boldText')}><Link to="/san-pham-tao-kieu-toc">Sản Phẩm Tạo Kiểu Tóc</Link></li>

                                                <li className={cx('boldText')}><Link to="/dung-cu-cham-soc-toc">Dụng Cụ Chăm Sóc Tóc</Link></li>

                                                <li className={cx('boldText')}><Link to="/bo-cham-soc-toc">Bộ Chăm Sóc Tóc</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/top-thuong-hieu">Top Thương Hiệu</Link></li>
                                                <li><Link to="/cocoon">Cocoon</Link></li>
                                                <li><Link to="/dr-forhair">Dr.ForHair</Link></li>
                                                <li><Link to="/fino">Fino</Link></li>
                                                <li><Link to="/girlz-only">Girlz Only</Link></li>
                                                <li><Link to="/loreal">L'Oréal</Link></li>
                                                <li><Link to="/loreal-professionnel">L'Oreal Professionnel</Link></li>
                                                <li><Link to="/nguyen-xuan">Nguyên Xuân</Link></li>
                                                <li><Link to="/ogx">OGX</Link></li>
                                                <li><Link to="/palmolive">Palmolive</Link></li>
                                                <li><Link to="/selsun">Selsun</Link></li>
                                                <li><Link to="/tresemme">TRESemmé</Link></li>
                                                <li><Link to="/tsubaki">Tsubaki</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/top-ban-chay">Top Bán Chạy</Link></li>

                                                <li className={cx('boldText')}><Link to="/hang-moi-ve">Hàng Mới Về</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/cham-soc-co-the">
                                        Chăm Sóc Cơ Thể
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/sua-tam">Sữa Tắm</Link></li>
                                                <li><Link to="/xa-phong">Xà Phòng</Link></li>
                                                <li><Link to="/tay-te-bao-chet-body">Tẩy Tế Bào Chết Body</Link></li>
                                                <li><Link to="/duong-the">Dưỡng Thể</Link></li>
                                                <li><Link to="/duong-da-tay-chan">Dưỡng Da Tay / Chân</Link></li>
                                                <li><Link to="/chong-nang-co-the">Chống Nắng Cơ Thể</Link></li>
                                                <li><Link to="/khu-mui">Khử Mùi</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/tay-long-triet-long">Tẩy Lông / Triệt Lông</Link></li>
                                                <li><Link to="/kem-tay-long">Kem Tẩy Lông</Link></li>
                                                <li><Link to="/dung-cu-tay-long">Dụng Cụ Tẩy Lông</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/bo-cham-soc-co-the">Bộ Chăm Sóc Cơ Thể</Link></li>

                                                <li className={cx('boldText')}><Link to="/bong-tam-phu-kien-tam">Bông Tắm / Phụ Kiện Tắm</Link></li>

                                                <li className={cx('boldText')}><Link to="/top-ban-chay">Top Bán Chạy</Link></li>

                                                <li className={cx('boldText')}><Link to="/hang-moi-ve">Hàng Mới Về</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/top-thuong-hieu">Top Thương Hiệu</Link></li>
                                                <li><Link to="/angels-liquid">Angel's Liquid</Link></li>
                                                <li><Link to="/biore">Bioré</Link></li>
                                                <li><Link to="/cetaphil">Cetaphil</Link></li>
                                                <li><Link to="/cocoon">Cocoon</Link></li>
                                                <li><Link to="/dove">Dove</Link></li>
                                                <li><Link to="/etiaxil">EtiaXil</Link></li>
                                                <li><Link to="/hatomugi">Hatomugi</Link></li>
                                                <li><Link to="/lifebuoy">Lifebuoy</Link></li>
                                                <li><Link to="/nivea">Nivea</Link></li>
                                                <li><Link to="/old-spice">Old Spice</Link></li>
                                                <li><Link to="/paulas-choice">Paula's Choice</Link></li>
                                                <li><Link to="/secret-key">Secret Key</Link></li>
                                                <li><Link to="/sunplay">Sunplay</Link></li>
                                                <li><Link to="/vaseline">Vaseline</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/cham-soc-ca-nhan">
                                        Chăm Sóc Cá Nhân
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/cham-soc-phu-nu">Chăm Sóc Phụ Nữ</Link></li>
                                                <li><Link to="/bang-ve-sinh">Băng Vệ Sinh</Link></li>
                                                <li><Link to="/dung-dich-ve-sinh">Dung Dịch Vệ Sinh</Link></li>
                                                <li><Link to="/duong-vung-kin">Dưỡng Vùng Kín</Link></li>
                                                <li><Link to="/mieng-dan-nguc">Miếng Dán Ngực</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/cham-soc-rang-mieng">Chăm Sóc Răng Miệng</Link></li>
                                                <li><Link to="/ban-chai-danh-rang">Bàn Chải Đánh Răng</Link></li>
                                                <li><Link to="/ban-chai-dien-phu-kien">Bàn Chải Điện / Phụ Kiện</Link></li>
                                                <li><Link to="/kem-danh-rang">Kem Đánh Răng</Link></li>
                                                <li><Link to="/nuoc-suc-mieng">Nước Súc Miệng</Link></li>
                                                <li><Link to="/tam-nuoc-chi-nha-khoa">Tăm Nước / Chỉ Nha Khoa</Link></li>
                                                <li><Link to="/xit-thom-mieng">Xịt Thơm Miệng</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/khan-giay-khan-uot">Khăn Giấy / Khăn Ướt</Link></li>

                                                <li className={cx('boldText')}><Link to="/khu-mui-lam-thom-phong">Khử Mùi / Làm Thơm Phòng</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/cham-soc-suc-khoe">Chăm Sóc Sức Khỏe</Link></li>
                                                <li><Link to="/bang-dan-ca-nhan">Băng Dán Cá Nhân</Link></li>
                                                <li><Link to="/chong-muoi">Chống Muỗi</Link></li>
                                                <li><Link to="/khau-trang">Khẩu Trang</Link></li>
                                                <li><Link to="/mat-na-xong-hoi">Mặt Nạ Xông Hơi</Link></li>
                                                <li><Link to="/mieng-dan-nong">Miếng Dán Nóng</Link></li>
                                                <li><Link to="/nuoc-rua-tay-diet-khuan">Nước Rửa Tay / Diệt Khuẩn</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/cao-rau">Cạo Râu</Link></li>
                                                <li><Link to="/bot-cao-rau">Bọt Cạo Râu</Link></li>
                                                <li><Link to="/dao-cao-rau">Dao Cạo Râu</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/ho-tro-tinh-duc">Hỗ Trợ Tình Dục</Link></li>
                                                <li><Link to="/bao-cao-su">Bao Cao Su</Link></li>
                                                <li><Link to="/gel-boi-tron">Gel Bôi Trơn</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/nuoc-hoa">
                                        Nước Hoa
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/nuoc-hoa-hang-hieu">Nước Hoa Hãng Hiệu</Link></li>
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
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/nuoc-hoa-gia-mem">Nước Hoa Giá Mềm</Link></li>
                                                <li><Link to="/armaf">Armaf</Link></li>
                                                <li><Link to="/de-memoria">De Memoria</Link></li>
                                                <li><Link to="/diamond">Diamond</Link></li>
                                                <li><Link to="/gennie">Gennie</Link></li>
                                                <li><Link to="/gota">Gota</Link></li>
                                                <li><Link to="/laura-anne">Laura Anne</Link></li>
                                                <li><Link to="/monotheme">Monotheme</Link></li>
                                                <li><Link to="/verites">Verites</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/nuoc-hoa-co-the">Nước Hoa Cơ Thể</Link></li>
                                                <li><Link to="/bodymiss">Bodymiss</Link></li>
                                                <li><Link to="/kiss-my-body">Kiss My Body</Link></li>
                                                <li><Link to="/malissa-kiss">Malissa Kiss</Link></li>
                                                <li><Link to="/silkygirl">Silkygirl</Link></li>
                                                <li><Link to="/foellie">Foellie</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/thuc-pham-chuc-nang">
                                        Thực Phẩm Chức Năng
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/ho-tro-lam-dep">Hỗ Trợ Làm Đẹp</Link></li>
                                                <li><Link to="/lam-dep-da">Làm Đẹp Da</Link></li>
                                                <li><Link to="/lam-dep-toc">Làm Đẹp Tóc</Link></li>
                                                <li><Link to="/ho-tro-giam-can">Hỗ Trợ Giảm Cân</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/ho-tro-suc-khoe">Hỗ Trợ Sức Khỏe</Link></li>
                                                <li><Link to="/bo-gan-giai-ruou">Bổ Gan / Giải Rượu</Link></li>
                                                <li><Link to="/dau-ca-bo-mat">Dầu Cá / Bổ Mắt</Link></li>
                                                <li><Link to="/hoat-huyet-duong-nao">Hoạt Huyết Dưỡng Não</Link></li>
                                                <li><Link to="/ho-tro-sinh-ly-noi-tiet-to">Hỗ Trợ Sinh Lý / Nội Tiết Tố</Link></li>
                                                <li><Link to="/ho-tro-tieu-hoa">Hỗ Trợ Tiêu Hoá</Link></li>
                                                <li><Link to="/ho-tro-tim-mach">Hỗ Trợ Tim Mạch</Link></li>
                                                <li><Link to="/ho-tro-xuong-khop">Hỗ Trợ Xương Khớp</Link></li>
                                                <li><Link to="/tang-suc-de-khang">Tăng Sức Đề Kháng</Link></li>
                                                <li><Link to="/vitamin-khoang-chat">Vitamin / Khoáng Chất</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/top-thuong-hieu">Top Thương Hiệu</Link></li>
                                                <li><Link to="/82x">82X</Link></li>
                                                <li><Link to="/adiva">Adiva</Link></li>
                                                <li><Link to="/blackmores">Blackmores</Link></li>
                                                <li><Link to="/blossomy">Blossomy</Link></li>
                                                <li><Link to="/costar">Costar</Link></li>
                                                <li><Link to="/dhc">DHC</Link></li>
                                                <li><Link to="/elasten">Elasten</Link></li>
                                                <li><Link to="/gilaa">Gilaa</Link></li>
                                                <li><Link to="/heliocare">Heliocare</Link></li>
                                                <li><Link to="/innerb">Innerb</Link></li>
                                                <li><Link to="/itoh-kanpo">Itoh kanpo</Link></li>
                                                <li><Link to="/menard">Menard</Link></li>
                                                <li><Link to="/nucos">Nucos</Link></li>
                                                <li><Link to="/orihiro">Orihiro</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/beauty-skin-clinic-spa">
                                        BeautySkin Clinic & Spa
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection', 'leftColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/dich-vu-phong-kham">Dịch Vụ Phòng Khám</Link></li>
                                                <li><Link to="/dieu-tri-mun">Điều Trị Mụn</Link></li>
                                                <li><Link to="/tri-nam-tan-nhang">Trị Nám/Tàn Nhang</Link></li>
                                                <li><Link to="/nang-co-xoa-nhan">Nâng cơ - Xóa nhăn</Link></li>
                                                <li><Link to="/dieu-tri-seo-ro">Điều Trị Sẹo Rỗ</Link></li>
                                                <li><Link to="/duong-sang-da">Dưỡng Sáng Da</Link></li>
                                                <li><Link to="/tre-hoa-da">Trẻ Hóa Da</Link></li>
                                                <li><Link to="/tri-tham-cac-vung">Trị Thâm Các Vùng</Link></li>
                                                <li><Link to="/xoa-not-ruoi">Xóa Nốt Ruồi Công Nghệ Laser</Link></li>

                                                <li className={cx('sectionTitle')}><Link to="/triet-long-diode-laser">Triệt Lông Diode Laser</Link></li>
                                                <li><Link to="/triet-long-nu">Triệt lông nữ</Link></li>
                                                <li><Link to="/triet-long-nam">Triệt lông nam</Link></li>
                                            </ul>
                                        </div>
                                        <div className={cx('submenuSection', 'rightColumn')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/thu-gian-cham-soc">Thu Giãn & Chăm Sóc</Link></li>
                                                <li><Link to="/cham-soc-da-mat">Chăm Sóc Da Mặt</Link></li>
                                                <li><Link to="/tay-da-chet-toan-than">Tẩy Da Chết Toàn Thân (Body Scrub)</Link></li>
                                                <li><Link to="/u-duong-toan-than">Ủ Dưỡng Toàn Thân (Body Mask)</Link></li>
                                                <li><Link to="/noi-uon-mi">Nối/Uốn Mi</Link></li>
                                                <li><Link to="/thu-gian-toan-than">Thư Giãn Toàn Thân</Link></li>
                                                <li><Link to="/goi-dau">Gội đầu</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/dich-vu-trai-nghiem">
                                        Dịch Vụ Trải Nghiệm
                                        <IoIosArrowForward />
                                    </Link>
                                    <div className={cx('submenu')}>
                                        <div className={cx('submenuSection')}>
                                            <ul>
                                                <li className={cx('sectionTitle')}><Link to="/dich-vu-trai-nghiem-lan-dau">Dịch Vụ Trải Nghiệm Lần Đầu</Link></li>
                                                <li><Link to="/triet-long-nach-nu">Triệt Lông Nách Nữ 49K</Link></li>
                                                <li><Link to="/triet-long-nach-nam">Triệt Lông Nách Nam 99K</Link></li>
                                                <li><Link to="/lay-mun-khang-khuan">Lấy Mụn Kháng Khuẩn 149K</Link></li>
                                                <li><Link to="/peel-bha-image">Peel BHA Image 500K</Link></li>
                                                <li><Link to="/dieu-tri-seo-ro">Điều Trị Sẹo Rỗ 2200K</Link></li>
                                                <li><Link to="/nang-co-ultherapy">Nâng Cơ Ultherapy 4320K</Link></li>
                                                <li><Link to="/thermage-flx">Thermage FLX 20000K</Link></li>
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
                        <li><Link to="/beauty-skin-deals">BEAUTYSKIN DEALS</Link></li>
                        <li><Link to="/hot-deals">HOT DEALS</Link></li>
                        <li><Link to="/thuong-hieu">THƯƠNG HIỆU</Link></li>
                        <li><Link to="/hang-moi-ve">HÀNG MỚI VỀ</Link></li>
                        <li><Link to="/ban-chay">BÁN CHẠY</Link></li>
                        <li><Link to="/clinic-spa">CLINIC & SPA</Link></li>
                    </ul>
                </nav>
                <div ref={locationSelectorRef} className={cx('locationSelector')} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                    <span>{confirmedAddress}</span>
                    {isLocationOpen && (
                        <div className={cx('locationDropdown')}>
                            <div className={cx('locationHeader')}>Khu vực bạn chọn hiện tại</div>
                            <div className={cx('locationContent')}>
                                <div className={cx('locationRow')}>
                                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                                    <span className={cx('locationText')}>{confirmedAddress}</span>
                                </div>
                                <button className={cx('changeLocation')} onClick={() => setIsAddressModalOpen(true)}>
                                    Đổi địa chỉ
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isAddressModalOpen && (
                    <div className={cx('modalOverlay')} onClick={() => { setIsAddressModalOpen(false); clearForm(); }}>
                        <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('modalContent')}>
                                <div className={cx('locationLabel')}>
                                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                                    <span>Chọn khu vực của bạn</span>
                                </div>

                                <div className={cx('formGroup')}>
                                    <select value={temporarySelectedRegion} onChange={(e) => handleRegionChange(e.target.value)}>
                                        <option value="">Tỉnh/Thành phố</option>
                                        {locationData.regions.map(region => <option key={region} value={region}>{region}</option>)}
                                    </select>
                                    {errors.region && <span className={cx('errorMessage')}>{errors.region}</span>}
                                </div>

                                <div className={cx('formGroup')}>
                                    <select value={temporarySelectedDistrict} onChange={(e) => handleDistrictChange(e.target.value)}>
                                        <option value="">Quận/ huyện</option>
                                        {temporarySelectedRegion && locationData.districts[temporarySelectedRegion]?.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    {errors.district && <span className={cx('errorMessage')}>{errors.district}</span>}
                                </div>

                                <div className={cx('formGroup')}>
                                    <select value={temporarySelectedWard} onChange={(e) => handleWardChange(e.target.value)}>
                                        <option value="">Phường/ xã</option>
                                        {temporarySelectedDistrict && locationData.wards[temporarySelectedDistrict]?.map(ward => (
                                            <option key={ward} value={ward}>{ward}</option>
                                        ))}
                                    </select>
                                    {errors.ward && <span className={cx('errorMessage')}>{errors.ward}</span>}
                                </div>
                                <div className={cx('modalActions')}>
                                    <button className={cx('closeButton')} onClick={() => { setIsAddressModalOpen(false); clearForm(); }}>Đóng</button>
                                    <button className={cx('confirmButton')} onClick={handleSubmit}>Xác nhận</button>
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