import React, { useContext, useState } from "react";
import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/beautySkin.png';
import zalo from '~/assets/zalo.png';
import momo from '~/assets/momo.png';
import { Link } from 'react-router-dom';
import routes from '~/config/routes'
import productImg from '~/assets/product1.png';
import { CartContext } from "~/context/CartContext";
// import { momoPayAxios, zaloPayAxios } from "~/services/paymentAxios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Payment = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [tempSelectedPayment, setTempSelectedPayment] = useState('cod');
  const { cartItems } = useContext(CartContext);
  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  const navigate = useNavigate();

  // ✅ Handle All Payment Success
  const handlePayment = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      navigate(routes.home);
    }, 5000); // Redirect to homepage after 3 seconds
  };

  // // ✅ Function to Handle Payment
  // const handlePayment = async () => {
  //   try {
  //     if (selectedPayment === 'momo') {
  //       await momoPayAxios({ totalAmount: calculateTotal() }); // Call Momo API
  //     } else if (selectedPayment === 'zalopay') {
  //       await zaloPayAxios({ totalAmount: calculateTotal() }); // Call ZaloPay API
  //     } else {
  //       alert("Đơn hàng đã được đặt thành công!");
  //     }
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //   }
  // };

  const toggleAddressModal = () => {
    setShowAddressModal(!showAddressModal);
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
      case 'zalopay':
        return <img src={zalo} alt="ZaloPay" className={cx('payment-icon')} />;
      case 'momo':
        return <img src={momo} alt="Momo" className={cx('payment-icon')} />;
      default:
        return '💵';
    }
  };

  const getPaymentLabel = () => {
    switch (selectedPayment) {
      case 'zalopay':
        return 'Thanh toán bằng ZaloPay';
      case 'momo':
        return 'Thanh toán bằng Momo';
      default:
        return 'Thanh toán khi nhận hàng (COD)';
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
                  <span className={cx('tag')}>🏠 Nhà riêng</span>
                  <strong>Hans Nguyen - 0386123599</strong>
                  <p>Hải sản thiên lý, Phường Đông Hưng Thuận, Quận 12, Hồ Chí Minh</p>
                  <a href="#" onClick={toggleAddressModal}>Thay đổi</a>
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
              <div className={cx('section')}>
                <h3>🛒 Thông tin kiện hàng</h3>
                {cartItems.map((item) => (
                  <div key={item._id} className={cx("order-item")}>
                    <img src={productImg} alt={item.name} className={cx("product-image")} />
                    <div className={cx("item-details")}>
                      <strong className={cx("product-name")}>{item.name}</strong>
                      <p className={cx("product-description")}>{item.description}</p>
                    </div>
                    <div className={cx("item-price")}>
                      <span className={cx("quantity")}>{item.quantity} x</span>
                      <span className={cx("price")}>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        {!showSuccessMessage && (
          <>
            <div className={cx('payment-right')}>

              <button className={cx('order-button')} onClick={handlePayment}>Đặt hàng</button>
              <p className={cx('order-agreement')}>
                Nhấn "Đặt hàng" đồng nghĩa việc bạn đồng ý tuân theo
                <a href="#"> Chính sách xử lý dữ liệu cá nhân </a> &
                <a href="#"> Điều khoản Hasaki</a>
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

            <div className={cx('address-selection')}>
              <div className={cx('address-option', 'selected')}>
                <div className={cx('radio-container')}>
                  <input type="radio" id="address1" name="address" defaultChecked />
                  <label htmlFor="address1"></label>
                </div>
                <div className={cx('address-details')}>
                  <div className={cx('name-actions')}>
                    <h4>Hans Nguyen - 0386123599</h4>
                    <div className={cx('action-buttons')}>
                      <button className={cx('delete-btn')}><i className={cx('trash-icon')}></i></button>
                      <button className={cx('edit-btn')}>Sửa</button>
                    </div>
                  </div>
                  <p>Hải sản thiên lý, Phường Đông Hưng Thuận, Quận 12, Hồ Chí Minh</p>
                  <div className={cx('address-tags')}>
                    <span className={cx('address-tag', 'home')}>Nhà riêng</span>
                    <span className={cx('address-tag', 'default')}>Địa chỉ mặc định</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('modal-actions')}>
              <div className={cx('add-address-btn')}>
                <button>Thêm địa chỉ mới <span>+</span></button>
              </div>
              <div className={cx('modal-buttons')}>
                <button className={cx('cancel-btn')} onClick={toggleAddressModal}>Hủy</button>
                <button className={cx('confirm-btn')}>Tiếp tục</button>
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

              {/* ZaloPay Option */}
              <div
                className={cx('payment-option', { 'selected': tempSelectedPayment === 'zalopay' })}
                onClick={() => selectPaymentMethod('zalopay')}
              >
                <div className={cx('radio-container')}>
                  <input
                    type="radio"
                    id="pay-zalopay"
                    name="payment-method"
                    checked={tempSelectedPayment === 'zalopay'}
                    onChange={() => selectPaymentMethod('zalopay')}
                  />
                  <label htmlFor="pay-zalopay"></label>
                </div>
                <div className={cx('payment-icon')}>
                  <img src={zalo} alt="ZaloPay" className={cx('wallet-icon')} />
                </div>
                <div className={cx('payment-details')}>
                  <h4>Thanh toán bằng ZaloPay</h4>
                  <p>Thanh toán an toàn qua ví điện tử ZaloPay</p>
                </div>
              </div>

              {/* Momo Option */}
              <div
                className={cx('payment-option', { 'selected': tempSelectedPayment === 'momo' })}
                onClick={() => selectPaymentMethod('momo')}
              >
                <div className={cx('radio-container')}>
                  <input
                    type="radio"
                    id="pay-momo"
                    name="payment-method"
                    checked={tempSelectedPayment === 'momo'}
                    onChange={() => selectPaymentMethod('momo')}
                  />
                  <label htmlFor="pay-momo"></label>
                </div>
                <div className={cx('payment-icon')}>
                  <img src={momo} alt="Momo" className={cx('wallet-icon')} />
                </div>
                <div className={cx('payment-details')}>
                  <h4>Thanh toán bằng Momo</h4>
                  <p>Thanh toán an toàn qua ví điện tử Momo</p>
                </div>
              </div>
            </div>
            <div className={cx('modal-actions')}>
              <div className={cx('modal-buttons')}>
                <button className={cx('cancel-btn')} onClick={togglePaymentModal}>Hủy</button>
                <button
                  className={cx('confirm-btn')}
                  onClick={confirmPaymentMethod} // Confirm the selected payment method
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