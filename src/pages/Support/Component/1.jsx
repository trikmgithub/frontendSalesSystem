import React from 'react';
import styles from './SupportPage.module.scss';

const SupportComponent = () => {
  return (
    <div id="support_center" className={styles.support_center}>
      <header className={`${styles.width_common} ${styles.wrapper_header}`}>
        <div className={styles.container}>
          <div className={`${styles.logo_support} ${styles.left}`}>
            <a href="https://hasaki.vn/">
              <img src="../images/graphics/logo_site_2024_hotro.svg" alt="Hasaki Logo" />
            </a>
          </div>
          <div className={`${styles.right_support} ${styles.right} ${styles.hidden_xs}`}>
            <a href="/lien-he.html">Gửi yêu cầu</a> <span>|</span> <a href="https://hasaki.vn/customer/account/login/">Đăng nhập</a>
          </div>
        </div>
      </header>

      <main id="maincontent" className={`${styles.page_main} ${styles.width_common}`}>
        <div id="block_banner_page" className={styles.width_common}>
          <div className={styles.container}>
            <div className={`${styles.block_banner_support} ${styles.width_common}`}>
              <h1 className={`${styles.slogan} ${styles.text_center}`}>Xin chào! Chúng tôi có thể giúp gì cho bạn?</h1>
              <div className={`${styles.w_100} ${styles.text_center} ${styles.mb_3}`}>
                <div className={styles.block_search_support}>
                  <form action="https://hasaki.vn/catalogsearch/result/">
                    <input type="text" name="q" placeholder="Nhập từ khóa để tìm sản phẩm, thương hiệu bạn mong muốn. Ví dụ: Hasaki" />
                    <button className={styles.btn_search}>
                      <img src="../images/graphics/icon_search.svg" alt="Search" />
                    </button>
                  </form>
                </div>
              </div>
              <div className={styles.mt_2}>
                <div className={styles.block_sub_info}>
                  <div className={styles.flex_center}>
                    <div className={styles.box_kn}>
                      <span>
                        <img src="/images/graphics/icon_block_search_02.svg" alt="" />
                        <a href="tel:1800 6324" className={`${styles.text_white} ${styles.font_weight_bold}`}>
                          1800 6324
                        </a>
                      </span>
                      <span className={`${styles.badge} ${styles.badge_secondary} ${styles.badge_custom}`}>Miễn phí</span>
                    </div>
                    <div className={styles.box_chat}>
                      <span className={`${styles.item_sub_chat} ${styles.font_weight_bold}`}>
                        <img src="/images/graphics/icon_block_search_03.svg" alt="" />
                        Chat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div id="block_slogan_logo" className={`${styles.width_common} ${styles.space_bottom_20}`}>
            <div className={styles.row}>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_1}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Tài khoản</div>
                  <a href="/tai-khoan.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_8}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Đặt hàng</div>
                  <a href="/dat-hang-tai-hasaki.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_2}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Quy cách đóng gói</div>
                  <a href="/quy-cach-dong-goi.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_3}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Vận chuyển 2H</div>
                  <a href="/van-chuyen-2h.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_4}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Phí vận chuyển</div>
                  <a href="/phi-van-chuyen.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_10}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Chính sách bảo hành Havatek</div>
                  <a href="/chinh-sach-bao-hanh-havatek.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_5}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Đổi trả, hoàn tiền</div>
                  <a href="/doi-tra-hoan-tien.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_6}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Dịch vụ SPA</div>
                  <a href="/dich-vu-spa.html">&nbsp;</a>
                </div>
              </div>
              <div className={styles.item_slogan_logo}>
                <div className={styles.col}>
                  <div className={styles.block_image_slogan}><span className={`${styles.icon_slogan} ${styles.icon_7}`}>&nbsp;</span></div>
                  <div className={styles.text_logo}>Tuyển dụng</div>
                  <a href="https://tuyendung.hasaki.vn/">&nbsp;</a>
                </div>
              </div>
            </div>
          </div>
          <div id="block_cau_hoi_thuong_gap" className={styles.width_common}>
            <h1 className={`${styles.title_block_cauhoi} ${styles.width_common}`}>Câu hỏi thường gặp</h1>
            <div className={`${styles.list_cauhoi} ${styles.width_common}`}>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_dang_ky_thanh_vien_hasaki">Đăng ký thành viên Hasaki như thế nào?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_co_can_dat_lich_truoc">Có cần đặt lịch trước khi đến spa hay không?</a></div>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_tai_sao_khong_dang_nhap_duoc_tk">Tại sao tôi không thể đăng nhập vào tài khoản của tôi?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_co_can_dat_lich_truoc">Đặt dịch vụ như thế nào?</a></div>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_su_dung_chung_tk">Tôi có thể sử dụng chung tài khoản với người khác không?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_kham_da">Khám da tại spa Hasaki có tốn phí hay không?</a></div>
            </div>
          </div>
          <div id="block_thongtin_hotro" className={styles.width_common}>
            <h1 className={`${styles.title_block_cauhoi} ${styles.width_common}`}>Thông tin hỗ trợ</h1>
            <div className={`${styles.list_cauhoi} ${styles.width_common}`}>
              <div className={styles.item_main_menu}><a href="/gioi-thieu-hasaki.html">Giới thiệu Hasaki</a></div>
              <div className={styles.item_main_menu}><a href="/lien-he.html">Liên hệ</a></div>
              <div className={styles.item_main_menu}><a href="/he-thong-cua-hang.html">Hệ thống cửa hàng Hasaki trên toàn quốc</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-nhan-biet-kenh-chinh-thuc-cua-hasaki.html">Các kênh chính thức của Hasaki</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-dat-hang.html">Hướng dẫn đặt hàng</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-dat-hang-2h.html">Hướng dẫn đặt hàng 2H</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-thanh-toan-truc-tuyen-vnpay.html">Phương thức thanh toán</a></div>
              <div className={styles.item_main_menu}><a href="/quy-trinh-giao-hang.html">Chính sách vận chuyển giao nhận</a></div>
              <div className={styles.item_main_menu}><a href="/tri-an-khach-hang.html">Chương trình tích điểm</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-doi-qua.html">Hướng dẫn đổi điểm lấy quà</a></div>
              <div className={styles.item_main_menu}><a href="/chuong-trinh-tang-qua-tri-an-khach-hang-tu-hasaki.html">Chương trình quà tặng tri ân khách hàng</a></div>
              <div className={styles.item_main_menu}><a href="/the-qua-tang-mobile-gift.html">Thẻ quà tặng Got It</a></div>
              <div className={styles.item_main_menu}><a href="/phieu-mua-hang.html">Phiếu mua hàng Hasaki</a></div>
              <div className={styles.item_main_menu}><a href="/app">Hướng dẫn tải &amp; sử dụng App Hasaki</a></div>
              <div className={styles.item_main_menu}><a href="/dieu-khoan-su-dung.html">Điều khoản sử dụng</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-bao-mat.html">Chính sách bảo mật</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-cookie.html">Chính sách Cookie</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-khach-hang-clinic.html">Chính sách khách hàng Clinic</a></div>
              <div className={styles.item_main_menu}><a href="/quy-dinh-giao-dich-chung.html">Quy định giao dịch chung</a></div>
              <div className={styles.item_main_menu}><a href="/canh-bao-lua-dao.html">Cảnh báo lừa đảo mạo danh Hasaki</a></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="page-footer">
        <div className="container">
          <div className="main_footer width_common">
            <div className="row space_bottom_20">
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="fb-page fb_iframe_widget" data-href="https://www.facebook.com/Hasaki.vn/" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="adapt_container_width=true&amp;app_id=1028207553936734&amp;container_width=340&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true">
                  <span style={{ verticalAlign: 'bottom', width: '340px', height: '70px' }}>
                    <iframe name="f106fb37d8d83b56f" width="1000px" height="1000px" data-testid="fb:page Facebook Social Plugin" title="fb:page Facebook Social Plugin" frameBorder="0" allowTransparency="true" allowFullScreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.9/plugins/page.php?adapt_container_width=true&amp;app_id=1028207553936734&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfd3a8a214bfab3c1d%26domain%3Dhotro.hasaki.vn%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fhotro.hasaki.vn%252Ff9828894e0010d3e2%26relation%3Dparent.parent&amp;container_width=340&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true" style={{ border: 'none', visibility: 'visible', width: '340px', height: '70px' }}></iframe>
                  </span>
                </div>

                <script>
                  {`(function(d, s, id) {
                      var js, fjs = d.getElementsByTagName(s)[0];
                      if (d.getElementById(id)) return;
                      js = d.createElement(s);
                      js.id = id;
                      js.async = true;
                      js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.9&appId=1028207553936734";
                      fjs.parentNode.insertBefore(js, fjs);
                  }(document, 'script', 'facebook-jssdk'));`}
                </script>
                <script defer src="https://wsc.hasaki.vn/plugin_chat/live/ecomInit.js" onLoad="initModuleChat()"></script>
                <div className="block_chat_fb">
                  <a href="javascript:;" className="btn_close_chat"><i className="fa fa-close"></i> </a>
                  <div id="hsk-chat-root" style={{ position: 'fixed', right: '40px', bottom: '25px', width: '85px', zIndex: 100 }}>
                    <div id="main-chat-container" className="_container_uysnc_16" style={{ transform: 'translateX(100vw)', aspectRatio: '5 / 4' }}></div>
                    <img className="_icon_1lugr_47" src="https://wsc.hasaki.vn/assets/customer_icons/appIcon.svg" width="60px" height="60px" alt="" />
                  </div>
                  <div className="fb-page fb_iframe_widget" data-href="https://www.facebook.com/Hasaki.vn/" data-tabs="messages" data-width="270px" data-height="320" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" show-facepile="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="adapt_container_width=true&amp;app_id=1028207553936734&amp;container_width=230&amp;height=320&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=messages&amp;width=270px">
                    <span style={{ verticalAlign: 'bottom', width: '230px', height: '320px' }}>
                      <iframe name="f3c2e2cff21f9ed4a" height="320px" data-testid="fb:page Facebook Social Plugin" title="fb:page Facebook Social Plugin" frameBorder="0" allowTransparency="true" allowFullScreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.9/plugins/page.php?adapt_container_width=true&amp;app_id=1028207553936734&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df4531a895a1b930ff%26domain%3Dhotro.hasaki.vn%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fhotro.hasaki.vn%252Ff9828894e0010d3e2%26relation%3Dparent.parent&amp;container_width=230&amp;height=320&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=messages&amp;width=270px" style={{ border: 'none', visibility: 'visible', width: '230px', height: '320px' }}></iframe>
                    </span>
                  </div>
                </div>

                <div className="multi-channel-contact">
                  <div className="float-right">
                    <div className="mb-2 border-round" id="contact-map" title="" data-placement="left" data-original-title="Bản đồ">
                      <img src="../images/contact/widget_icon_map.jpg" width="54px" className="rounded-circle" alt="" />
                    </div>
                    <div className="mb-2 border-round" id="contact-sms" title="" data-placement="left" data-original-title="Để lại lời nhắn cho chúng tôi">
                      <img src="../images/contact/widget_icon_contact_form.jpg" width="54px" className="rounded-circle" alt="" />
                    </div>
                    <div className="mb-2 border-round" id="contact-call" title="" data-placement="left" data-original-title="Gọi ngay">
                      <img src="../images/contact/widget_icon_click_to_call.jpg" width="54px" className="rounded-circle" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <ul className="footer links">
                      <li>
                        <h4 className="tt_footer text-uppercase">Hỗ trợ khách hàng</h4>
                      </li>
                      <li>
                        <div>
                          <a href="tel:1800 6324">
                            <span className="txt_color_2">Hotline: 1800 6324&nbsp;(miễn phí)</span>
                          </a>
                        </div>
                        <div>
                          <span className="txt_color_2">
                            Mỹ phẩm: 08:00 - 22:00
                          </span>
                        </div>
                        <div>
                          <span className="txt_color_2">
                            Clinic &amp; Spa: 09:00 - 20:00
                          </span>
                        </div>
                      </li>
                      <li className="nav item"><a href="/tai-khoan.html" className="txt_link_hasaki">Các câu hỏi thường gặp</a></li>
                      <li className="nav item"><a href="https://hasaki.vn/lien-he" className="txt_link_hasaki">Gửi yêu cầu hỗ trợ</a></li>
                      <li className="nav item"><a href="/huong-dan-dat-hang.html" className="txt_link_hasaki">Hướng dẫn đặt hàng</a></li>
                      <li className="nav item"><a href="/phi-van-chuyen.html" className="txt_link_hasaki">Phương thức vận chuyển</a></li>
                      <li className="nav item"><a href="/doi-tra-hoan-tien.html" className="txt_link_hasaki">Chính sách đổi trả</a></li>
                    </ul>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3">
                    <ul className="footer links">
                      <li>
                        <h4 className="tt_footer text-uppercase">Về hasaki.vn</h4>
                      </li>
                      <li className="nav item"><a href="/phieu-mua-hang.html" className="txt_link_hasaki">Phiếu mua hàng</a></li>
                      <li className="nav item"><a href="/gioi-thieu-hasaki.html" className="txt_link_hasaki">Giới thiệu Hasaki.vn</a></li>
                      <li className="nav item"><a href="/viec-lam.html" className="txt_link_hasaki">Tuyển dụng</a></li>
                      <li className="nav item"><a href="/chinh-sach-bao-mat.html" className="txt_link_hasaki">Chính sách bảo mật</a></li>
                      <li className="nav item"><a href="/dieu-khoan-su-dung.html" className="txt_link_hasaki">Điều khoản sử dụng</a></li>
                      <li className="nav item"><a href="/lien-he.html" className="txt_link_hasaki">Liên hệ</a></li>
                      <li className="nav item"><a href="/he-thong-cua-hang.html" className="txt_link_hasaki">Vị trí cửa hàng</a></li>
                    </ul>
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <ul className="footer links">
                      <li>
                        <h4 className="tt_footer text-uppercase">Hợp tác &amp; Liên kết</h4>
                      </li>
                      <li className="nav item"><a href="https://hasaki.vn/spa.html" className="txt_link_hasaki">Hasaki Clinic &amp; Spa</a></li>
                      <li className="nav item"><a href="https://hasaki.vn/cam-nang.html" className="txt_link_hasaki">Hasaki cẩm nang</a></li>
                    </ul>
                    <ul className="footer links">
                      <li>
                        <h4 className="tt_footer text-uppercase">Tải ứng dụng</h4>
                      </li>
                      <li>
                        <div className="block_down_app_footer width_common">
                          <div className="thumb_qr_code">
                            <img src="/images/graphics/QRCode_App.png" className="loading" data-was-processed="true" alt="" />
                          </div>
                          <div className="block_down_app_sub">
                            <a href="https://itunes.apple.com/us/app/hasaki-vn/id1173985273?ls=1&amp;mt=8" className="item_download_app">
                              <img src="/images/graphics/img_app_store.jpg" alt="" className="loading" data-was-processed="true" />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=vn.hasaki.buyer" className="item_download_app">
                              <img src="/images/graphics/img_google_play.jpg" alt="" className="loading" data-was-processed="true" />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ clear: 'both' }}></div>
      </footer>
      <div id="modal-call" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog margin-top" role="document">
          <div className="modal-content width-modal-contact">
            <div className="modal-header">
              <h6 className="modal-title">
                <b>Vui lòng để lại số điện thoại, chúng tôi sẽ gọi lại ngay sau ít phút.</b>
              </h6>
            </div>
            <div className="modal-body">
              <div className="input-phone">
                <div>
                  <span className="mr-2 ml-2">
                    <i className="fa fa-phone fa-lg" style={{ color: '#7ec72b' }} aria-hidden="true"></i>
                  </span>
                </div>
                <div className="input-field">
                  <input type="number" id="phone" className="form-control border-0" placeholder="Số điện thoại của bạn" required />
                </div>
                <div className="btn-contact">
                  <div className="float-right">
                    <button className="btn btn-danger" id="btn-contact-call">Yêu cầu gọi lại</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal_footer">
              <div className="list-phone">
                <h6>Hoặc liên hệ với chúng tôi theo hotline:</h6>
                <div className="phone-info">
                  <div className="hotline">
                    <span className="mr-2 ml-2">
                      <i className="fa fa-phone-square fa-lg" style={{ color: '#7ec72b' }} aria-hidden="true"></i>
                    </span>
                    <span className="aml-region aml-line-clamp-1">Hỗ trợ khách hàng: <strong>1800 6324</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modal-sms" className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog margin-top" role="document">
          <div className="modal-content" style={{ background: '#f5f6fa' }}>
            <div className="modal-header">
              <div className="w-100">
                <h5 className="modal-title text-center text-bold">Để lại lời nhắn cho chúng tôi</h5>
              </div>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form id="form-contact-sms">
                <div className="form-group">
                  <input type="text" name="sms_name" className="form-control" id="recipient-name" placeholder="Họ và tên" required />
                </div>
                <div className="form-group">
                  <input type="number" name="sms_phone" className="form-control" id="recipient-phone" placeholder="Số điện thoại của bạn" required />
                </div>
                <div className="form-group">
                  <input type="email" name="sms_email" className="form-control" id="recipient-email" placeholder="Email của bạn" required />
                </div>
                <div className="form-group">
                  <textarea className="form-control" name="sms_message" id="recipient-message" placeholder="Để lại lời nhắn cho chúng tôi" rows="6" required></textarea>
                </div>
              </form>
            </div>
            <div className="modal_footer">
              <center>
                <button type="button" id="btn-contact-sms" className="btn btn-primary w-100">Gửi ngay</button>
              </center>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="modal-success" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog margin-top" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div style={{ display: 'inline-block' }}>
                  <img src="images/graphics/icon-check.svg.png" width="55" alt="Success Icon" />
                </div>
              </div>
              <div className="text-center">
                <div className="mt-4" style={{ display: 'inline-block' }}>
                  <h5><b>Gửi yêu cầu thành công</b></h5>
                </div>
              </div>
              <div className="text-center">
                <div className="mt-2" style={{ display: 'inline-block' }}>
                  <p>Cảm ơn bạn đã để lại thông tin. Chúng tôi sẽ gọi lại trong thời gian sớm nhất.</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="loading" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content bg-crytal">
            <div className="modal-body">
              <div className="row">
                <div className="col"></div>
                <div className="col">
                  <img src="../images/graphics/loadingpage.gif" alt="Loading" />
                </div>
                <div className="col"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mask_menu"></div>
      <a href="javascript:;" id="hamber_menu" className="hidden-lg hidden-md">
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
      </a>
      <section id="menu_mobile">
        <div className="btn_close_menu_mobile">
          <img src="https://hasaki.vn/wap-static/images/graphics/img_back_menu.png" alt="Close Menu" />
        </div>
        <div className="scroll_menu relative">
          <div className="info_login width_common shadow_block">
            <img src="https://hasaki.vn/wap-static/images/graphics/avata.svg" alt="Avatar" />
            <span className="txt_fff">
              <a href="https://hasaki.vn/customer/account/login/">Thông tin tài khoản</a>
            </span>
          </div>
          <div className="list_main_menu width_common shadow_block">
            <a href="/tai-khoan.html" className="item_main_menu"><span className="icon_menu_web icon_1"></span> Tài khoản</a>
            <a href="/dat-hang-tai-hasaki.html" className="item_main_menu active"><span className="icon_menu_web icon_8"></span> Đặt hàng</a>
            <a href="/quy-cach-dong-goi.html" className="item_main_menu active"><span className="icon_menu_web icon_2"></span>Quy cách đóng gói</a>
            <a href="/van-chuyen-2h.html" className="item_main_menu"><span className="icon_menu_web icon_3"></span> Vận chuyển 2H</a>
            <a href="/phi-van-chuyen.html" className="item_main_menu"><span className="icon_menu_web icon_4"></span> Phí vận chuyển</a>
            <a href="/chinh-sach-bao-hanh-havatek.html" className="item_main_menu"><span className="icon_menu_web" style={{ backgroundImage: 'url(files/icon_warranty_v3.svg)' }}></span>Chính sách bảo hành Havatek</a>
            <a href="/doi-tra-hoan-tien.html" className="item_main_menu"><span className="icon_menu_web icon_5"></span>Đổi trả, hoàn tiền</a>
            <a href="/dich-vu-spa.html" className="item_main_menu"><span className="icon_menu_web icon_6"></span> Dịch vụ SPA</a>
            <a href="/viec-lam.html" className="item_main_menu"><span className="icon_menu_web icon_7"></span>Tuyển dụng</a>
          </div>
          <div className="list_main_menu width_common shadow_block">
            <div className="width_common title_hotro_menu txt_16"><strong>Thông tin hỗ trợ</strong></div>
            <a href="/gioi-thieu-hasaki.html" className="item_main_menu dot_line">Giới thiệu Hasaki</a>
            <a href="/lien-he.html" className="item_main_menu dot_line">Liên hệ</a>
            <a href="/he-thong-cua-hang.html" className="item_main_menu dot_line">Hệ thống cửa hàng Hasaki trên toàn quốc</a>
            <a href="/huong-dan-nhan-biet-kenh-chinh-thuc-cua-hasaki.html" className="item_main_menu dot_line">Các kênh chính thức của Hasaki</a>
            <a href="/huong-dan-dat-hang.html" className="item_main_menu dot_line">Hướng dẫn đặt hàng</a>
            <a href="/huong-dan-dat-hang-2h.html" className="item_main_menu dot_line">Hướng dẫn đặt hàng 2H</a>
            <a href="/huong-dan-thanh-toan-truc-tuyen-vnpay.html" className="item_main_menu dot_line">Phương thức thanh toán</a>
            <a href="/quy-trinh-giao-hang.html" className="item_main_menu dot_line">Chính sách vận chuyển giao nhận</a>
            <a href="/tri-an-khach-hang.html" className="item_main_menu dot_line">Chương trình tích điểm</a>
            <a href="/huong-dan-doi-qua.html" className="item_main_menu dot_line">Hướng dẫn đổi điểm lấy quà</a>
            <a href="/chuong-trinh-tang-qua-tri-an-khach-hang-tu-hasaki.html" className="item_main_menu dot_line">Chương trình quà tặng tri ân khách hàng</a>
            <a href="/the-qua-tang-mobile-gift.html" className="item_main_menu dot_line">Thẻ quà tặng Got It</a>
            <a href="/phieu-mua-hang.html" className="item_main_menu dot_line">Phiếu mua hàng Hasaki</a>
            <a href="/app" className="item_main_menu dot_line">Hướng dẫn tải &amp; sử dụng App Hasaki</a>
            <a href="/dieu-khoan-su-dung.html" className="item_main_menu dot_line">Điều khoản sử dụng</a>
            <a href="/chinh-sach-bao-mat.html" className="item_main_menu dot_line">Chính sách bảo mật</a>
            <a href="/chinh-sach-cookie.html" className="item_main_menu dot_line">Chính sách Cookie</a>
            <a href="/chinh-sach-khach-hang-clinic.html" className="item_main_menu dot_line">Chính sách khách hàng Clinic</a>
            <a href="/quy-dinh-giao-dich-chung.html" className="item_main_menu dot_line">Quy định giao dịch chung</a>
            <a href="/canh-bao-lua-dao.html" className="item_main_menu dot_line">Cảnh báo lừa đảo</a>
          </div>
          <div className="list_main_menu width_common shadow_block">
            <div className="item_main_menu">
              <img src="images/graphics/icon_menu_13.svg" className="icon_menu" alt="App Icon" />
              Tải App Hasaki.vn
              <ul style={{ listStyle: 'none', marginBottom: 0 }}>
                <li>
                  <a href="https://itunes.apple.com/us/app/hasaki-vn/id1173985273?ls=1&amp;mt=8">
                    <img src="images/graphics/icon_apple.png" alt="Apple Store" style={{ height: '20px' }} />
                  </a>
                </li>
                <li>
                  <a href="https://play.google.com/store/apps/details?id=vn.hasaki.buyer" className="item_download_app">
                    <img src="images/graphics/icon_google_play.png" alt="Google Play" style={{ height: '20px' }} />
                  </a>
                </li>
              </ul>
            </div>
            <a href="#" className="item_main_menu">
              <img src="images/graphics/icon_menu_14.svg" className="icon_menu" alt="Hotline Icon" />
              Hotline: <b className="txt_color_1">1800 6324</b>
            </a>
          </div>
        </div>
      </section>

      <div className="block_info_address_menu width_common">
        <div className="txt_12 space_bottom_5">
          Công Ty TNHH <b className="txt_14">HASAKI BEAUTY &amp; S.P.A</b>
        </div>
      </div>
    </div>
  );
};

export default SupportComponent;
