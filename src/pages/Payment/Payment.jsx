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

const cx = classNames.bind(styles);

// Location data for address dropdowns
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

  // User address state
  const [userAddress, setUserAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // ✅ Handle All Payment Success
  const handlePayment = async () => {
    if (selectedPayment === "bank") {
      try {
        // Call the PayOS API with cart items and total amount
        await payosPayAxios(cartItems, calculateTotal());
        // The redirect happens in the payosPayAxios function
      } catch (error) {
        console.error("Bank Transfer Payment Error:", error);
        alert("Không thể kết nối với cổng thanh toán. Vui lòng thử lại.");
      }
    } else {
      // COD flow remains unchanged
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate(routes.home);
      }, 3000);
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

        // Even if API fails, update in localStorage as a fallback
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
                disabled={!userAddress}
              >
                Đặt hàng
              </button>
              {!userAddress && (
                <p className={cx('address-required-message')}>
                  Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
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
                <div className={cx('payment-icon')}>🏦</div>
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