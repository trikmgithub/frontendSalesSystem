import classNames from 'classnames/bind';
import styles from './SignupPopup.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import { googleLoginAxios, registerAxios } from '~/services/authAxios';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';

const cx = classNames.bind(styles);

// Location data for address dropdowns
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

function SignupForm({ onClose, onShowLogin, verifiedEmail = '' }) {
  const [formData, setFormData] = useState({
    email: verifiedEmail,
    password: '',
    name: '',
    year: '',
    month: '',
    day: '',
    gender: '',
    address: '',
    selectedRegion: '',
    selectedDistrict: '',
    selectedWard: '',
    receivePromotions: false,
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addressErrors, setAddressErrors] = useState({
    region: '',
    district: '',
    ward: ''
  });

  // Use the custom hook to disable body scroll
  useDisableBodyScroll(true);

  const handleGoogleLogin = async () => {
    try {
      // Show loading state - you can use a state variable or toast
      // setIsLoading(true); // If you have a loading state

      console.log('Initiating Google login API call...');

      // Call the Google login API
      const response = await googleLoginAxios();

      if (response.error) {
        toast.error(response.message || "Đăng nhập Google thất bại", {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }

      if (response.success) {
        toast.success("Đăng nhập thành công!", {
          position: "top-center",
          autoClose: 2000
        });

        // Close any open popups
        setShowAccountPopup(false);

        // If using login modal
        if (onClose) {
          onClose();
        }

        // Call any success callbacks
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Update UI to reflect logged in state
        // For a cleaner approach, just reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 3000
      });
    } finally {
      // setIsLoading(false); // If you have a loading state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      year, month, day, acceptTerms,
      selectedRegion, selectedDistrict, selectedWard,
      ...rest
    } = formData;

    // Format birth date as YYYY-MM-DD
    const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Format address as "ward - district - region"
    const formattedAddress = selectedWard && selectedDistrict && selectedRegion
      ? `${selectedWard} - ${selectedDistrict} - ${selectedRegion}`
      : formData.address;

    // Validate required fields
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      (!formattedAddress && !formData.address) ||
      !formData.gender ||
      !year ||
      !month ||
      !day
    ) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Validate address selections
    if (!selectedRegion && !formData.address) {
      setAddressErrors(prev => ({ ...prev, region: 'Vui lòng chọn khu vực' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    if (selectedRegion && !selectedDistrict) {
      setAddressErrors(prev => ({ ...prev, district: 'Vui lòng chọn quận/huyện' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    if (selectedDistrict && !selectedWard) {
      setAddressErrors(prev => ({ ...prev, ward: 'Vui lòng chọn phường/xã' }));
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ.');
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 32) {
      setError("Mật khẩu phải có từ 6 đến 32 ký tự.");
      return;
    }

    if (!acceptTerms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng.');
      return;
    }

    try {
      const response = await registerAxios({
        ...rest,
        dateOfBirth,
        address: formattedAddress
      });

      // Check if response has isExistedEmail flag
      if (response.isExistedEmail) {
        setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
        return;
      }

      // Check for error response
      if (response.error || response.statusCode === 400) {
        // Check if the message indicates email already exists
        if (response.message && (
          response.message.includes('đã tồn tại trong hệ thống') ||
          response.message.includes('Email already exists')
        )) {
          setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
          return;
        }

        setError(response.message || 'Đăng ký thất bại.');
        return;
      }

      // Success case
      if (response.message === 'Register success' || (response.data && !response.error)) {
        setSuccess('Đăng ký thành công! Chuyển hướng sau 3 giây...');
        setError('');

        // Wait 3 seconds before redirecting
        setTimeout(() => {
          handleShowLogin();
        }, 3000);
      }
    } catch (error) {
      // If error is a string (from the previous implementation)
      if (typeof error === 'string') {
        if (error.includes('đã tồn tại trong hệ thống') ||
          error.includes('Email already exists')) {
          setError('Email đã được sử dụng, vui lòng chọn email khác hoặc đăng nhập.');
        } else {
          setError(error || 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.');
        }
      } else {
        setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại.');
      }
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError(''); // Clear error when the user starts typing

    // Clear address errors on change
    if (['selectedRegion', 'selectedDistrict', 'selectedWard'].includes(name)) {
      setAddressErrors(prev => ({
        ...prev,
        [name === 'selectedRegion' ? 'region' : name === 'selectedDistrict' ? 'district' : 'ward']: ''
      }));
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedRegion: region,
      selectedDistrict: '',
      selectedWard: ''
    }));
    setAddressErrors(prev => ({ ...prev, region: '' }));
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedDistrict: district,
      selectedWard: ''
    }));
    setAddressErrors(prev => ({ ...prev, district: '' }));
  };

  const handleWardChange = (e) => {
    const ward = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedWard: ward
    }));
    setAddressErrors(prev => ({ ...prev, ward: '' }));
  };

  const handleShowLogin = () => {
    onClose();
    onShowLogin();
  };

  return (
    <div className={cx('modalOverlay')} onClick={onClose}>
      <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
        <button className={cx('closeButton')} onClick={onClose}>
          ×
        </button>
        <h3>Đăng ký tài khoản</h3>
        <form className={cx('signupForm')} onSubmit={handleSubmit}>
          {error && (
            <div className={cx('errorMessage')}>
              <div className={cx('errorContent')}>
                <IoWarning size={16} />
                {error}
              </div>
              {error.includes('Email đã được sử dụng') && (
                <button type="button" className={cx('loginBtnError')} onClick={handleShowLogin}>
                  Đăng nhập ngay
                </button>
              )}
            </div>
          )}
          {success && (
            <div className={cx('successMessage')}>
              <IoCheckmarkCircle size={16} />
              {success}
            </div>
          )}
          <div className={cx('formGroup')}>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              readOnly={!!verifiedEmail}
            />
          </div>
          <div className={cx('formGroup')}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu từ 6 - 32 ký tự"
            />
          </div>
          <div className={cx('formGroup')}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Họ và tên"
            />
          </div>
          {/* Address dropdowns */}
          <div className={cx('addressGroup')}>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedRegion"
                value={formData.selectedRegion}
                onChange={handleRegionChange}
                className={addressErrors.region ? cx('error') : ''}
              >
                <option value="">Tỉnh/Thành phố</option>
                {locationData.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.region && <span className={cx('fieldError')}>{addressErrors.region}</span>}
            </div>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedDistrict"
                value={formData.selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!formData.selectedRegion}
                className={addressErrors.district ? cx('error') : ''}
              >
                <option value="">Quận/huyện</option>
                {formData.selectedRegion && locationData.districts[formData.selectedRegion]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.district && <span className={cx('fieldError')}>{addressErrors.district}</span>}
            </div>
            <div className={cx('selectWrapper')}>
              <select
                name="selectedWard"
                value={formData.selectedWard}
                onChange={handleWardChange}
                disabled={!formData.selectedDistrict}
                className={addressErrors.ward ? cx('error') : ''}
              >
                <option value="">Phường/xã</option>
                {formData.selectedDistrict && locationData.wards[formData.selectedDistrict]?.map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
              <div className={cx('selectArrow')}></div>
              {addressErrors.ward && <span className={cx('fieldError')}>{addressErrors.ward}</span>}
            </div>
          </div>
          <div className={cx('genderGroup')}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
              />
              <span>Nam</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
              />
              <span>Nữ</span>
            </label>
          </div>
          <div className={cx('birthDateGroup')}>
            <select name="day" value={formData.day} onChange={handleInputChange}>
              <option value="">Ngày</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select name="month" value={formData.month} onChange={handleInputChange}>
              <option value="">Tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select name="year" value={formData.year} onChange={handleInputChange}>
              <option value="">Năm</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={cx('checkboxGroup')}>
            <label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <span>
                Tôi đã đọc và đồng ý với{' '}
                <Link target="_blank" to="/terms">
                  Điều kiện giao dịch chung
                </Link>{' '}
                và{' '}
                <Link target="_blank" to="/privacy">
                  Chính sách bảo mật thông tin
                </Link>{' '}
                của BeautySkin
              </span>
            </label>
          </div>
          <button type="submit" className={cx('submitBtn')}>
            Đăng ký
          </button>
        </form>
        <div className={cx('loginLink')}>
          <span>Bạn đã có tài khoản? </span>
          <button className={cx('loginBtn')} onClick={handleShowLogin}>
            ĐĂNG NHẬP
          </button>
        </div>
        <div className={cx('socialLogin')}>
          <p>Hoặc đăng ký với:</p>
          <div className={cx('socialButtons')}>
            <button type="button" className={cx('googleBtn')} onClick={handleGoogleLogin}>
              <FcGoogle />
              Google +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;