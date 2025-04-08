import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './OrderManagement.module.scss';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';
import {
  FaChevronDown, FaChevronUp, FaMoneyBill, FaCalendarAlt,
  FaSort, FaSortAmountDown, FaSortAmountUp, FaShoppingCart,
  FaUndo, FaFileInvoice, FaEnvelope, FaSpinner, FaTimes, FaExclamationTriangle
} from 'react-icons/fa';
import {
  getAllCartsAxios,
  updateCartStatusAxios,
  getPendingOrdersAxios,
  getCompletedOrdersAxios,
  getCancelledOrdersAxios,
  downloadInvoiceAxios,
  getCartDetailAxios
} from '~/services/cartAxios';
import { getUserByIdAxios } from '~/services/userAxios';
import SendInvoiceEmailForm from './SendInvoiceEmailForm';

const cx = classNames.bind(styles);

function OrderManagement() {
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

  // Add email loading state to show loading indicator
  const [emailsLoading, setEmailsLoading] = useState({});

  // Status confirmation modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPaymentForEmail, setSelectedPaymentForEmail] = useState(null);

  const handleOpenEmailForm = (payment) => {
    setSelectedPaymentForEmail(payment);
    setShowEmailModal(true);
  };

  // Use hook to disable body scroll when modal is open
  useDisableBodyScroll(showStatusModal);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

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

      if (response && response.error) {
        throw new Error(response.message || 'Failed to load payment data');
      }

      // Check for valid data in the response
      if (response && response.data) {
        // Update the payments state
        setPayments(response.data);

        // Collect all unique user IDs from the orders
        const userIds = [...new Set(response.data.map(payment => payment.userId))];

        // Immediately initiate email fetching if we have user IDs
        if (userIds.length > 0) {
          // We don't need to await this - it can happen in the background
          fetchUserEmails(userIds);
        }
      } else {
        // Handle empty response or no data
        setPayments([]);
        console.log(`No payments found for status: ${filterStatus}`);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error.message || 'Failed to load payment data. Please try again.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed cart information when expanded
  const fetchCartDetails = async (cartId) => {
    // If we already have detailed info, don't fetch again
    if (payments.find(p => p._id === cartId && p.items && p.items.some(item => item.itemName))) {
      return;
    }

    try {
      // Show loading state
      setActionLoading(prev => ({ ...prev, [`details_${cartId}`]: true }));

      // Use the imported service function
      const response = await getCartDetailAxios(cartId);

      // Check if we got valid data
      if (response && response.data && !response.error) {
        // Update the payments state with detailed information
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            payment._id === cartId ? { ...payment, ...response.data } : payment
          )
        );
      } else if (response.error) {
        console.error(`Error fetching cart details: ${response.message}`);
      }
    } catch (error) {
      console.error(`Error in fetchCartDetails for cart ${cartId}:`, error);
    } finally {
      // Clear loading state
      setActionLoading(prev => ({ ...prev, [`details_${cartId}`]: false }));
    }
  };

  // Improved function to fetch user emails with batch processing and caching
  const fetchUserEmails = async (userIds) => {
    if (!userIds || userIds.length === 0) return;

    // Mark all new userIds as loading
    const loadingState = {};
    const userIdsToFetch = [];

    // Filter out users whose emails we already have and aren't "Unknown"
    userIds.forEach(id => {
      if (!userEmails[id] || userEmails[id] === 'Unknown') {
        loadingState[id] = true;
        userIdsToFetch.push(id);
      }
    });

    // If no new emails to fetch, return early
    if (userIdsToFetch.length === 0) return;

    setEmailsLoading(prev => ({ ...prev, ...loadingState }));

    const emails = {};

    // Process in batches of 5 to avoid too many concurrent requests
    const batchSize = 5;
    for (let i = 0; i < userIdsToFetch.length; i += batchSize) {
      const batch = userIdsToFetch.slice(i, i + batchSize);

      // Process batch in parallel
      await Promise.all(batch.map(async (userId) => {
        try {
          // Fetch user data with auth token
          const response = await getUserByIdAxios(userId);

          let email = 'Unknown';

          // Try different possible response structures to find the email
          if (response && response.data) {
            if (response.data.user && response.data.user.email) {
              // Structure: { data: { user: { email: '...' } } }
              email = response.data.user.email;
            } else if (response.data.email) {
              // Structure: { data: { email: '...' } }
              email = response.data.email;
            } else if (typeof response.data === 'object') {
              // The user object might be directly in data
              const userData = response.data;
              if (userData.email) {
                email = userData.email;
              }
            }
          }

          emails[userId] = email;
        } catch (error) {
          console.error(`Error fetching user data for ${userId}:`, error);
          emails[userId] = 'Unknown';
        } finally {
          // Mark this userId as done loading
          setEmailsLoading(prev => ({
            ...prev,
            [userId]: false
          }));
        }
      }));
    }

    // Update the emails state with all the newly fetched emails
    setUserEmails(prev => ({ ...prev, ...emails }));
  };

  useEffect(() => {
    // Fetch payments when component mounts or when filter status changes
    fetchPayments();

    // Reset expanded payments when filter changes to avoid stale UI state
    setExpandedPayments({});
  }, [filterStatus]); // Added filterStatus as a dependency

  // Toggle payment item expansion
  const togglePaymentExpansion = (paymentId) => {
    // Toggle the expansion state
    const newExpandedState = !expandedPayments[paymentId];
    
    setExpandedPayments(prev => ({
      ...prev,
      [paymentId]: newExpandedState
    }));
    
    // If we're expanding this payment, fetch its detailed information
    if (newExpandedState) {
      fetchCartDetails(paymentId);
    }
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

  // Open status confirmation modal
  const openStatusConfirmation = (payment, newStatus) => {
    setSelectedPayment(payment);
    setTargetStatus(newStatus);
    setShowStatusModal(true);
  };

  // Update payment status using our cartAxios service
  const updatePaymentStatus = async () => {
    if (!selectedPayment || !targetStatus) return;

    try {
      setStatusUpdateLoading(true);

      // Convert 'cancelled' to 'cancel' for API request
      const apiStatus = targetStatus === 'cancelled' ? 'cancel' : targetStatus;

      const response = await updateCartStatusAxios(selectedPayment._id, apiStatus);

      if (response.error) {
        throw new Error(response.message || 'Failed to update payment status');
      }

      // Always use 'cancelled' in the UI when the API status is 'cancel'
      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment._id === selectedPayment._id ? { ...payment, status: targetStatus } : payment
        )
      );

      // Close the modal
      setShowStatusModal(false);
      setSelectedPayment(null);
      setTargetStatus('');

    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Download invoice PDF
  const handleDownloadInvoice = async (paymentId) => {
    setActionLoading(prev => ({ ...prev, [`download_${paymentId}`]: true }));

    try {
      const result = await downloadInvoiceAxios(paymentId);

      if (result.error) {
        console.error('Download failed with error:', result.message);
      } else if (result.method === 'direct') {
        // If we used the direct URL method, show a different message
        console.log('Using direct URL download method');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert(`Download error: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`download_${paymentId}`]: false }));
    }
  };

  // Send invoice by email
  const handleSendInvoice = (paymentId, userId) => {
    // Get the payment object by ID
    const payment = payments.find(p => p._id === paymentId);
    if (!payment) {
      alert('Payment not found');
      return;
    }

    // Open the email form modal
    handleOpenEmailForm(payment);
  };

  // Manually refresh customer email
  const refreshCustomerEmail = async (userId) => {
    if (!userId) return;

    setEmailsLoading(prev => ({ ...prev, [userId]: true }));

    try {
      const response = await getUserByIdAxios(userId);

      let email = 'Unknown';
      if (response && response.data) {
        if (response.data.user && response.data.user.email) {
          email = response.data.user.email;
        } else if (response.data.email) {
          email = response.data.email;
        } else if (typeof response.data === 'object') {
          const userData = response.data;
          if (userData.email) {
            email = userData.email;
          }
        }
      }

      setUserEmails(prev => ({ ...prev, [userId]: email }));
    } catch (error) {
      console.error(`Error refreshing email for user ${userId}:`, error);
    } finally {
      setEmailsLoading(prev => ({ ...prev, [userId]: false }));
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

  // Get status update confirmation message
  const getStatusUpdateMessage = (status) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'Are you sure you want to mark this order as completed?';
      case 'pending':
        return 'Are you sure you want to change this order status to pending?';
      case 'cancelled':
      case 'cancel':
        return 'Are you sure you want to cancel this order?';
      default:
        return 'Are you sure you want to update this order status?';
    }
  };

  // First, add new helper functions to display recipient info
  const getRecipientName = (payment) => {
    if (payment?.recipientInfo?.name) {
      return payment.recipientInfo.name;
    }
    return 'Không có thông tin';
  };

  const getRecipientSection = (payment) => {
    if (!payment.recipientInfo) return null;
    
    return (
      <div className={cx('recipientSection')}>
        <h3 className={cx('sectionTitle')}>Thông tin người nhận</h3>
        <div className={cx('recipientInfo')}>
          <div className={cx('recipientRow')}>
            <span className={cx('recipientLabel')}>Tên:</span>
            <span className={cx('recipientValue')}>{payment.recipientInfo.name || 'Không có'}</span>
          </div>
          <div className={cx('recipientRow')}>
            <span className={cx('recipientLabel')}>Email:</span>
            <span className={cx('recipientValue')}>{payment.recipientInfo.email || 'Không có'}</span>
          </div>
          <div className={cx('recipientRow')}>
            <span className={cx('recipientLabel')}>Địa chỉ:</span>
            <span className={cx('recipientValue')}>{payment.recipientInfo.address || 'Không có'}</span>
          </div>
          <div className={cx('recipientRow')}>
            <span className={cx('recipientLabel')}>Điện thoại:</span>
            <span className={cx('recipientValue')}>{payment.recipientInfo.phone || 'Không có'}</span>
          </div>
          {payment.recipientInfo.note && (
            <div className={cx('recipientRow', 'noteRow')}>
              <span className={cx('recipientLabel')}>Ghi chú:</span>
              <span className={cx('recipientValue', 'noteValue')}>{payment.recipientInfo.note}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
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
            <div className={cx('orderColumn', 'typeColumn')}>
              Order Type
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
            <div className={cx('orderColumn', 'actionColumn')}>Actions</div>
          </div>

          {sortedAndFilteredPayments.map(payment => (
            <div key={payment._id} className={cx('paymentCard')}>
              <div className={cx('paymentHeader')} onClick={() => togglePaymentExpansion(payment._id)}>
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

                <div className={cx('orderColumn', 'typeColumn')}>
                  {payment.isOrderForOther ? (
                    <span className={cx('orderTypeBadge', 'otherRecipient')}>Đặt hộ</span>
                  ) : (
                    <span className={cx('orderTypeBadge', 'selfRecipient')}>Đặt cho mình</span>
                  )}
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
                    <div className={cx('customerInfo')}>
                      <div className={cx('customerEmail')}>
                        <strong>Customer Email:</strong> {emailsLoading[payment.userId] ? (
                          <span className={cx('loadingText')}>Loading email...</span>
                        ) : (
                          <span>{userEmails[payment.userId] || payment.username || 'Unknown'}</span>
                        )}
                        {(!userEmails[payment.userId] || userEmails[payment.userId] === 'Unknown') && (
                          <button
                            className={cx('refreshEmailButton')}
                            onClick={() => refreshCustomerEmail(payment.userId)}
                            title="Refresh email"
                          >
                            <FaUndo />
                          </button>
                        )}
                      </div>
                      {payment.username && payment.username !== userEmails[payment.userId] && (
                        <div className={cx('customerUsername')}>
                          <strong>Username:</strong> {payment.username}
                        </div>
                      )}
                      <div className={cx('orderDate')}>
                        <strong>Order Date:</strong> {formatDate(payment.purchaseDate)}
                      </div>
                    </div>
                  </div>

                  {getRecipientSection(payment)}

                  <div className={cx('itemsList')}>
                    <h3>Order Items</h3>
                    {actionLoading[`details_${payment._id}`] ? (
                      <div className={cx('loadingItems')}>
                        <div className={cx('spinner-small')}></div>
                        <p>Loading item details...</p>
                      </div>
                    ) : (
                      <table className={cx('itemsTable')}>
                        <thead>
                          <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.items.map(item => (
                            <tr key={item._id || item.itemId}>
                              <td>{item.itemId}</td>
                              <td>{item.itemName || 'Unknown Item'}</td>
                              <td>{item.quantity}</td>
                              <td>{formatPrice(item.price)}</td>
                              <td>{formatPrice(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="4" className={cx('totalRow')}>Total Amount:</td>
                            <td className={cx('totalValue')}>{formatPrice(payment.totalAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>

                  <div className={cx('paymentActions')}>
                    <div className={cx('statusActions')}>
                      <span>Update Status:</span>
                      <button
                        className={cx('actionButton', 'pendingButton')}
                        onClick={() => openStatusConfirmation(payment, 'pending')}
                        disabled={payment.status === 'pending'}
                      >
                        Pending
                      </button>
                      <button
                        className={cx('actionButton', 'doneButton')}
                        onClick={() => openStatusConfirmation(payment, 'done')}
                        disabled={payment.status === 'done'}
                      >
                        Complete
                      </button>
                      <button
                        className={cx('actionButton', 'cancelButton')}
                        onClick={() => openStatusConfirmation(payment, 'cancelled')}
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
                        disabled={actionLoading[`email_${payment._id}`] || !userEmails[payment.userId] || userEmails[payment.userId] === 'Unknown'}
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

      {/* Email Form Modal */}
      {showEmailModal && selectedPaymentForEmail && (
        <SendInvoiceEmailForm
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          cartId={selectedPaymentForEmail._id}
          defaultEmail={userEmails[selectedPaymentForEmail.userId] || ''}
        />
      )}

      {/* Status Update Confirmation Modal */}
      {showStatusModal && selectedPayment && (
        <div className={cx('statusConfirmModal')}>
          <div className={cx('statusConfirmContent')}>
            <div className={cx('statusConfirmHeader')}>
              <h3>Confirm Status Update</h3>
              <button
                className={cx('closeButton')}
                onClick={() => setShowStatusModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={cx('statusConfirmBody')}>
              <div className={cx('confirmMessage')}>
                <FaExclamationTriangle className={cx('warningIcon')} />
                <p>{getStatusUpdateMessage(targetStatus)}</p>
              </div>

              <div className={cx('orderSummary')}>
                <div className={cx('summaryRow')}>
                  <span className={cx('summaryLabel')}>Order ID:</span>
                  <span className={cx('summaryValue')}>{selectedPayment._id}</span>
                </div>

                <div className={cx('summaryRow')}>
                  <span className={cx('summaryLabel')}>Date:</span>
                  <span className={cx('summaryValue')}>{formatDate(selectedPayment.purchaseDate)}</span>
                </div>

                <div className={cx('summaryRow')}>
                  <span className={cx('summaryLabel')}>Amount:</span>
                  <span className={cx('summaryValue')}>{formatPrice(selectedPayment.totalAmount)}</span>
                </div>

                <div className={cx('summaryRow')}>
                  <span className={cx('summaryLabel')}>Current Status:</span>
                  <span className={cx('summaryValue')}>
                    <span className={cx('paymentStatus', getStatusBadgeClass(selectedPayment.status))}>
                      {selectedPayment.status.toLowerCase() === 'cancel' ? 'CANCELLED' : selectedPayment.status.toUpperCase()}
                    </span>
                  </span>
                </div>

                <div className={cx('summaryRow')}>
                  <span className={cx('summaryLabel')}>New Status:</span>
                  <span className={cx('summaryValue')}>
                    <span className={cx('paymentStatus', getStatusBadgeClass(targetStatus))}>
                      {targetStatus.toUpperCase()}
                    </span>
                  </span>
                </div>

                {selectedPayment && selectedPayment.isOrderForOther && (
                  <div className={cx('summaryRow')}>
                    <span className={cx('summaryLabel')}>Order Type:</span>
                    <span className={cx('summaryValue')}>
                      <span className={cx('orderTypeBadge', 'otherRecipient')}>Đặt hộ</span>
                    </span>
                  </div>
                )}
                
                {selectedPayment && selectedPayment.recipientInfo && (
                  <div className={cx('summaryRow')}>
                    <span className={cx('summaryLabel')}>Recipient:</span>
                    <span className={cx('summaryValue')}>{selectedPayment.recipientInfo.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={cx('statusConfirmFooter')}>
              <button
                className={cx('cancelButton')}
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('confirmButton')}
                onClick={updatePaymentStatus}
                disabled={statusUpdateLoading}
              >
                {statusUpdateLoading ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;