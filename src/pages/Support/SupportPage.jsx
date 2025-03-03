import React from 'react';
import styles from './SupportPage.module.scss';
import { FaTimes } from "react-icons/fa";
import logo from '~/assets/beautySkin1.png';

const SupportPage = () => {
  return (
    <div id="support_center" className={styles.support_center}>
      <header className={`${styles.width_common} ${styles.wrapper_header}`}>
        <div className={styles.container}>
          <div className={`${styles.logo_support} ${styles.left}`}>
            <a href="/">
              <img src={logo} alt="Beauty Skin Logo" />
            </a>
          </div>
        </div>
      </header>


      <main id="maincontent" className={`${styles.page_main} ${styles.width_common}`}>
        <div id="block_banner_page" className={styles.width_common}>
          <div className={styles.container}>
            <div className={`${styles.block_banner_support} ${styles.width_common}`}>
              <h1 className={`${styles.slogan} ${styles.text_center}`}>
                Xin chào! Chúng tôi có thể giúp gì cho bạn?
              </h1>
              <div className={styles.mt_2}>
                <div className={styles.block_sub_info}>
                  <div className={styles.flex_center}>
                    <div className={styles.box_kn}>
                      <span>
                        <img src="src/assets/icon_block_search_02.svg" alt="" />
                        <a href="tel:1800 6324" className={`${styles.text_white} ${styles.font_weight_bold}`}>
                          1800 6324
                        </a>
                      </span>
                      <span className={`${styles.badge} ${styles.badge_secondary} ${styles.badge_custom}`}>(Miễn phí)</span>
                    </div>
                    <div className={styles.box_chat}>
                      <span className={`${styles.item_sub_chat} ${styles.font_weight_bold}`}>
                        <img src="src/assets/icon_block_search_03.svg" alt="" />
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
          <div className={`${styles.block_slogan_logo} ${styles.width_common} ${styles.space_bottom_20}`}>
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
                  <a href="https://www.kieuminhtri.site/tuyendung">&nbsp;</a>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.block_cau_hoi_thuong_gap} ${styles.width_common}`}>
            <h1 className={`${styles.title_block_cauhoi} ${styles.width_common}`}>Câu hỏi thường gặp</h1>
            <div className={`${styles.list_cauhoi} ${styles.width_common}`}>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_dang_ky_thanh_vien_hasaki">Đăng ký thành viên Beauty Skin như thế nào?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_co_can_dat_lich_truoc">Có cần đặt lịch trước khi đến spa hay không?</a></div>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_tai_sao_khong_dang_nhap_duoc_tk">Tại sao tôi không thể đăng nhập vào tài khoản của tôi?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_co_can_dat_lich_truoc">Đặt dịch vụ như thế nào?</a></div>
              <div className={styles.item_cau_hoi}><a href="/tai-khoan.html#div_su_dung_chung_tk">Tôi có thể sử dụng chung tài khoản với người khác không?</a></div>
              <div className={styles.item_cau_hoi}><a href="/dich-vu-spa.html#div_kham_da">Khám da tại spa Beauty Skin có tốn phí hay không?</a></div>
            </div>
          </div>
          <div className={`${styles.block_thongtin_hotro} ${styles.width_common}`}>
            <h1 className={`${styles.title_block_cauhoi} ${styles.width_common}`}>Thông tin hỗ trợ</h1>
            <div className={`${styles.list_cauhoi} ${styles.width_common}`}>
              <div className={styles.item_main_menu}><a href="/gioi-thieu-hasaki.html">Giới thiệu Beauty Skin</a></div>
              <div className={styles.item_main_menu}><a href="/lien-he.html">Liên hệ</a></div>
              <div className={styles.item_main_menu}><a href="/he-thong-cua-hang.html">Hệ thống cửa hàng Beauty Skin trên toàn quốc</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-nhan-biet-kenh-chinh-thuc-cua-hasaki.html">Các kênh chính thức của Beauty Skin</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-dat-hang.html">Hướng dẫn đặt hàng</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-dat-hang-2h.html">Hướng dẫn đặt hàng 2H</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-thanh-toan-truc-tuyen-vnpay.html">Phương thức thanh toán</a></div>
              <div className={styles.item_main_menu}><a href="/quy-trinh-giao-hang.html">Chính sách vận chuyển giao nhận</a></div>
              <div className={styles.item_main_menu}><a href="/tri-an-khach-hang.html">Chương trình tích điểm</a></div>
              <div className={styles.item_main_menu}><a href="/huong-dan-doi-qua.html">Hướng dẫn đổi điểm lấy quà</a></div>
              <div className={styles.item_main_menu}><a href="/chuong-trinh-tang-qua-tri-an-khach-hang-tu-hasaki.html">Chương trình quà tặng tri ân khách hàng</a></div>
              <div className={styles.item_main_menu}><a href="/the-qua-tang-mobile-gift.html">Thẻ quà tặng Got It</a></div>
              <div className={styles.item_main_menu}><a href="/phieu-mua-hang.html">Phiếu mua hàng Beauty Skin</a></div>
              <div className={styles.item_main_menu}><a href="/app">Hướng dẫn tải &amp; sử dụng App Beauty Skin</a></div>
              <div className={styles.item_main_menu}><a href="/dieu-khoan-su-dung.html">Điều khoản sử dụng</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-bao-mat.html">Chính sách bảo mật</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-cookie.html">Chính sách Cookie</a></div>
              <div className={styles.item_main_menu}><a href="/chinh-sach-khach-hang-clinic.html">Chính sách khách hàng Clinic</a></div>
              <div className={styles.item_main_menu}><a href="/quy-dinh-giao-dich-chung.html">Quy định giao dịch chung</a></div>
              <div className={styles.item_main_menu}><a href="/lich-hoat-dong-cua-hang-hasaki-tet-nguyen-dan-2025.html">Cảnh báo mạo danh Beauty Skin để lừa đảo</a></div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.page_footer}>
        <div className={styles.container}>
          <div className={`${styles.main_footer} ${styles.width_common}`}>
            <div className={`${styles.row} ${styles.space_bottom_20}`}>
              <div className={`${styles.col_lg_4} ${styles.col_md_4} ${styles.col_sm_12}`}>
                <div
                  className={`fb_page ${styles.fb_page}`}
                  data-href="https://www.facebook.com/Hasaki.vn/"
                  data-small-header="true"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
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
                <div className={styles.block_chat_fb}>
                  <a href="javascript:;" className={styles.btn_close_chat}><FaTimes className={styles.icon_close} /></a>
                  <div id="hsk-chat-root" style={{ position: 'fixed', right: '40px', bottom: '25px', width: '85px', zIndex: 100 }}>
                    <div id="main_chat_container" className={styles._container_uysnc_16} style={{ transform: 'translateX(100vw)', aspectRatio: '5 / 4' }}></div>
                    <img className={styles._icon_1lugr_47} src="https://wsc.hasaki.vn/assets/customer_icons/appIcon.svg" width="60px" height="60px" alt="" />
                  </div>
                  <div className={`${styles.fb_page} ${styles.fb_iframe_widget}`} data-href="https://www.facebook.com/Hasaki.vn/" data-tabs="messages" data-width="270px" data-height="320" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" show-facepile="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="adapt_container_width=true&amp;app_id=1028207553936734&amp;container_width=230&amp;height=320&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=messages&amp;width=270px">
                    <span style={{ verticalAlign: 'bottom', width: '230px', height: '320px' }}>
                      <iframe name="f3c2e2cff21f9ed4a" height="320px" data-testid="fb:page Facebook Social Plugin" title="fb:page Facebook Social Plugin" frameBorder="0" allowTransparency="true" allowFullScreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.9/plugins/page.php?adapt_container_width=true&amp;app_id=1028207553936734&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df4531a895a1b930ff%26domain%3Dhotro.hasaki.vn%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fhotro.hasaki.vn%252Ff9828894e0010d3e2%26relation%3Dparent.parent&amp;container_width=230&amp;height=320&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FHasaki.vn%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=messages&amp;width=270px" style={{ border: 'none', visibility: 'visible', width: '230px', height: '320px' }}></iframe>
                    </span>
                  </div>
                </div>

              </div>
              <div className={`${styles.col_lg_8} ${styles.col_md_8} ${styles.col_sm_12}`}>
                <div className={styles.row}>
                  <div className={`${styles.col_lg_4} ${styles.col_md_4} ${styles.col_sm_4}`}>
                    <ul className={`${styles.footer} ${styles.links}`}>
                      <li>
                        <h4 className={`${styles.tt_footer} ${styles.text_uppercase}`}>Hỗ trợ khách hàng</h4>
                      </li>
                      <li>
                        <div>
                          <a href="tel:1800 6324">
                            <span className={styles.txt_color_2}>Hotline: 1800 6324&nbsp;(miễn phí)</span>
                          </a>
                        </div>
                        <div>
                          <span className={styles.txt_color_2}>
                            Mỹ phẩm: 08:00 - 22:00
                          </span>
                        </div>
                        <div>
                          <span className={styles.txt_color_2}>
                            Clinic &amp; Spa: 09:00 - 20:00
                          </span>
                        </div>
                      </li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/tai-khoan.html" className={styles.txt_link_hasaki}>Các câu hỏi thường gặp</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="https://hasaki.vn/lien-he" className={styles.txt_link_hasaki}>Gửi yêu cầu hỗ trợ</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/huong-dan-dat-hang.html" className={styles.txt_link_hasaki}>Hướng dẫn đặt hàng</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/phi-van-chuyen.html" className={styles.txt_link_hasaki}>Phương thức vận chuyển</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/doi-tra-hoan-tien.html" className={styles.txt_link_hasaki}>Chính sách đổi trả</a></li>
                    </ul>
                  </div>
                  <div className={`${styles.col_lg_3} ${styles.col_md_3} ${styles.col_sm_3}`}>
                    <ul className={`${styles.footer} ${styles.links}`}>
                      <li>
                        <h4 className={`${styles.tt_footer} ${styles.text_uppercase}`}>Về hasaki.vn</h4>
                      </li>
                      <li className={`${styles.nav} ${styles.item}`}>
                        <a href="/phieu-mua-hang.html" className={styles.txtLinkHasaki}>Phiếu mua hàng</a>
                      </li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/gioi-thieu-hasaki.html" className={styles.txt_link_hasaki}>Giới thiệu Beauty Skin.vn</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/viec-lam.html" className={styles.txt_link_hasaki}>Tuyển dụng</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/chinh-sach-bao-mat.html" className={styles.txt_link_hasaki}>Chính sách bảo mật</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/dieu-khoan-su-dung.html" className={styles.txt_link_hasaki}>Điều khoản sử dụng</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/lien-he.html" className={styles.txt_link_hasaki}>Liên hệ</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="/he-thong-cua-hang.html" className={styles.txt_link_hasaki}>Vị trí cửa hàng</a></li>
                    </ul>
                  </div>
                  <div className={`${styles.col_lg_5} ${styles.col_md_5} ${styles.col_sm_5}`}>
                    <ul className={`${styles.footer} ${styles.links}`}>
                      <li>
                        <h4 className={`${styles.tt_footer} ${styles.text_uppercase}`}>Hợp tác &amp; Liên kết</h4>
                      </li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="https://hasaki.vn/spa.html" className={styles.txt_link_hasaki}>Beauty Skin Clinic &amp; Spa</a></li>
                      <li className={`${styles.nav} ${styles.item}`}><a href="https://hasaki.vn/cam-nang.html" className={styles.txt_link_hasaki}>Beauty Skin cẩm nang</a></li>
                    </ul>
                    <ul className={`${styles.footer} ${styles.links}`}>
                      <li>
                        <h4 className={`${styles.tt_footer} ${styles.text_uppercase}`}>Tải ứng dụng</h4>
                      </li>
                      <li>
                        <div className={`${styles.block_down_app_footer} ${styles.width_common}`}>
                          <div className={styles.thumb_qr_code}>
                            <img src="src/assets/graphics/QRCode_App.png" className={styles.loading} data-was-processed="true" alt="" />
                          </div>
                          <div className={styles.block_down_app_sub}>
                            <a href="https://itunes.apple.com/us/app/hasaki-vn/id1173985273?ls=1&amp;mt=8" className={styles.item_download_app}>
                              <img src="src\assets\graphics\img_app_store.jpg" alt="" className={styles.loading} data-was-processed="true" />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=vn.hasaki.buyer" className={styles.item_download_app}>
                              <img src="src\assets\graphics\img_google_play.jpg" alt="" className={styles.loading} data-was-processed="true" />
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

    </div>
  );
};

export default SupportPage;
