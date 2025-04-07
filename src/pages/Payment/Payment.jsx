import React, { useContext, useState, useEffect } from "react";
import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/beautySkin.png';
import { Link } from 'react-router-dom';
import routes from '~/config/routes'
import { CartContext } from "~/context/CartContext";
import { useNavigate } from "react-router-dom";
import { payosPayAxios } from "~/services/paymentAxios";
import { updateAddressAxios, getUserByIdAxios, updatePhoneAxios } from "~/services/userAxios";
import { createCartAxios } from "~/services/cartAxios";
import AddressSelector from '~/components/AddressSelector';
import { X } from 'lucide-react';

const cx = classNames.bind(styles);

const Payment = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false); // Modal số điện thoại
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

  // Phone state
  const [phone, setPhone] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Address modal state (simplified with AddressSelector)
  const [addressData, setAddressData] = useState({
    region: "",
    district: "",
    ward: "",
    formattedAddress: ""
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

        // Set phone number
        if (userData && userData.phone) {
          setPhone(userData.phone);
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
            if (response.data.user.phone) {
              setPhone(response.data.user.phone);
            }
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
      setError("Vui lòng thêm địa chỉ giao hàng trước khi tiếp tục");
      return;
    }

    if (!phone) {
      setError("Vui lòng cập nhật số điện thoại trước khi tiếp tục");
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
  };

  const togglePaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
    setTempSelectedPayment(selectedPayment); // Set temporary state to current selected payment
  };

  // Toggle phone update modal
  const togglePhoneModal = () => {
    setShowPhoneModal(!showPhoneModal);
    setTempPhone(phone); // Initialize temp phone with current phone
    setPhoneError("");
  };

  const selectPaymentMethod = (method) => {
    setTempSelectedPayment(method); // Update temporary state
  };

  const confirmPaymentMethod = () => {
    setSelectedPayment(tempSelectedPayment); // Update main state
    setShowPaymentModal(false); // Close modal
  };

  // Validate phone number - updated for 10 digits
  const validatePhoneNumber = (phone) => {
    if (!phone) {
      return { isValid: false, message: 'Vui lòng nhập số điện thoại' };
    }
    
    // Check for exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: 'Vui lòng nhập số điện thoại đúng 10 chữ số' };
    }
    
    return { isValid: true, message: '' };
  };

  // Handle phone number change
  const handlePhoneChange = (e) => {
    // Allow only digits
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTempPhone(value);
    setPhoneError(''); // Clear error when typing
  };

  // Update phone number
  const updatePhone = async () => {
    const validation = validatePhoneNumber(tempPhone);
    if (!validation.isValid) {
      setPhoneError(validation.message);
      return;
    }

    setIsUpdatingPhone(true);
    setPhoneError('');

    try {
      const response = await updatePhoneAxios({ phone: tempPhone });
      
      if (response && response.error) {
        throw new Error(response.message || "Không thể cập nhật số điện thoại");
      }
      
      // Update localStorage
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.phone = tempPhone;
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        console.error("Error updating localStorage:", err);
      }
      
      // Update state
      setPhone(tempPhone);
      
      // Close modal
      setShowPhoneModal(false);
    } catch (error) {
      console.error("Error updating phone:", error);
      setPhoneError(error.message || "Không thể cập nhật số điện thoại. Vui lòng thử lại.");
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  // Handle address changes from the AddressSelector component
  const handleAddressChange = (newAddressData) => {
    setAddressData(newAddressData);
  };

  const handleSaveAddress = async () => {
    if (!addressData.formattedAddress) {
      // Show some error that address is incomplete
      return;
    }

    setIsAddressUpdating(true);

    try {
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
          address: addressData.formattedAddress
        });

        console.log("Address updated successfully via API");

        userData.address = addressData.formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));

        // Update local state for UI
        setUserAddress(addressData.formattedAddress);

      } catch (apiError) {
        console.error("API address update failed:", apiError);

        // Even if API fails, update in localStorage as fallback
        userData.address = addressData.formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));

        console.log("Address updated in localStorage as fallback");

        // Update local state for UI
        setUserAddress(addressData.formattedAddress);
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

              {/* Phone Number Section - NEW */}
              <div className={cx('section')}>
                <h3>📱 Số điện thoại</h3>
                <div className={cx('phone-box')}>
                  <span className={cx('phone-number')}>{phone || 'Chưa có số điện thoại'}</span>
                  <a href="#" onClick={togglePhoneModal}>
                    {phone ? 'Thay đổi' : 'Thêm số điện thoại'}
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
                disabled={!userAddress || !phone || loading}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
              {!userAddress && (
                <p className={cx('address-required-message')}>
                  Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
                </p>
              )}
              {!phone && (
                <p className={cx('address-required-message')}>
                  Vui lòng cập nhật số điện thoại để tiếp tục đặt hàng
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

      {/* Phone Modal - NEW */}
      {showPhoneModal && (
        <div className={cx('modal-overlay')} onClick={togglePhoneModal}>
          <div className={cx('phone-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h3>Cập nhật số điện thoại</h3>
              <button className={cx('close-button')} onClick={togglePhoneModal}>×</button>
            </div>

            <div className={cx('phone-form')}>
              <div className={cx('form-group')}>
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={handlePhoneChange}
                  placeholder="Nhập số điện thoại 10 chữ số"
                  className={cx({ 'error': phoneError })}
                  maxLength={10}
                />
                {phoneError && <div className={cx('error-message')}>{phoneError}</div>}
              </div>
            </div>

            <div className={cx('modal-actions')}>
              <div className={cx('modal-buttons')}>
                <button className={cx('cancel-btn')} onClick={togglePhoneModal}>Hủy</button>
                <button
                  className={cx('confirm-btn')}
                  onClick={updatePhone}
                  disabled={isUpdatingPhone}
                >
                  {isUpdatingPhone ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal - Refactored to use AddressSelector */}
      {showAddressModal && (
        <div className={cx('modal-overlay')} onClick={toggleAddressModal}>
          <div className={cx('address-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h3>Địa chỉ nhận hàng</h3>
              <button className={cx('close-button')} onClick={toggleAddressModal}>×</button>
            </div>

            <div className={cx('address-form')}>
              <AddressSelector 
                initialAddress={userAddress} 
                onAddressChange={handleAddressChange}
              />
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