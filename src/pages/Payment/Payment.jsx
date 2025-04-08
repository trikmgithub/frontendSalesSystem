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
import { createCartAxios, createCartForOtherAxios } from "~/services/cartAxios";
import AddressSelector from '~/components/AddressSelector';
import { X, MessageSquare } from 'lucide-react';

const cx = classNames.bind(styles);

const Payment = () => {
  // Existing states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [tempSelectedPayment, setTempSelectedPayment] = useState('cod');
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User address and phone states
  const [userAddress, setUserAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [phone, setPhone] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Address state
  const [addressData, setAddressData] = useState({
    region: "",
    district: "",
    ward: "",
    formattedAddress: ""
  });
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);

  // New states for order mode
  const [orderForOther, setOrderForOther] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    email: "",
    address: "", // This will store the formatted address string
    phone: "",
    // Add new address data structure
    addressData: {
      region: "",
      district: "",
      ward: "",
      streetAddress: "",
      formattedAddress: ""
    }
  });
  const [orderNote, setOrderNote] = useState(""); // Order note available for both modes
  const [recipientErrors, setRecipientErrors] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  // Format price functions and other utility functions (unchanged)
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.isOnSale && item.discountedPrice ?
        (item.price) :
        (item.price);
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.isOnSale && item.discountedPrice) {
        const discount = (item.price - item.discountedPrice) * item.quantity;
        return total + discount;
      }
      return total;
    }, 0);
  };

  const getFinalTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceToUse = item.isOnSale && item.discountedPrice ?
        item.discountedPrice :
        item.price;
      return total + (priceToUse * item.quantity);
    }, 0);
  };

  // Fetch user data when component mounts (unchanged)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        if (userData && userData._id) {
          setUserId(userData._id);
        }

        if (userData && userData.phone) {
          setPhone(userData.phone);
        }

        if (userData && userData.address) {
          setUserAddress(userData.address);
          setIsLoading(false);
          return;
        }

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

  // Handle recipient field changes
  const handleRecipientChange = (e) => {
    const { name, value } = e.target;
    setRecipientInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (recipientErrors[name]) {
      setRecipientErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Update the validateRecipientInfo function
  const validateRecipientInfo = () => {
    const errors = {};

    if (!recipientInfo.name.trim()) {
      errors.name = "Vui lòng nhập tên người nhận";
    }

    if (!recipientInfo.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ người nhận";
    }

    if (!recipientInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại người nhận";
    } else if (!/^\d{10}$/.test(recipientInfo.phone.trim())) {
      errors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }

    if (!recipientInfo.email.trim()) {
      errors.email = "Vui lòng nhập email người nhận";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientInfo.email.trim())) {
      errors.email = "Email không hợp lệ";
    }

    setRecipientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modified Create Cart function to use the new API format
  const createCartRecord = async (paymentMethod) => {
    try {
      setLoading(true);
      setError("");

      // Format cart items for API
      const formattedItems = cartItems.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
        price: item.isOnSale && item.discountedPrice ? item.discountedPrice : item.price
      }));

      // Set status based on payment method
      // When cod -> pending, when credit_card -> done
      const orderStatus = paymentMethod === "bank" ? "done" : "pending";

      // Build the request data - same format for both self and other
      const cartData = {
        items: formattedItems,
        totalAmount: getFinalTotal(),
        paymentMethod: paymentMethod === "bank" ? "credit_card" : "cod",
        status: orderStatus, // Add status field based on payment method
        orderNote: orderNote.trim() ? orderNote : "Không có" // Default to "Không có" when empty
      };

      let response;

      if (orderForOther) {
        // Add recipient information when ordering for someone else
        if (!validateRecipientInfo()) {
          setLoading(false);
          return false;
        }

        // Add recipient fields
        cartData.recipientName = recipientInfo.name;
        cartData.recipientEmail = recipientInfo.email;
        cartData.recipientAddress = recipientInfo.address;
        cartData.recipientPhone = recipientInfo.phone;

        // Use the create-for-other endpoint
        response = await createCartForOtherAxios(cartData);
      } else {
        // For ordering for self, get user's own information
        // Get user data from localStorage or context to populate recipient fields
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        // Verify required fields are present
        if (!userAddress) {
          setError("Vui lòng thêm địa chỉ giao hàng trước khi tiếp tục");
          setLoading(false);
          return false;
        }

        if (!phone) {
          setError("Vui lòng cập nhật số điện thoại trước khi tiếp tục");
          setLoading(false);
          return false;
        }

        // Add recipient fields with user's own information
        cartData.recipientName = userData.name || "Không có tên";
        cartData.recipientEmail = userData.email || "không có";
        cartData.recipientAddress = userAddress;
        cartData.recipientPhone = phone;

        // Use the regular create endpoint
        response = await createCartAxios(cartData);
      }

      // Rest of function remains the same...
      // Check if the response contains an error
      if (response.error) {
        throw new Error(response.message || "Failed to create cart record");
      }

      // Success! Clear cart items
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

  // Handle Order Mode Toggle
  const toggleOrderMode = () => {
    setOrderForOther(!orderForOther);
    // Clear recipient info and errors when switching modes
    if (!orderForOther) {
      setRecipientInfo({
        name: "",
        email: "",
        address: "",
        phone: "",
        addressData: {
          region: "",
          district: "",
          ward: "",
          streetAddress: "",
          formattedAddress: ""
        }
      });
      setRecipientErrors({
        name: "",
        email: "",
        address: "",
        phone: ""
      });
    }
  };

  // ✅ Handle All Payment Success (modified)
  const handlePayment = async () => {
    // Check if delivery address is provided
    if (!orderForOther && !userAddress) {
      setError("Vui lòng thêm địa chỉ giao hàng trước khi tiếp tục");
      return;
    }

    // Check if phone is provided when ordering for self
    if (!orderForOther && !phone) {
      setError("Vui lòng cập nhật số điện thoại trước khi tiếp tục");
      return;
    }

    // For recipient order, validation happens in createCartRecord

    if (selectedPayment === "bank") {
      try {
        // First create cart record
        const cartCreated = await createCartRecord("bank");

        if (cartCreated) {
          // Cart has been cleared in createCartRecord
          // Then process payment via PayOS
          await payosPayAxios(cartItems, getFinalTotal());
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

  // Other existing functions remain unchanged
  const toggleAddressModal = () => {
    setShowAddressModal(!showAddressModal);
  };

  const togglePaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
    setTempSelectedPayment(selectedPayment);
  };

  const togglePhoneModal = () => {
    setShowPhoneModal(!showPhoneModal);
    setTempPhone(phone);
    setPhoneError("");
  };

  const selectPaymentMethod = (method) => {
    setTempSelectedPayment(method);
  };

  const confirmPaymentMethod = () => {
    setSelectedPayment(tempSelectedPayment);
    setShowPaymentModal(false);
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) {
      return { isValid: false, message: 'Vui lòng nhập số điện thoại' };
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: 'Vui lòng nhập số điện thoại đúng 10 chữ số' };
    }

    return { isValid: true, message: '' };
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTempPhone(value);
    setPhoneError('');
  };

  // Function to update phone number
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

  const handleAddressChange = (newAddressData) => {
    setAddressData(newAddressData);
  };

  const handleRecipientAddressChange = (newAddressData) => {
    setRecipientInfo(prev => ({
      ...prev,
      address: newAddressData.formattedAddress, // Update the formatted address string
      addressData: newAddressData // Store the complete address data
    }));

    // Clear address error when address is updated
    if (recipientErrors.address) {
      setRecipientErrors(prev => ({
        ...prev,
        address: ""
      }));
    }
    
    // If ordering for self, make sure to update the shared address too
    if (!orderForOther) {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Update the address
        if (userData) {
          userData.address = newAddressData.formattedAddress;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('confirmedAddress', newAddressData.formattedAddress);
          
          // Dispatch events to notify other components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(userData)
          }));
          
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'confirmedAddress',
            newValue: newAddressData.formattedAddress
          }));
          
          // Dispatch custom event for same-tab updates
          window.dispatchEvent(new Event('addressUpdated'));
        }
      } catch (error) {
        console.error('Error updating address in localStorage:', error);
      }
    }
  };

  // Function to save address from modal
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

        // Update user data in localStorage
        userData.address = addressData.formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));

        // Also store in confirmedAddress for persistence
        localStorage.setItem('confirmedAddress', addressData.formattedAddress);
        
        // Dispatch storage events to notify other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(userData),
          url: window.location.href
        }));
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'confirmedAddress',
          newValue: addressData.formattedAddress,
          url: window.location.href
        }));
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('addressUpdated'));

        // Update local state for UI
        setUserAddress(addressData.formattedAddress);

      } catch (apiError) {
        console.error("API address update failed:", apiError);

        // Even if API fails, update in localStorage as fallback
        userData.address = addressData.formattedAddress;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Also update in confirmedAddress
        localStorage.setItem('confirmedAddress', addressData.formattedAddress);
        
        // Dispatch the same events for the fallback case
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(userData),
          url: window.location.href
        }));
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'confirmedAddress',
          newValue: addressData.formattedAddress,
          url: window.location.href
        }));
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('addressUpdated'));

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
        return '🏦';
      default:
        return '💵';
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
              {/* Order Mode Selection */}
              <div className={cx('section')}>
                <h3>🛒 Hình thức đặt hàng</h3>
                <div className={cx('order-mode-toggle')}>
                  <button
                    className={cx('mode-button', { active: !orderForOther })}
                    onClick={() => setOrderForOther(false)}
                  >
                    Đặt cho tôi
                  </button>
                  <button
                    className={cx('mode-button', { active: orderForOther })}
                    onClick={() => setOrderForOther(true)}
                  >
                    Đặt cho người khác
                  </button>
                </div>
              </div>

              {/* Regular delivery address - shown only when ordering for self */}
              {!orderForOther && (
                <>
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

                  {/* Phone Number Section - shown only when ordering for self */}
                  <div className={cx('section')}>
                    <h3>📱 Số điện thoại</h3>
                    <div className={cx('phone-box')}>
                      <span className={cx('phone-number')}>{phone || 'Chưa có số điện thoại'}</span>
                      <a href="#" onClick={togglePhoneModal}>
                        {phone ? 'Thay đổi' : 'Thêm số điện thoại'}
                      </a>
                    </div>
                  </div>
                </>
              )}

              {/* Recipient Information Form - shown only when ordering for someone else */}
              {orderForOther && (
                <div className={cx('section')}>
                  <h3>👤 Thông tin người nhận</h3>
                  <div className={cx('recipient-form')}>
                    <div className={cx('form-group')}>
                      <label>Tên người nhận <span className={cx('required')}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={recipientInfo.name}
                        onChange={handleRecipientChange}
                        placeholder="Nhập tên người nhận"
                        className={cx({ 'error': recipientErrors.name })}
                      />
                      {recipientErrors.name && (
                        <div className={cx('error-message')}>{recipientErrors.name}</div>
                      )}
                    </div>

                    <div className={cx('form-group')}>
                      <label>Email <span className={cx('required')}>*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={recipientInfo.email}
                        onChange={handleRecipientChange}
                        placeholder="Nhập email người nhận"
                        className={cx({ 'error': recipientErrors.email })}
                      />
                      {recipientErrors.email && (
                        <div className={cx('error-message')}>{recipientErrors.email}</div>
                      )}
                    </div>

                    {/* Replace the textarea with AddressSelector */}
                    <div className={cx('form-group')}>
                      <label>Địa chỉ <span className={cx('required')}>*</span></label>
                      <AddressSelector
                        initialAddress={recipientInfo.address}
                        onAddressChange={handleRecipientAddressChange}
                      />
                      {recipientErrors.address && (
                        <div className={cx('error-message')}>{recipientErrors.address}</div>
                      )}
                    </div>

                    <div className={cx('form-group')}>
                      <label>Số điện thoại <span className={cx('required')}>*</span></label>
                      <input
                        type="text"
                        name="phone"
                        value={recipientInfo.phone}
                        onChange={handleRecipientChange}
                        placeholder="Nhập số điện thoại 10 chữ số"
                        className={cx({ 'error': recipientErrors.phone })}
                        maxLength="10"
                      />
                      {recipientErrors.phone && (
                        <div className={cx('error-message')}>{recipientErrors.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method - visible for both modes */}
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

              {/* Order Note - visible for both modes */}
              <div className={cx('section')}>
                <h3>📝 Ghi chú đơn hàng</h3>
                <div className={cx('note-container')}>
                  <textarea
                    name="orderNote"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                    className={cx('order-note-textarea')}
                    rows="3"
                  />
                </div>
              </div>

              {/* Order Items Section */}
              <div className={cx('section', 'order-items-section')}>
                <h3 className={cx('section-heading')}>🛒 Thông tin kiện hàng</h3>
                {cartItems.map((item) => {
                  const hasDiscount = item.isOnSale && item.discountedPrice;
                  const displayPrice = hasDiscount ? item.discountedPrice : item.price;

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
                        <span className={cx("quantity")}>x{item.quantity}</span>
                        <span className={cx("product-name")}>{item.name}</span>
                      </div>
                      <div className={cx("item-price")}>
                        <div className={cx("quantity-price")}>
                          <span className={cx("discounted-price")}>{formatPrice(displayPrice * item.quantity)}</span>
                          {hasDiscount && (
                            <span className={cx("original-price")}>{formatPrice(item.price * item.quantity)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Section - Order Summary */}
        {!showSuccessMessage && (
          <>
            <div className={cx('payment-right')}>
              <button
                className={cx('order-button')}
                onClick={handlePayment}
                disabled={loading ||
                  (!orderForOther && !userAddress) ||
                  (!orderForOther && !phone)}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>

              {/* Error messages */}
              {!orderForOther && !userAddress && (
                <p className={cx('address-required-message')}>
                  Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
                </p>
              )}
              {!orderForOther && !phone && (
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
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className={cx('summary-item')}>
                  <span>Giảm giá</span>
                  <span>-{formatPrice(getTotalDiscount())}</span>
                </div>
                <div className={cx('summary-item', 'total')}>
                  <span>Thành tiền (Đã VAT)</span>
                  <span className={cx("total-price")}>{formatPrice(getFinalTotal())}</span>
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

      {/* Phone Modal */}
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

      {/* Address Modal */}
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