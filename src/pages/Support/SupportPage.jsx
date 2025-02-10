import React from 'react';
import './SupportPage.module.scss';

const SupportPage = () => {
    return (
        <div className="support-page">
            <header className="support-header">
                <p>Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
                <input
                    type="text"
                    className="support-search"
                    placeholder="Nhập từ khóa để tìm sản phẩm, thương hiệu bạn mong muốn. Ví dụ: Hasaki"
                />
                <p>Hotline: 1800 6324 (Miễn phí)</p>
                <p>Chat</p>
            </header>

            <section className="support-links">
                <h2>Danh mục hỗ trợ</h2>
                <div className="link-grid">
                    <a href="/taikhoan" className="support-link">
                        <i className="fas fa-user"></i>
                        Tài khoản
                    </a>
                    <a href="/dathang" className="support-link">
                        <i className="fas fa-shopping-cart"></i>
                        Đặt hàng
                    </a>
                    <a href="/quycachdonggoi" className="support-link">
                        <i className="fas fa-box"></i>
                        Quy cách đóng gói
                    </a>
                    <a href="/vanchuyen2h" className="support-link">
                        <i className="fas fa-shipping-fast"></i>
                        Vận chuyển 2H
                    </a>
                    <a href="/phivanchuyen" className="support-link">
                        <i className="fas fa-money-bill"></i>
                        Phí vận chuyển
                    </a>
                    <a href="/baohanh" className="support-link">
                        <i className="fas fa-tools"></i>
                        Chính sách bảo hành Havatek
                    </a>
                    <a href="/doitra" className="support-link">
                        <i className="fas fa-exchange-alt"></i>
                        Đổi trả, hoàn tiền
                    </a>
                    <a href="/dichvuspa" className="support-link">
                        <i className="fas fa-spa"></i>
                        Dịch vụ SPA
                    </a>
                    <a href="/tuyendung" className="support-link">
                        <i className="fas fa-briefcase"></i>
                        Tuyển dụng
                    </a>
                </div>
            </section>

            <section className="support-content">
                <h2>Câu hỏi thường gặp</h2>
                <ul>
                    <li>Đăng ký thành viên Hasaki như thế nào?</li>
                    <li>Có cần đặt lịch trước khi đến spa hay không?</li>
                    <li>Tại sao tôi không thể đăng nhập vào tài khoản của tôi?</li>
                    <li>Đặt dịch vụ như thế nào?</li>
                    <li>Tôi có thể sử dụng chung tài khoản với người khác không?</li>
                    <li>Khám da tại spa Hasaki có tốn phí hay không?</li>
                </ul>
            </section>

            <section className="support-info">
                <h2>Thông tin hỗ trợ</h2>
                <ul>
                    <li>Giới thiệu Hasaki</li>
                    <li>Liên hệ</li>
                    <li>Hệ thống cửa hàng Hasaki trên toàn quốc</li>
                    <li>Các kênh chính thức của Hasaki</li>
                    <li>Hướng dẫn đặt hàng</li>
                    <li>Hướng dẫn đặt hàng 2H</li>
                    <li>Phương thức thanh toán</li>
                    <li>Chính sách vận chuyển giao nhận</li>
                    <li>Khách hàng thân thiết</li>
                    <li>Tri ân khách hàng thân thiết</li>
                    <li>Hướng dẫn đổi quà</li>
                    <li>Hướng dẫn nhận quà tri ân khách hàng từ Hasaki</li>
                    <li>Thẻ quà tặng Got It</li>
                    <li>Phiếu mua hàng Hasaki</li>
                    <li>Hướng dẫn tải & sử dụng App Hasaki</li>
                    <li>Điều khoản sử dụng</li>
                    <li>Chính sách bảo mật</li>
                    <li>Chính sách Cookie</li>
                    <li>Chính sách khách hàng Clinic</li>
                    <li>Quy định giao dịch chung</li>
                </ul>
            </section>
        </div>
    );
};

export default SupportPage;
