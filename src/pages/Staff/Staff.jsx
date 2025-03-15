import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Staff.module.scss';
import { logoutAxios } from '~/services/authAxios';
import { useNavigate } from 'react-router-dom';
import { getAllCartsAxios, updateCartStatusAxios } from '~/services/cartAxios';
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaBox, FaMoneyBill, FaCalendarAlt, FaUser, FaShoppingCart } from 'react-icons/fa';

const cx = classNames.bind(styles);

function StaffPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPayments, setExpandedPayments] = useState({});
  const [activeTab, setActiveTab] = useState('payments');

  const handleLogout = async () => {
    try {
      await logoutAxios();
      localStorage.removeItem('user'); // Ensure user info is removed
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Fetch all payment data using our cartAxios service
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const response = await getAllCartsAxios();
      
      // Check if there was an error
      if (response.error) {
        throw new Error(response.message || 'Failed to load payment data');
      }
      
      if (response && response.data) {
        // Sort by purchase date (newest first)
        const sortedPayments = response.data.sort((a, b) => 
          new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );
        setPayments(sortedPayments);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error.message || 'Failed to load payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check user role on component mount
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');
    
    // If no user or not staff, redirect to home
    if (!userInfo || userInfo === 'null') {
      navigate('/');
      return;
    }
    
    // Check for staff role
    if (!['STAFF', 'MANAGER', 'ADMIN'].includes(userInfo.role)) {
      navigate('/');
      return;
    }
    
    // Set user data for display
    setUserData(userInfo);
    
    // Fetch payment data
    fetchPayments();
  }, [navigate]);

  // Toggle payment item expansion
  const togglePaymentExpansion = (paymentId) => {
    setExpandedPayments(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'done':
        return 'statusBadgeDone';
      case 'pending':
        return 'statusBadgePending';
      case 'cancelled':
        return 'statusBadgeCancelled';
      default:
        return 'statusBadgePending';
    }
  };

  // Get payment method display text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Chuyển khoản';
      case 'cod':
        return 'Thanh toán khi nhận hàng';
      default:
        return method;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <FaMoneyBill className={cx('paymentIcon', 'bankIcon')} />;
      case 'cod':
        return <FaMoneyBill className={cx('paymentIcon', 'codIcon')} />;
      default:
        return <FaMoneyBill className={cx('paymentIcon')} />;
    }
  };

  // Update payment status using our cartAxios service
  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const response = await updateCartStatusAxios(paymentId, newStatus);
      
      // Check if there was an error
      if (response.error) {
        throw new Error(response.message || 'Failed to update payment status');
      }
      
      // Update local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment._id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    }
  };

  return (
    <div className={cx('adminContainer')}>
      <div className={cx('adminHeader')}>
        <h1 className={cx('adminTitle')}>Staff Dashboard</h1>
        {userData && (
          <div className={cx('userInfo')}>
            <span className={cx('userName')}>Welcome, {userData.name}</span>
            <span className={cx('userRole')}>{userData.role}</span>
            <button className={cx('logoutButton')} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      
      <div className={cx('adminTabs')}>
        <button 
          className={cx('tabButton', { active: activeTab === 'payments' })}
          onClick={() => setActiveTab('payments')}
        >
          <FaShoppingCart /> Orders
        </button>
        <button 
          className={cx('tabButton', { active: activeTab === 'users' })}
          onClick={() => setActiveTab('users')}
        >
          <FaUser /> Users
        </button>
        <button 
          className={cx('tabButton', { active: activeTab === 'products' })}
          onClick={() => setActiveTab('products')}
        >
          <FaBox /> Products
        </button>
      </div>

      <div className={cx('adminContent')}>
        {activeTab === 'payments' && (
          <div className={cx('paymentsSection')}>
            <h2 className={cx('sectionTitle')}>Order Management</h2>
            
            {loading ? (
              <div className={cx('loadingIndicator')}>
                <div className={cx('spinner')}></div>
                <p>Loading payment data...</p>
              </div>
            ) : error ? (
              <div className={cx('errorMessage')}>{error}</div>
            ) : payments.length === 0 ? (
              <div className={cx('emptyState')}>
                <FaShoppingCart className={cx('emptyIcon')} />
                <p>No orders found</p>
              </div>
            ) : (
              <div className={cx('paymentList')}>
                {/* Order list table header */}
                <div className={cx('orderListHeader')}>
                  <div className={cx('orderColumn', 'idColumn')}>Order ID</div>
                  <div className={cx('orderColumn', 'dateColumn')}>Date</div>
                  <div className={cx('orderColumn', 'methodColumn')}>Payment Method</div>
                  <div className={cx('orderColumn', 'statusColumn')}>Status</div>
                  <div className={cx('orderColumn', 'amountColumn')}>Amount</div>
                  <div className={cx('orderColumn', 'actionColumn')}></div>
                </div>
                
                {payments.map(payment => (
                  <div key={payment._id} className={cx('paymentCard')}>
                    <div className={cx('paymentHeader')}>
                      <div className={cx('orderColumn', 'idColumn')}>
                        #{payment._id.substring(payment._id.length - 8)}
                      </div>
                      
                      <div className={cx('orderColumn', 'dateColumn')}>
                        <FaCalendarAlt className={cx('columnIcon')} />
                        {formatDate(payment.purchaseDate)}
                      </div>
                      
                      <div className={cx('orderColumn', 'methodColumn')}>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        {getPaymentMethodText(payment.paymentMethod)}
                      </div>
                      
                      <div className={cx('orderColumn', 'statusColumn')}>
                        <span className={cx('paymentStatus', getStatusBadgeClass(payment.status))}>
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className={cx('orderColumn', 'amountColumn')}>
                        {formatPrice(payment.totalAmount)}
                      </div>
                      
                      <div 
                        className={cx('orderColumn', 'actionColumn')}
                        onClick={() => togglePaymentExpansion(payment._id)}
                      >
                        {expandedPayments[payment._id] ? (
                          <FaChevronUp className={cx('expandIcon')} />
                        ) : (
                          <FaChevronDown className={cx('expandIcon')} />
                        )}
                      </div>
                    </div>
                    
                    {expandedPayments[payment._id] && (
                      <div className={cx('paymentDetails')}>
                        <div className={cx('paymentUser')}>
                          <strong>Customer ID:</strong> {payment.userId}
                        </div>
                        
                        <div className={cx('itemsList')}>
                          <h3>Order Items</h3>
                          <table className={cx('itemsTable')}>
                            <thead>
                              <tr>
                                <th>Item ID</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {payment.items.map(item => (
                                <tr key={item._id}>
                                  <td>{item.itemId}</td>
                                  <td>{item.quantity}</td>
                                  <td>{formatPrice(item.price)}</td>
                                  <td>{formatPrice(item.price * item.quantity)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className={cx('paymentActions')}>
                          <div className={cx('statusActions')}>
                            <span>Update Status:</span>
                            <button 
                              className={cx('actionButton', 'pendingButton')}
                              onClick={() => updatePaymentStatus(payment._id, 'pending')}
                              disabled={payment.status === 'pending'}
                            >
                              Pending
                            </button>
                            <button 
                              className={cx('actionButton', 'doneButton')}
                              onClick={() => updatePaymentStatus(payment._id, 'done')}
                              disabled={payment.status === 'done'}
                            >
                              Complete
                            </button>
                            <button 
                              className={cx('actionButton', 'cancelButton')}
                              onClick={() => updatePaymentStatus(payment._id, 'cancelled')}
                              disabled={payment.status === 'cancelled'}
                            >
                              Cancel
                            </button>
                          </div>
                          <button className={cx('editButton')}>
                            <FaEdit /> Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className={cx('usersSection')}>
            <h2 className={cx('sectionTitle')}>User Management</h2>
            <p className={cx('comingSoon')}>User management features coming soon</p>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className={cx('productsSection')}>
            <h2 className={cx('sectionTitle')}>Product Management</h2>
            <p className={cx('comingSoon')}>Product management features coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPage;