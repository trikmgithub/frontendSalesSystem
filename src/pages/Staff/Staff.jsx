// src/pages/Staff/Staff.jsx
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Staff.module.scss';
import { logoutAxios } from '~/services/authAxios';
import { useNavigate } from 'react-router-dom';
import {
  getAllCartsAxios,
  updateCartStatusAxios,
  getPendingOrdersAxios,
  getCompletedOrdersAxios,
  getCancelledOrdersAxios,
  downloadInvoiceAxios,
  sendInvoiceEmailAxios
} from '~/services/cartAxios';
import { getUserByIdAxios } from '~/services/userAxios';
import {
  FaChevronDown, FaChevronUp, FaEdit, FaMoneyBill, FaCalendarAlt,
  FaSort, FaSortAmountDown, FaSortAmountUp, FaFilter, FaShoppingCart,
  FaUndo, FaBoxOpen, FaClipboardList, FaFileInvoice, FaEnvelope, FaSpinner
} from 'react-icons/fa';
import ProductManagement from '~/pages/Staff/StaffProductManagement/ProductManagement';

const cx = classNames.bind(styles);

function StaffPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPayments, setExpandedPayments] = useState({});
  const [userEmails, setUserEmails] = useState({}); // Map userId -> email
  const [actionLoading, setActionLoading] = useState({}); // For download/send invoice buttons

  // Sorting and filtering state
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = async () => {
    try {
      await logoutAxios();
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      let response;

      // Use the appropriate API based on the selected status filter
      if (filterStatus === 'pending') {
        response = await getPendingOrdersAxios();
      } else if (filterStatus === 'done') {
        response = await getCompletedOrdersAxios();
      } else if (filterStatus === 'cancelled') {
        response = await getCancelledOrdersAxios();
      } else {
        // If 'all' is selected or default case
        response = await getAllCartsAxios();
      }

      if (response.error) {
        throw new Error(response.message || 'Failed to load payment data');
      }

      if (response && response.data) {
        setPayments(response.data);

        // Fetch user emails for all orders
        const userIds = [...new Set(response.data.map(payment => payment.userId))];
        fetchUserEmails(userIds);
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

  // Fetch user emails for all orders
  const fetchUserEmails = async (userIds) => {
    const emails = {};

    for (const userId of userIds) {
      if (!userEmails[userId]) {
        try {
          const userData = await getUserByIdAxios(userId);
          if (userData && userData.user && userData.user.email) {
            emails[userId] = userData.user.email;
          } else {
            emails[userId] = 'Unknown';
          }
        } catch (error) {
          console.error(`Error fetching user data for ${userId}:`, error);
          emails[userId] = 'Unknown';
        }
      }
    }

    setUserEmails(prev => ({ ...prev, ...emails }));
  };

  useEffect(() => {
    // Check user role on component mount
    const userInfo = JSON.parse(localStorage.getItem('user') || 'null');

    if (!userInfo || userInfo === 'null') {
      navigate('/');
      return;
    }

    if (!['STAFF', 'MANAGER', 'ADMIN'].includes(userInfo.role)) {
      navigate('/');
      return;
    }

    setUserData(userInfo);

    // Only fetch payments data if the active tab is 'orders'
    if (activeTab === 'orders') {
      fetchPayments();
    }
  }, [navigate, activeTab, filterStatus]); // Added filterStatus as a dependency

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
    switch (status.toLowerCase()) {
      case 'done':
        return 'statusBadgeDone';
      case 'pending':
        return 'statusBadgePending';
      case 'cancelled':
      case 'cancel':  // Handle both versions
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
      // Convert 'cancelled' to 'cancel' for API request
      const apiStatus = newStatus === 'cancelled' ? 'cancel' : newStatus;

      const response = await updateCartStatusAxios(paymentId, apiStatus);

      if (response.error) {
        throw new Error(response.message || 'Failed to update payment status');
      }

      // Always use 'cancelled' in the UI when the API status is 'cancel'
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

  // Download invoice PDF
  const handleDownloadInvoice = async (paymentId) => {
    setActionLoading(prev => ({ ...prev, [`download_${paymentId}`]: true }));

    try {
      const result = await downloadInvoiceAxios(paymentId);

      if (result.error) {
        alert('Failed to download invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`download_${paymentId}`]: false }));
    }
  };

  // Send invoice by email
  const handleSendInvoice = async (paymentId, userId) => {
    setActionLoading(prev => ({ ...prev, [`email_${paymentId}`]: true }));

    try {
      // Get the email for this user
      const email = userEmails[userId] || '';

      if (!email || email === 'Unknown') {
        alert('Customer email not available. Cannot send invoice.');
        return;
      }

      const result = await sendInvoiceEmailAxios(paymentId, email);

      if (result.error) {
        alert(`Failed to send invoice: ${result.message || 'Unknown error'}`);
      } else {
        alert('Invoice sent successfully to customer email.');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`email_${paymentId}`]: false }));
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  // Reset all filters and sorting
  const resetFiltersAndSort = () => {
    setSortField('purchaseDate');
    setSortDirection('desc');
    setFilterMethod('all');
    setFilterStatus('all');
  };

  // Apply sorting and filtering - now only uses client-side filtering for payment method
  const getSortedAndFilteredPayments = () => {
    return [...payments]
      .filter(payment => filterMethod === 'all' || payment.paymentMethod === filterMethod)
      .sort((a, b) => {
        if (sortField === 'purchaseDate') {
          return sortDirection === 'asc'
            ? new Date(a.purchaseDate) - new Date(b.purchaseDate)
            : new Date(b.purchaseDate) - new Date(a.purchaseDate);
        } else if (sortField === 'totalAmount') {
          return sortDirection === 'asc'
            ? a.totalAmount - b.totalAmount
            : b.totalAmount - a.totalAmount;
        }
        return 0;
      });
  };

  const sortedAndFilteredPayments = getSortedAndFilteredPayments();

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

      {/* Tab Navigation */}
      <div className={cx('tabNavigation')}>
        <button
          className={cx('tabButton', { active: activeTab === 'orders' })}
          onClick={() => setActiveTab('orders')}
        >
          <FaClipboardList />
          <span>Order Management</span>
        </button>
        <button
          className={cx('tabButton', { active: activeTab === 'products' })}
          onClick={() => setActiveTab('products')}
        >
          <FaBoxOpen />
          <span>Product Management</span>
        </button>
      </div>

      <div className={cx('adminContent')}>
        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className={cx('paymentsSection')}>
            <h2 className={cx('sectionTitle')}>Order Management</h2>

            <div className={cx('filterBar')}>
              <div className={cx('filterGroup')}>
                <label>Payment Method:</label>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className={cx('filterSelect')}
                >
                  <option value="all">All Methods</option>
                  <option value="cod">COD</option>
                  <option value="credit_card">Bank Transfer</option>
                </select>
              </div>

              <div className={cx('filterGroup')}>
                <label>Order Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={cx('filterSelect')}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="done">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                className={cx('resetButton')}
                onClick={resetFiltersAndSort}
                title="Reset all filters and sorting"
              >
                <FaUndo /> Reset
              </button>
            </div>

            {loading ? (
              <div className={cx('loadingIndicator')}>
                <div className={cx('spinner')}></div>
                <p>Loading payment data...</p>
              </div>
            ) : error ? (
              <div className={cx('errorMessage')}>{error}</div>
            ) : sortedAndFilteredPayments.length === 0 ? (
              <div className={cx('emptyState')}>
                <FaShoppingCart className={cx('emptyIcon')} />
                <p>No orders found</p>
              </div>
            ) : (
              <div className={cx('paymentList')}>
                <div className={cx('orderListHeader')}>
                  <div className={cx('orderColumn', 'idColumn')}>Order ID</div>
                  <div
                    className={cx('orderColumn', 'dateColumn', 'sortableColumn')}
                    onClick={() => handleSort('purchaseDate')}
                  >
                    Date {getSortIcon('purchaseDate')}
                  </div>
                  <div className={cx('orderColumn', 'methodColumn')}>
                    Payment Method
                  </div>
                  <div className={cx('orderColumn', 'statusColumn')}>
                    Status
                  </div>
                  <div
                    className={cx('orderColumn', 'amountColumn', 'sortableColumn')}
                    onClick={() => handleSort('totalAmount')}
                  >
                    Amount {getSortIcon('totalAmount')}
                  </div>
                  <div className={cx('orderColumn', 'actionColumn')}></div>
                </div>

                {sortedAndFilteredPayments.map(payment => (
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
                          {payment.status.toLowerCase() === 'cancel' ? 'CANCELLED' : payment.status.toUpperCase()}
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
                          <strong>Customer Email:</strong> {userEmails[payment.userId] || 'Loading...'}
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
                                <tr key={item._id || item.itemId}>
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

                          <div className={cx('invoiceActions')}>
                            <button
                              className={cx('invoiceButton', 'downloadButton')}
                              onClick={() => handleDownloadInvoice(payment._id)}
                              disabled={actionLoading[`download_${payment._id}`]}
                              title="Download Invoice"
                            >
                              {actionLoading[`download_${payment._id}`] ? (
                                <FaSpinner className={cx('spinnerIcon')} />
                              ) : (
                                <FaFileInvoice />
                              )}
                              <span>Download Invoice</span>
                            </button>

                            <button
                              className={cx('invoiceButton', 'emailButton')}
                              onClick={() => handleSendInvoice(payment._id, payment.userId)}
                              disabled={actionLoading[`email_${payment._id}`]}
                              title="Send Invoice by Email"
                            >
                              {actionLoading[`email_${payment._id}`] ? (
                                <FaSpinner className={cx('spinnerIcon')} />
                              ) : (
                                <FaEnvelope />
                              )}
                              <span>Email Invoice</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}
      </div>
    </div>
  );
}

export default StaffPage;