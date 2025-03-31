import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import { FaBars } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';
import LoginForm from '~/components/Header/LoginPopup';
import { updateAddressAxios } from '~/services/userAxios';

const cx = classNames.bind(styles);

const locationData = {
    regions: [
        "Hà Nội",
        "Hồ Chí Minh",
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "An Giang",
        "Bà Rịa - Vũng Tàu",
        "Bắc Giang",
        "Bắc Kạn",
        "Bạc Liêu",
        "Bắc Ninh",
        "Bến Tre",
        "Bình Định",
        "Bình Dương",
        "Bình Phước",
        "Bình Thuận",
        "Cà Mau",
        "Cao Bằng",
        "Đắk Lắk",
        "Đắk Nông",
        "Điện Biên",
        "Đồng Nai",
        "Đồng Tháp",
        "Gia Lai",
        "Hà Giang",
        "Hà Nam",
        "Hà Tĩnh",
        "Hải Dương",
        "Hậu Giang",
        "Hòa Bình",
        "Hưng Yên",
        "Khánh Hòa",
        "Kiên Giang",
        "Kon Tum",
        "Lai Châu",
        "Lâm Đồng",
        "Lạng Sơn",
        "Lào Cai",
        "Long An",
        "Nam Định",
        "Nghệ An",
        "Ninh Bình",
        "Ninh Thuận",
        "Phú Thọ",
        "Phú Yên",
        "Quảng Bình",
        "Quảng Nam",
        "Quảng Ngãi",
        "Quảng Ninh",
        "Quảng Trị",
        "Sóc Trăng",
        "Sơn La",
        "Tây Ninh",
        "Thái Bình",
        "Thái Nguyên",
        "Thanh Hóa",
        "Thừa Thiên Huế",
        "Tiền Giang",
        "Trà Vinh",
        "Tuyên Quang",
        "Vĩnh Long",
        "Vĩnh Phúc",
        "Yên Bái"
    ],
    districts: {
        "Hà Nội": [
            "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy",
            "Đống Đa", "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân", "Hà Đông",
            "Sơn Tây", "Ba Vì", "Chương Mỹ", "Đan Phượng", "Đông Anh",
            "Gia Lâm", "Hoài Đức", "Mê Linh", "Mỹ Đức", "Phú Xuyên",
            "Phúc Thọ", "Quốc Oai", "Sóc Sơn", "Thạch Thất", "Thanh Oai",
            "Thanh Trì", "Thường Tín", "Ứng Hòa", "Nam Từ Liêm", "Bắc Từ Liêm"
        ],
        "Hồ Chí Minh": [
            "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
            "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
            "Quận 11", "Quận 12", "Thủ Đức", "Gò Vấp", "Bình Thạnh",
            "Tân Bình", "Tân Phú", "Phú Nhuận", "Bình Tân", "Củ Chi",
            "Hóc Môn", "Bình Chánh", "Nhà Bè", "Cần Giờ"
        ],
        "Đà Nẵng": [
            "Liên Chiểu", "Thanh Khê", "Hải Châu", "Sơn Trà", "Ngũ Hành Sơn", "Cẩm Lệ", "Hòa Vang", "Hoàng Sa"
        ],
        "Hải Phòng": [
            "Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An",
            "Đồ Sơn", "Dương Kinh", "Thuỷ Nguyên", "An Dương", "An Lão",
            "Kiến Thuỵ", "Tiên Lãng", "Vĩnh Bảo", "Cát Hải", "Bạch Long Vĩ"
        ],
        "Cần Thơ": [
            "Ninh Kiều", "Ô Môn", "Bình Thuỷ", "Cái Răng", "Thốt Nốt",
            "Vĩnh Thạnh", "Cờ Đỏ", "Phong Điền", "Thới Lai"
        ],
        "An Giang": [
            "Long Xuyên", "Châu Đốc", "An Phú", "Tân Châu", "Phú Tân",
            "Châu Phú", "Tịnh Biên", "Tri Tôn", "Chợ Mới", "Châu Thành", "Thoại Sơn"
        ],
        "Bà Rịa - Vũng Tàu": [
            "Vũng Tàu", "Bà Rịa", "Phú Mỹ", "Châu Đức", "Xuyên Mộc", "Long Điền", "Đất Đỏ", "Côn Đảo"
        ],
        "Bắc Giang": [
            "Bắc Giang", "Yên Thế", "Tân Yên", "Lạng Giang", "Lục Nam",
            "Lục Ngạn", "Sơn Động", "Yên Dũng", "Việt Yên", "Hiệp Hòa"
        ],
        "Bắc Kạn": [
            "Bắc Kạn", "Pác Nặm", "Ba Bể", "Ngân Sơn", "Bạch Thông", "Chợ Đồn", "Chợ Mới", "Na Rì"
        ],
        "Bạc Liêu": [
            "Bạc Liêu", "Hồng Dân", "Phước Long", "Vĩnh Lợi", "Giá Rai", "Đông Hải", "Hoà Bình"
        ],
        "Bắc Ninh": [
            "Bắc Ninh", "Yên Phong", "Quế Võ", "Tiên Du", "Từ Sơn", "Thuận Thành", "Gia Bình", "Lương Tài"
        ],
        "Bến Tre": [
            "Bến Tre", "Châu Thành", "Chợ Lách", "Mỏ Cày Nam", "Giồng Trôm", "Bình Đại", "Ba Tri", "Thạnh Phú", "Mỏ Cày Bắc"
        ],
        "Bình Định": [
            "Quy Nhơn", "An Lão", "Hoài Nhơn", "Hoài Ân", "Phù Mỹ", "Vĩnh Thạnh", "Tây Sơn", "Phù Cát", "An Nhơn", "Tuy Phước", "Vân Canh"
        ],
        "Bình Dương": [
            "Thủ Dầu Một", "Bàu Bàng", "Dầu Tiếng", "Bến Cát", "Phú Giáo", "Tân Uyên", "Dĩ An", "Thuận An", "Bắc Tân Uyên"
        ],
        "Bình Phước": [
            "Đồng Xoài", "Bình Long", "Phước Long", "Bù Gia Mập", "Lộc Ninh", "Bù Đốp", "Hớn Quản", "Đồng Phú", "Bù Đăng", "Chơn Thành", "Phú Riềng"
        ],
        "Bình Thuận": [
            "Phan Thiết", "La Gi", "Tuy Phong", "Bắc Bình", "Hàm Thuận Bắc", "Hàm Thuận Nam", "Tánh Linh", "Đức Linh", "Hàm Tân", "Phú Quý"
        ],
        "Cà Mau": [
            "Cà Mau", "U Minh", "Thới Bình", "Trần Văn Thời", "Cái Nước", "Đầm Dơi", "Năm Căn", "Phú Tân", "Ngọc Hiển"
        ],
        "Cao Bằng": [
            "Cao Bằng", "Bảo Lâm", "Bảo Lạc", "Thông Nông", "Hà Quảng", "Trà Lĩnh", "Trùng Khánh", "Hạ Lang", "Quảng Uyên", "Phục Hoà", "Hoà An", "Nguyên Bình", "Thạch An"
        ],
        "Đắk Lắk": [
            "Buôn Ma Thuột", "Buôn Hồ", "Ea H'leo", "Ea Súp", "Buôn Đôn", "Cư M'gar", "Krông Búk", "Krông Năng", "Ea Kar", "M'Đrắk", "Krông Bông", "Krông Pắc", "Krông A Na", "Lắk", "Cư Kuin"
        ],
        "Đắk Nông": [
            "Gia Nghĩa", "Đăk Glong", "Cư Jút", "Đắk Mil", "Krông Nô", "Đắk Song", "Đắk R'Lấp", "Tuy Đức"
        ],
        "Điện Biên": [
            "Điện Biên Phủ", "Mường Lay", "Mường Nhé", "Mường Chà", "Tủa Chùa", "Tuần Giáo", "Điện Biên", "Điện Biên Đông", "Mường Ảng", "Nậm Pồ"
        ],
        "Đồng Nai": [
            "Biên Hòa", "Long Khánh", "Tân Phú", "Vĩnh Cửu", "Định Quán", "Trảng Bom", "Thống Nhất", "Cẩm Mỹ", "Long Thành", "Xuân Lộc", "Nhơn Trạch"
        ],
        "Đồng Tháp": [
            "Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Tân Hồng", "Hồng Ngự", "Tam Nông", "Tháp Mười", "Cao Lãnh", "Thanh Bình", "Lấp Vò", "Lai Vung", "Châu Thành"
        ],
        "Gia Lai": [
            "Pleiku", "An Khê", "Ayun Pa", "KBang", "Đăk Đoa", "Chư Păh", "Ia Grai", "Mang Yang", "Kông Chro", "Đức Cơ", "Chư Prông", "Chư Sê", "Đăk Pơ", "Ia Pa", "Krông Pa", "Phú Thiện", "Chư Pưh"
        ],
        "Hà Giang": [
            "Hà Giang", "Đồng Văn", "Mèo Vạc", "Yên Minh", "Quản Bạ", "Vị Xuyên", "Bắc Mê", "Hoàng Su Phì", "Xín Mần", "Bắc Quang", "Quang Bình"
        ],
        "Hà Nam": [
            "Phủ Lý", "Duy Tiên", "Kim Bảng", "Thanh Liêm", "Bình Lục", "Lý Nhân"
        ],
        "Hà Tĩnh": [
            "Hà Tĩnh", "Hồng Lĩnh", "Hương Sơn", "Đức Thọ", "Vũ Quang", "Nghi Xuân", "Can Lộc", "Hương Khê", "Thạch Hà", "Cẩm Xuyên", "Kỳ Anh", "Lộc Hà", "Kỳ Anh"
        ],
        "Hải Dương": [
            "Hải Dương", "Chí Linh", "Nam Sách", "Kinh Môn", "Kim Thành", "Thanh Hà", "Cẩm Giàng", "Bình Giang", "Gia Lộc", "Tứ Kỳ", "Ninh Giang", "Thanh Miện"
        ],
        "Hậu Giang": [
            "Vị Thanh", "Ngã Bảy", "Châu Thành A", "Châu Thành", "Phụng Hiệp", "Vị Thuỷ", "Long Mỹ", "Long Mỹ"
        ],
        "Hòa Bình": [
            "Hoà Bình", "Đà Bắc", "Kỳ Sơn", "Lương Sơn", "Kim Bôi", "Cao Phong", "Tân Lạc", "Mai Châu", "Lạc Sơn", "Yên Thủy", "Lạc Thủy"
        ],
        "Hưng Yên": [
            "Hưng Yên", "Văn Lâm", "Văn Giang", "Yên Mỹ", "Mỹ Hào", "Ân Thi", "Khoái Châu", "Kim Động", "Tiên Lữ", "Phù Cừ"
        ],
        "Khánh Hòa": [
            "Nha Trang", "Cam Ranh", "Ninh Hòa", "Vạn Ninh", "Khánh Vĩnh", "Diên Khánh", "Khánh Sơn", "Trường Sa", "Cam Lâm"
        ],
        "Kiên Giang": [
            "Rạch Giá", "Hà Tiên", "Kiên Lương", "Hòn Đất", "Tân Hiệp", "Châu Thành", "Giồng Riềng", "Gò Quao", "An Biên", "An Minh", "Vĩnh Thuận", "Phú Quốc", "Kiên Hải", "U Minh Thượng", "Giang Thành"
        ],
        "Kon Tum": [
            "Kon Tum", "Đắk Glei", "Ngọc Hồi", "Đắk Tô", "Kon Plông", "Kon Rẫy", "Đắk Hà", "Sa Thầy", "Tu Mơ Rông", "Ia H'Drai"
        ],
        "Lai Châu": [
            "Lai Châu", "Tam Đường", "Mường Tè", "Sìn Hồ", "Phong Thổ", "Than Uyên", "Tân Uyên", "Nậm Nhùn"
        ],
        "Lâm Đồng": [
            "Đà Lạt", "Bảo Lộc", "Đam Rông", "Lạc Dương", "Lâm Hà", "Đơn Dương", "Đức Trọng", "Di Linh", "Bảo Lâm", "Đạ Huoai", "Đạ Tẻh", "Cát Tiên"
        ],
        "Lạng Sơn": [
            "Lạng Sơn", "Tràng Định", "Bình Gia", "Văn Lãng", "Cao Lộc", "Văn Quan", "Bắc Sơn", "Hữu Lũng", "Chi Lăng", "Lộc Bình", "Đình Lập"
        ],
        "Lào Cai": [
            "Lào Cai", "Bát Xát", "Mường Khương", "Si Ma Cai", "Bắc Hà", "Bảo Thắng", "Bảo Yên", "Sa Pa", "Văn Bàn"
        ],
        "Long An": [
            "Tân An", "Kiến Tường", "Tân Hưng", "Vĩnh Hưng", "Mộc Hóa", "Tân Thạnh", "Thạnh Hóa", "Đức Huệ", "Đức Hòa", "Bến Lức", "Thủ Thừa", "Tân Trụ", "Cần Đước", "Cần Giuộc", "Châu Thành"
        ],
        "Nam Định": [
            "Nam Định", "Mỹ Lộc", "Vụ Bản", "Ý Yên", "Nghĩa Hưng", "Nam Trực", "Trực Ninh", "Xuân Trường", "Giao Thủy", "Hải Hậu"
        ],
        "Nghệ An": [
            "Vinh", "Cửa Lò", "Thái Hoà", "Quế Phong", "Quỳ Châu", "Kỳ Sơn", "Tương Dương", "Nghĩa Đàn", "Quỳ Hợp", "Quỳnh Lưu", "Con Cuông", "Tân Kỳ", "Anh Sơn", "Diễn Châu", "Yên Thành", "Đô Lương", "Thanh Chương", "Nghi Lộc", "Nam Đàn", "Hưng Nguyên", "Hoàng Mai"
        ],
        "Ninh Bình": [
            "Ninh Bình", "Tam Điệp", "Nho Quan", "Gia Viễn", "Hoa Lư", "Yên Khánh", "Kim Sơn", "Yên Mô"
        ],
        "Ninh Thuận": [
            "Phan Rang-Tháp Chàm", "Bác Ái", "Ninh Sơn", "Ninh Hải", "Ninh Phước", "Thuận Bắc", "Thuận Nam"
        ],
        "Phú Thọ": [
            "Việt Trì", "Phú Thọ", "Đoan Hùng", "Hạ Hoà", "Thanh Ba", "Phù Ninh", "Yên Lập", "Cẩm Khê", "Tam Nông", "Lâm Thao", "Thanh Sơn", "Thanh Thuỷ", "Tân Sơn"
        ],
        "Phú Yên": [
            "Tuy Hoà", "Sông Cầu", "Đồng Xuân", "Tuy An", "Sơn Hòa", "Sông Hinh", "Tây Hoà", "Phú Hoà", "Đông Hòa"
        ],
        "Quảng Bình": [
            "Đồng Hới", "Minh Hóa", "Tuyên Hóa", "Quảng Trạch", "Bố Trạch", "Quảng Ninh", "Lệ Thủy", "Ba Đồn"
        ],
        "Quảng Nam": [
            "Tam Kỳ", "Hội An", "Tây Giang", "Đông Giang", "Đại Lộc", "Điện Bàn", "Duy Xuyên", "Quế Sơn", "Nam Giang", "Phước Sơn", "Hiệp Đức", "Thăng Bình", "Tiên Phước", "Bắc Trà My", "Nam Trà My", "Núi Thành", "Phú Ninh", "Nông Sơn"
        ],
        "Quảng Ngãi": [
            "Quảng Ngãi", "Bình Sơn", "Trà Bồng", "Tây Trà", "Sơn Tịnh", "Tư Nghĩa", "Sơn Hà", "Sơn Tây", "Minh Long", "Nghĩa Hành", "Mộ Đức", "Đức Phổ", "Ba Tơ", "Lý Sơn"
        ],
        "Quảng Ninh": [
            "Hạ Long", "Móng Cái", "Cẩm Phả", "Uông Bí", "Bình Liêu", "Tiên Yên", "Đầm Hà", "Hải Hà", "Ba Chẽ", "Vân Đồn", "Hoành Bồ", "Đông Triều", "Quảng Yên", "Cô Tô"
        ],
        "Quảng Trị": [
            "Đông Hà", "Quảng Trị", "Vĩnh Linh", "Hướng Hóa", "Gio Linh", "Đa Krông", "Cam Lộ", "Triệu Phong", "Hải Lăng", "Cồn Cỏ"
        ],
        "Sóc Trăng": [
            "Sóc Trăng", "Châu Thành", "Kế Sách", "Mỹ Tú", "Cù Lao Dung", "Long Phú", "Mỹ Xuyên", "Ngã Năm", "Thạnh Trị", "Vĩnh Châu", "Trần Đề"
        ],
        "Sơn La": [
            "Sơn La", "Quỳnh Nhai", "Thuận Châu", "Mường La", "Bắc Yên", "Phù Yên", "Mai Sơn", "Yên Châu", "Sông Mã", "Mộc Châu", "Sốp Cộp", "Vân Hồ"
        ],
        "Tây Ninh": [
            "Tây Ninh", "Tân Biên", "Tân Châu", "Dương Minh Châu", "Châu Thành", "Hòa Thành", "Gò Dầu", "Bến Cầu", "Trảng Bàng"
        ],
        "Thái Bình": [
            "Thái Bình", "Quỳnh Phụ", "Hưng Hà", "Đông Hưng", "Thái Thụy", "Tiền Hải", "Kiến Xương", "Vũ Thư"
        ],
        "Thái Nguyên": [
            "Thái Nguyên", "Sông Công", "Định Hóa", "Phú Lương", "Đồng Hỷ", "Võ Nhai", "Đại Từ", "Phổ Yên", "Phú Bình"
        ],
        "Thanh Hóa": [
            "Thanh Hóa", "Bỉm Sơn", "Sầm Sơn", "Mường Lát", "Quan Hóa", "Bá Thước", "Quan Sơn", "Lang Chánh", "Ngọc Lặc", "Cẩm Thủy", "Thạch Thành", "Hà Trung", "Vĩnh Lộc", "Yên Định", "Thọ Xuân", "Thường Xuân", "Triệu Sơn", "Thiệu Hóa", "Hoằng Hóa", "Hậu Lộc", "Nga Sơn", "Như Xuân", "Như Thanh", "Nông Cống", "Đông Sơn", "Quảng Xương", "Tĩnh Gia"
        ],
        "Thừa Thiên Huế": [
            "Huế", "Phong Điền", "Quảng Điền", "Phú Vang", "Hương Thủy", "Hương Trà", "A Lưới", "Phú Lộc", "Nam Đông"
        ],
        "Tiền Giang": [
            "Mỹ Tho", "Gò Công", "Cai Lậy", "Tân Phước", "Cái Bè", "Cai Lậy", "Châu Thành", "Chợ Gạo", "Gò Công Tây", "Gò Công Đông", "Tân Phú Đông"
        ],
        "Trà Vinh": [
            "Trà Vinh", "Càng Long", "Cầu Kè", "Tiểu Cần", "Châu Thành", "Cầu Ngang", "Trà Cú", "Duyên Hải", "Duyên Hải"
        ],
        "Tuyên Quang": [
            "Tuyên Quang", "Lâm Bình", "Na Hang", "Chiêm Hóa", "Hàm Yên", "Yên Sơn", "Sơn Dương"
        ],
        "Vĩnh Long": [
            "Vĩnh Long", "Bình Minh", "Long Hồ", "Mang Thít", "Tam Bình", "Trà Ôn", "Vũng Liêm", "Bình Tân"
        ],
        "Vĩnh Phúc": [
            "Vĩnh Yên", "Phúc Yên", "Lập Thạch", "Tam Dương", "Tam Đảo", "Bình Xuyên", "Yên Lạc", "Vĩnh Tường", "Sông Lô"
        ],
        "Yên Bái": [
            "Yên Bái", "Nghĩa Lộ", "Lục Yên", "Văn Yên", "Mù Căng Chải", "Trấn Yên", "Trạm Tấu", "Văn Chấn", "Yên Bình"
        ]
    },

    // Sample of wards for some districts
    wards: {
        "Quận 1": [
            "Phường Tân Định", "Phường Đa Kao", "Phường Bến Nghé", "Phường Bến Thành",
            "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Cầu Ông Lãnh",
            "Phường Cô Giang", "Phường Nguyễn Cư Trinh", "Phường Cầu Kho"
        ],
        "Quận 2": [
            "Phường Thảo Điền", "Phường An Phú", "Phường Bình An", "Phường Bình Trưng Đông",
            "Phường Bình Trưng Tây", "Phường Bình Khánh", "Phường An Khánh",
            "Phường Cát Lái", "Phường Thạnh Mỹ Lợi", "Phường An Lợi Đông", "Phường Thủ Thiêm"
        ],
        "Quận 3": [
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5",
            "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10",
            "Phường 11", "Phường 12", "Phường 13", "Phường 14"
        ],
        "Thủ Đức": [
            "Phường Linh Xuân", "Phường Bình Chiểu", "Phường Linh Trung", "Phường Tam Bình",
            "Phường Tam Phú", "Phường Hiệp Bình Phước", "Phường Hiệp Bình Chánh",
            "Phường Linh Chiểu", "Phường Linh Tây", "Phường Linh Đông",
            "Phường Bình Thọ", "Phường Trường Thọ"
        ],
        "Ba Đình": [
            "Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Cống Vị",
            "Phường Liễu Giai", "Phường Nguyễn Trung Trực", "Phường Quán Thánh",
            "Phường Ngọc Hà", "Phường Điện Biên", "Phường Đội Cấn", "Phường Ngọc Khánh",
            "Phường Kim Mã", "Phường Giảng Võ", "Phường Thành Công"
        ],
        "Hoàn Kiếm": [
            "Phường Phúc Tân", "Phường Đồng Xuân", "Phường Hàng Mã", "Phường Hàng Buồm",
            "Phường Hàng Đào", "Phường Hàng Bồ", "Phường Cửa Đông", "Phường Lý Thái Tổ",
            "Phường Hàng Bạc", "Phường Hàng Gai", "Phường Chương Dương", "Phường Hàng Trống",
            "Phường Cửa Nam", "Phường Hàng Bông", "Phường Tràng Tiền", "Phường Trần Hưng Đạo",
            "Phường Phan Chu Trinh", "Phường Hàng Bài"
        ],
        "Hai Bà Trưng": [
            "Phường Phố Huế", "Phường Đống Mác", "Phường Thanh Nhàn", "Phường Bạch Đằng",
            "Phường Phạm Đình Hổ", "Phường Bùi Thị Xuân", "Phường Nguyễn Du", "Phường Lê Đại Hành",
            "Phường Đồng Nhân", "Phường Phố Huế", "Phường Đồng Tâm", "Phường Vĩnh Tuy",
            "Phường Bách Khoa", "Phường Quỳnh Mai", "Phường Quỳnh Lôi", "Phường Minh Khai",
            "Phường Trương Định", "Phường Thanh Lương"
        ],
        "Đống Đa": [
            "Phường Cát Linh", "Phường Văn Miếu", "Phường Quốc Tử Giám", "Phường Láng Thượng",
            "Phường Ô Chợ Dừa", "Phường Văn Chương", "Phường Hàng Bột", "Phường Khâm Thiên",
            "Phường Thổ Quan", "Phường Nam Đồng", "Phường Trung Phụng", "Phường Quang Trung",
            "Phường Trung Liệt", "Phường Phương Liên", "Phường Thịnh Quang", "Phường Trung Tự",
            "Phường Kim Liên", "Phường Phương Mai", "Phường Ngã Tư Sở", "Phường Khương Thượng"
        ],
        "Cầu Giấy": [
            "Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Mai Dịch", "Phường Dịch Vọng",
            "Phường Dịch Vọng Hậu", "Phường Quan Hoa", "Phường Yên Hoà", "Phường Trung Hoà"
        ],
        "Thanh Xuân": [
            "Phường Nhân Chính", "Phường Thượng Đình", "Phường Khương Trung", "Phường Khương Mai",
            "Phường Thanh Xuân Trung", "Phường Phương Liệt", "Phường Hạ Đình", "Phường Khương Đình",
            "Phường Thanh Xuân Bắc", "Phường Thanh Xuân Nam", "Phường Kim Giang"
        ],
        "Hải Châu": [
            "Phường Thanh Bình", "Phường Thuận Phước", "Phường Thạch Thang", "Phường Hải Châu I",
            "Phường Hải Châu II", "Phường Phước Ninh", "Phường Hòa Thuận Tây",
            "Phường Hòa Thuận Đông", "Phường Nam Dương", "Phường Bình Hiên", "Phường Bình Thuận",
            "Phường Hòa Cường Bắc", "Phường Hòa Cường Nam"
        ],
        "Thanh Khê": [
            "Phường Tam Thuận", "Phường Thanh Khê Đông", "Phường Thanh Khê Tây", "Phường Xuân Hà",
            "Phường Tân Chính", "Phường Chính Gián", "Phường Vĩnh Trung", "Phường Thạc Gián",
            "Phường An Khê", "Phường Hòa Khê"
        ],
        "Sơn Trà": [
            "Phường Mân Thái", "Phường Thọ Quang", "Phường Nại Hiên Đông", "Phường Phước Mỹ",
            "Phường An Hải Bắc", "Phường An Hải Tây", "Phường An Hải Đông"
        ],
        "Ngũ Hành Sơn": [
            "Phường Mỹ An", "Phường Khuê Mỹ", "Phường Hoà Quý", "Phường Hoà Hải"
        ],
        "Liên Chiểu": [
            "Phường Hòa Hiệp Bắc", "Phường Hòa Hiệp Nam", "Phường Hòa Khánh Bắc",
            "Phường Hòa Khánh Nam", "Phường Hòa Minh"
        ],
        "Cẩm Lệ": [
            "Phường Khuê Trung", "Phường Hòa Phát", "Phường Hòa An", "Phường Hòa Thọ Đông",
            "Phường Hòa Thọ Tây", "Phường Hòa Xuân"
        ],
        "Ninh Kiều": [
            "Phường Cái Khế", "Phường An Hòa", "Phường Thới Bình", "Phường An Nghiệp",
            "Phường An Cư", "Phường An Hội", "Phường Tân An", "Phường An Lạc",
            "Phường An Phú", "Phường Xuân Khánh", "Phường Hưng Lợi", "Phường An Khánh",
            "Phường Phú Thứ"
        ],
        "Bình Thủy": [
            "Phường Bình Thủy", "Phường Trà An", "Phường Trà Nóc", "Phường Thới An Đông",
            "Phường An Thới", "Phường Bùi Hữu Nghĩa", "Phường Long Hòa", "Phường Long Tuyền"
        ],
        "Hồng Bàng": [
            "Phường Hoàng Văn Thụ", "Phường Quang Trung", "Phường Phan Bội Châu", "Phường Phạm Hồng Thái",
            "Phường Quán Toan", "Phường Hùng Vương", "Phường Sở Dầu", "Phường Thượng Lý",
            "Phường Hạ Lý", "Phường Minh Khai", "Phường Trại Chuối", "Phường Quán Trữ",
            "Phường Lam Sơn", "Phường Gia Viên", "Phường Đông Khê"
        ]
    }
};

function Navigation() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const locationSelectorRef = useRef(null);
    const navigate = useNavigate();

    // Get address from user object in localStorage, fallback to confirmedAddress or default value
    const [confirmedAddress, setConfirmedAddress] = useState(() => {
        // Try to get address from user object first
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData && userData.address) {
                return userData.address;
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
        }

        // Fallback to confirmedAddress or default
        return localStorage.getItem('confirmedAddress') || "Chọn khu vực của bạn";
    });
    // Dữ liệu form tạm thời
    const [temporarySelectedRegion, setTemporarySelectedRegion] = useState("");
    const [temporarySelectedDistrict, setTemporarySelectedDistrict] = useState("");
    const [temporarySelectedWard, setTemporarySelectedWard] = useState("");
    const [errors, setErrors] = useState({
        region: "",
        district: "",
        ward: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const newAddress = `${temporarySelectedWard}, ${temporarySelectedDistrict}, ${temporarySelectedRegion}`;

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
            }

            // Also maintain the confirmedAddress for backward compatibility
            localStorage.setItem('confirmedAddress', newAddress);

            // Update state
            setConfirmedAddress(newAddress);

            // Close modal and reset form
            setIsAddressModalOpen(false);
            setIsLocationOpen(false);
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsSubmitting(false);
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
                    <span>{confirmedAddress}</span>
                    {isLocationOpen && (
                        <div className={cx('locationDropdown')}>
                            <div className={cx('locationHeader')}>Khu vực bạn chọn hiện tại</div>
                            <div className={cx('locationContent')}>
                                <div className={cx('locationRow')}>
                                    <HiOutlineLocationMarker className={cx('locationIcon')} />
                                    <span className={cx('locationText')}>{confirmedAddress}</span>
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
                                    <button
                                        className={cx('closeButton')}
                                        onClick={() => { setIsAddressModalOpen(false); clearForm(); }}
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