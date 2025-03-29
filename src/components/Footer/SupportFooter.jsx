import React from 'react';

function SupportFooter() {
    return (
        <footer className="support-footer">
            <div className="footer-social">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>    
                </a>
            </div>
            <div className="footer-info">
                <h3>Hỗ trợ khách hàng</h3>
                <p>Hotline: 1800 6324 (miễn phí)</p>
                <p>Mỹ phẩm: 08:00 - 22:00</p>
                <p>Clinic & Spa: 09:00 - 20:00</p>
                <ul>
                    <li><a href="/faq">Các câu hỏi thường gặp</a></li>
                    <li><a href="/support-request">Gửi yêu cầu hỗ trợ</a></li>
                    <li><a href="/order-guide">Hướng dẫn đặt hàng</a></li>
                    <li><a href="/shipping-methods">Phương thức vận chuyển</a></li>
                    <li><a href="/return-policy">Chính sách đổi trả</a></li>
                </ul>
                <h3>Về hasaki.vn</h3>
                <ul>
                    <li><a href="/gift-card">Phiếu mua hàng</a></li>
                    <li><a href="/about">Giới thiệu Hasaki.vn</a></li>
                    <li><a href="/careers">Tuyển dụng</a></li>
                    <li><a href="/privacy-policy">Chính sách bảo mật</a></li>
                    <li><a href="/terms-of-use">Điều khoản sử dụng</a></li>
                    <li><a href="/contact">Liên hệ</a></li>
                    <li><a href="/store-locations">Vị trí cửa hàng</a></li>
                    <li><a href="/partnerships">Hợp tác & Liên kết</a></li>
                    <li><a href="/clinic-spa">Hasaki Clinic & Spa</a></li>
                    <li><a href="/guide">Hasaki cẩm nang</a></li>
                </ul>
                <h3>Tải ứng dụng</h3>
            </div>
        </footer>
    );
}

export default SupportFooter;
