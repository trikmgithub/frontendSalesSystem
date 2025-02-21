import React, { useState } from "react";
import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/beautySkin.png';
import zalo from '~/assets/zalo.png';
import momo from '~/assets/momo.png';

const cx = classNames.bind(styles);

const Payment = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [tempSelectedPayment, setTempSelectedPayment] = useState('cod');

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
        <img src={logo} alt="Logo" className={cx('logo')} />
        <h2>Thanh toán</h2>
      </div>

      <div className={cx('payment-content')}>
        {/* Left Section */}
        <div className={cx('payment-left')}>
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
        </div>

        {/* Right Section */}
        <div className={cx('payment-right')}>
          <button className={cx('order-button')}>Đặt hàng</button>

          {/* Order Summary */}
          <div className={cx('order-summary')}>
            <h3>Đơn hàng</h3>
            <div className={cx('summary-item')}>
              <span>Tạm tính (1)</span>
              <span>822.000 đ</span>
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
              <span className={cx('total-price')}>822.000 đ</span>
            </div>
          </div>

          <p className={cx('note')}>
            Đã bao gồm VAT, phí đóng gói, phí vận chuyển và các chi phí khác vui lòng xem{" "}
            <a href="#">Chính sách vận chuyển</a>
          </p>
        </div>
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