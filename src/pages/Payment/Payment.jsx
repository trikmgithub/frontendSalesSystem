import React, { useContext, useState, useEffect } from "react";
import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/beautySkin.png';
import { Link } from 'react-router-dom';
import routes from '~/config/routes'
import { CartContext } from "~/context/CartContext";
import { useNavigate } from "react-router-dom";
import { payosPayAxios } from "~/services/paymentAxios";
import { updateAddressAxios, getUserByIdAxios } from "~/services/userAxios";
import { createCartAxios } from "~/services/cartAxios";

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

const Payment = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [tempSelectedPayment, setTempSelectedPayment] = useState('cod');
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User address state
  const [userAddress, setUserAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Address modal state
  const [temporarySelectedRegion, setTemporarySelectedRegion] = useState("");
  const [temporarySelectedDistrict, setTemporarySelectedDistrict] = useState("");
  const [temporarySelectedWard, setTemporarySelectedWard] = useState("");
  const [addressErrors, setAddressErrors] = useState({
    region: "",
    district: "",
    ward: ""
  });
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        // Set userId for payment
        if (userData && userData._id) {
          setUserId(userData._id);
        }

        // If user data exists in localStorage with address, use it
        if (userData && userData.address) {
          setUserAddress(userData.address);
          setIsLoading(false);
          return;
        }

        // Otherwise, fetch fresh data from API if we have an ID
        if (userData && userData._id) {
          const response = await getUserByIdAxios(userData._id);

          if (response && response.data && response.data.user) {
            setUserAddress(response.data.user.address);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // When address modal is opened and we have user address, parse it into components
    if (showAddressModal && userAddress) {
      const addressParts = userAddress.split(', ');

      if (addressParts.length >= 3) {
        setTemporarySelectedWard(addressParts[0]);
        setTemporarySelectedDistrict(addressParts[1]);
        setTemporarySelectedRegion(addressParts[2]);
      }
    }
  }, [showAddressModal, userAddress]);

  // Create Cart API function using the cartAxios service
  const createCartRecord = async (paymentMethod) => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Format cart items for API
      const formattedItems = cartItems.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Set status based on payment method
      // For bank transfer, set status to "done" immediately
      const orderStatus = paymentMethod === "bank" ? "done" : "pending";

      // Prepare request data
      const cartData = {
        userId: userId,
        items: formattedItems,
        totalAmount: calculateTotal(),
        status: orderStatus,
        paymentMethod: paymentMethod === "bank" ? "credit_card" : "cod"
      };

      // Use our cart service to create the cart
      const response = await createCartAxios(cartData);

      // Check if the response contains an error
      if (response.error) {
        throw new Error(response.message || "Failed to create cart record");
      }

      // Success! Clear cart items by using the clearCart function
      clearCart();
      return true;

    } catch (error) {
      console.error("Error creating cart record:", error);
      setError(error.message || "Failed to process payment. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle All Payment Success
  const handlePayment = async () => {
    if (!userAddress) {
      setError("Please add a delivery address before proceeding");
      return;
    }

    if (selectedPayment === "bank") {
      try {
        // First create cart record
        const cartCreated = await createCartRecord("bank");

        if (cartCreated) {
          // Cart has been cleared in createCartRecord
          // Then process payment via PayOS
          await payosPayAxios(cartItems, calculateTotal());
          // The redirect happens in the payosPayAxios function
        }
      } catch (error) {
        console.error("Bank Transfer Payment Error:", error);
        setError("Could not connect to payment gateway. Please try again.");
      }
    } else {
      // COD flow
      const cartCreated = await createCartRecord("cod");

      if (cartCreated) {
        // Cart has been cleared in createCartRecord
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate(routes.home);
        }, 3000);
      }
    }
  };

  const toggleAddressModal = () => {
    setShowAddressModal(!showAddressModal);

    // Reset form when closing modal
    if (showAddressModal) {
      setTemporarySelectedRegion("");
      setTemporarySelectedDistrict("");
      setTemporarySelectedWard("");
      setAddressErrors({
        region: "",
        district: "",
        ward: ""
      });
    }
  };

  const togglePaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
    setTempSelectedPayment(selectedPayment); // Set temporary state to current selected payment
  };

  const selectPaymentMethod = (method) => {
    setTempSelectedPayment(method); // Update temporary state
  };

  const confirmPaymentMethod = () => {
    setSelectedPayment(tempSelectedPayment); // Update main state
    setShowPaymentModal(false); // Close modal
  };

  const getPaymentIcon = () => {
    switch (selectedPayment) {
      case 'bank':
        return '🏦'; // Bank icon
      default:
        return '💵'; // Cash icon for COD
    }
  };

  const getPaymentLabel = () => {
    switch (selectedPayment) {
      case 'bank':
        return 'Thanh toán chuyển khoản';
      default:
        return 'Thanh toán khi nhận hàng (COD)';
    }
  };

  // Calculate discounted price if item is on flash sale
  const calculatePriceDisplay = (item) => {
    if (item.flashSale) {
      const originalPrice = Math.round(item.price / 0.7); // Calculate original price (30% discount)
      return {
        currentPrice: item.price,
        originalPrice: originalPrice
      };
    } else {
      return {
        currentPrice: item.price,
        originalPrice: null
      };
    }
  };

  // Address form handlers
  const handleRegionChange = (event) => {
    setTemporarySelectedRegion(event.target.value);
    setTemporarySelectedDistrict("");
    setTemporarySelectedWard("");
    setAddressErrors(prev => ({ ...prev, region: "" }));
  };

  const handleDistrictChange = (event) => {
    setTemporarySelectedDistrict(event.target.value);
    setTemporarySelectedWard("");
    setAddressErrors(prev => ({ ...prev, district: "" }));
  };

  const handleWardChange = (event) => {
    setTemporarySelectedWard(event.target.value);
    setAddressErrors(prev => ({ ...prev, ward: "" }));
  };

  const validateAddressForm = () => {
    const newErrors = {
      region: !temporarySelectedRegion ? "Vui lòng chọn khu vực" : "",
      district: !temporarySelectedDistrict ? "Vui lòng chọn quận/ huyện" : "",
      ward: !temporarySelectedWard ? "Vui lòng chọn phường/ xã" : ""
    };

    setAddressErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Updated handleSaveAddress function for the Payment page
  const handleSaveAddress = async () => {
    if (!validateAddressForm()) {
      return;
    }

    setIsAddressUpdating(true);

    try {
      const formattedAddress = `${temporarySelectedWard}, ${temporarySelectedDistrict}, ${temporarySelectedRegion}`;

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      // Check if we have the necessary user data
      if (!userData || !userData.email) {
        throw new Error('Không tìm thấy thông tin email người dùng');
      }

      try {
        // Call the API to update address with both email and address fields
        const response = await updateAddressAxios({
          email: userData.email,
          address: formattedAddress
        });

        console.log("Address updated successfully via API");

        userData.address = formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));

        // Update local state for UI
        setUserAddress(formattedAddress);

      } catch (apiError) {
        console.error("API address update failed:", apiError);

        // Even if API fails, update in localStorage as fallback
        userData.address = formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));

        console.log("Address updated in localStorage as fallback");

        // Update local state for UI
        setUserAddress(formattedAddress);
      }

      // Close modal
      setShowAddressModal(false);
    } catch (error) {
      console.error("Error in address update process:", error);
      alert("Không thể cập nhật địa chỉ. Vui lòng thử lại sau.");
    } finally {
      setIsAddressUpdating(false);
    }
  };

  return (
    <div className={cx('payment-container')}>
      {/* Header */}
      <div className={cx('payment-header')}>
        <Link to={routes.home}><img src={logo} alt="Logo" className={cx('logo')} /></Link>
        <h2>Thanh toán</h2>
      </div>

      {/* Payment Success Message */}
      {showSuccessMessage && (
        <div className={cx('payment-success')}>
          <h3>✅ Đặt hàng thành công!</h3>
          <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ sớm được giao.</p>
          <p>Đang chuyển hướng về trang chủ...</p>
          <Link to={routes.home} className={cx('back-home')}>Quay về trang chủ</Link>
        </div>
      )}

      <div className={cx('payment-content')}>
        {/* Left Section */}
        <div className={cx('payment-left')}>
          {!showSuccessMessage && (
            <>
              {/* Shipping Address */}
              <div className={cx('section')}>
                <h3>📍 Địa chỉ nhận hàng</h3>
                <div className={cx('address-box')}>
                  {isLoading ? (
                    <p>Đang tải thông tin địa chỉ...</p>
                  ) : userAddress ? (
                    <p>{userAddress}</p>
                  ) : (
                    <p className={cx('no-address')}>Chưa có địa chỉ, vui lòng thêm địa chỉ giao hàng</p>
                  )}
                  <a href="#" onClick={toggleAddressModal}>
                    {userAddress ? 'Thay đổi' : 'Thêm địa chỉ'}
                  </a>
                </div>
              </div>

              {/* Payment Method */}
              <div className={cx('section')}>
                <h3>💳 Hình thức thanh toán</h3>
                <div className={cx('payment-method')}>
                  <div className={cx('method-left')}>
                    <span className={cx('icon')}>{getPaymentIcon()}</span>
                    <span>{getPaymentLabel()}</span>
                  </div>
                  <a href="#" onClick={togglePaymentModal}>Thay đổi</a>
                </div>
              </div>

              {/* Order Item Section */}
              <div className={cx('section', 'order-items-section')}>
                <h3 className={cx('section-heading')}>🛒 Thông tin kiện hàng</h3>
                {cartItems.map((item) => {
                  const { currentPrice, originalPrice } = calculatePriceDisplay(item);

                  return (
                    <div key={item._id} className={cx("order-item")}>
                      <div className={cx("item-image-container")}>
                        <img
                          src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className={cx("product-image")}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </div>
                      <div className={cx("item-details")}>
                        <div className={cx("brand-name")}>{item.brand?.name || 'BRAND'}</div>
                        <div className={cx("product-name")}>{item.name}</div>
                      </div>
                      <div className={cx("item-price")}>
                        <div className={cx("quantity-price")}>
                          <span>{item.quantity}</span>
                          <span> × </span>
                          <span>{formatPrice(currentPrice)}</span>
                        </div>
                        <div className={cx("total-item-price")}>
                          {formatPrice(currentPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        {!showSuccessMessage && (
          <>
            <div className={cx('payment-right')}>
              <button
                className={cx('order-button')}
                onClick={handlePayment}
                disabled={!userAddress || loading}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
              {!userAddress && (
                <p className={cx('address-required-message')}>
                  Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
                </p>
              )}
              {error && (
                <p className={cx('address-required-message')}>
                  {error}
                </p>
              )}
              <p className={cx('order-agreement')}>
                Nhấn "Đặt hàng" đồng nghĩa việc bạn đồng ý tuân theo
                <a href="#"> Chính sách xử lý dữ liệu cá nhân </a> &
                <a href="#"> Điều khoản BeautySkin</a>
              </p>
              {/* Order Summary */}
              <div className={cx('order-summary')}>
                <h3 className={cx('order-summary-title')}>
                  Đơn hàng
                  <Link to={routes.cart} className={cx('cart-link')}>Thay đổi</Link>
                </h3>
                <div className={cx('summary-item')}>
                  <span>Tạm tính ({cartItems.length})</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className={cx('summary-item')}>
                  <span>Giảm giá</span>
                  <span>-0 đ</span>
                </div>
                <div className={cx('summary-item')}>
                  <span>Phí vận chuyển</span>
                  <span>0 đ</span>
                </div>
                <div className={cx('summary-item', 'total')}>
                  <span>Thành tiền (Đã VAT)</span>
                  <span className={cx("total-price")}>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <p className={cx('note')}>
                Đã bao gồm VAT, phí đóng gói, phí vận chuyển và các chi phí khác vui lòng xem{" "}
                <a href="#">Chính sách vận chuyển</a>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('address-modal')}>
            <div className={cx('modal-header')}>
              <h3>Địa chỉ nhận hàng</h3>
              <button className={cx('close-button')} onClick={toggleAddressModal}>×</button>
            </div>

            <div className={cx('address-form')}>
              <div className={cx('form-group')}>
                <select
                  value={temporarySelectedRegion}
                  onChange={handleRegionChange}
                  className={cx({ 'error': addressErrors.region })}
                >
                  <option value="">Tỉnh/Thành phố</option>
                  {locationData.regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {addressErrors.region && <span className={cx('error-message')}>{addressErrors.region}</span>}
              </div>

              <div className={cx('form-group')}>
                <select
                  value={temporarySelectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={!temporarySelectedRegion}
                  className={cx({ 'error': addressErrors.district })}
                >
                  <option value="">Quận/huyện</option>
                  {temporarySelectedRegion && locationData.districts[temporarySelectedRegion]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {addressErrors.district && <span className={cx('error-message')}>{addressErrors.district}</span>}
              </div>

              <div className={cx('form-group')}>
                <select
                  value={temporarySelectedWard}
                  onChange={handleWardChange}
                  disabled={!temporarySelectedDistrict}
                  className={cx({ 'error': addressErrors.ward })}
                >
                  <option value="">Phường/xã</option>
                  {temporarySelectedDistrict && locationData.wards[temporarySelectedDistrict]?.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
                {addressErrors.ward && <span className={cx('error-message')}>{addressErrors.ward}</span>}
              </div>
            </div>

            <div className={cx('modal-actions')}>
              <div className={cx('modal-buttons')}>
                <button className={cx('cancel-btn')} onClick={toggleAddressModal}>Hủy</button>
                <button
                  className={cx('confirm-btn')}
                  onClick={handleSaveAddress}
                  disabled={isAddressUpdating}
                >
                  {isAddressUpdating ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('payment-modal')}>
            <div className={cx('modal-header')}>
              <h3>Hình thức thanh toán</h3>
              <button className={cx('close-button')} onClick={togglePaymentModal}>×</button>
            </div>
            <div className={cx('payment-options')}>
              {/* COD Option */}
              <div
                className={cx('payment-option', { 'selected': tempSelectedPayment === 'cod' })}
                onClick={() => selectPaymentMethod('cod')}
              >
                <div className={cx('radio-container')}>
                  <input
                    type="radio"
                    id="pay-cod"
                    name="payment-method"
                    checked={tempSelectedPayment === 'cod'}
                    onChange={() => selectPaymentMethod('cod')}
                  />
                  <label htmlFor="pay-cod"></label>
                </div>
                <div className={cx('payment-icon')}>💵</div>
                <div className={cx('payment-details')}>
                  <h4>Thanh toán khi nhận hàng (COD)</h4>
                  <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </div>

              {/* Bank Transfer Option */}
              <div
                className={cx('payment-option', { 'selected': tempSelectedPayment === 'bank' })}
                onClick={() => selectPaymentMethod('bank')}
              >
                <div className={cx('radio-container')}>
                  <input
                    type="radio"
                    id="pay-bank"
                    name="payment-method"
                    checked={tempSelectedPayment === 'bank'}
                    onChange={() => selectPaymentMethod('bank')}
                  />
                  <label htmlFor="pay-bank"></label>
                </div>
                <div className={cx('payment-icon')}>📱</div>
                <div className={cx('payment-details')}>
                  <h4>Thanh toán chuyển khoản</h4>
                  <p>Quét mã QR để thanh toán qua ngân hàng</p>
                </div>
              </div>
            </div>
            <div className={cx('modal-actions')}>
              <div className={cx('modal-buttons')}>
                <button className={cx('cancel-btn')} onClick={togglePaymentModal}>Hủy</button>
                <button
                  className={cx('confirm-btn')}
                  onClick={confirmPaymentMethod}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;