import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfilePage.module.scss'; // Using existing profile styles
import { User } from 'lucide-react';
import { FaCalendarAlt, FaSort, FaSortAmountDown, FaSortAmountUp, FaChevronDown, FaChevronUp, FaShoppingCart } from 'react-icons/fa';
import { getUserOrdersAxios } from '~/services/cartAxios';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function OrdersPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  // Safely parse order data to prevent rendering errors
  const parseOrderData = (orders) => {
    // Check if orders is an array
    if (!Array.isArray(orders)) {
      console.error('Orders is not an array:', orders);
      return [];
    }
    
    // Process each order to ensure it has the expected structure
    return orders.map(order => {
      // Ensure items is an array
      const items = Array.isArray(order.items) ? order.items.map(item => {
        // Extract item details safely
        return {
          _id: item._id || '',
          itemId: item.itemId,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        };
      }) : [];
      
      return {
        ...order,
        items,
        purchaseDate: order.purchaseDate || new Date().toISOString(),
        totalAmount: Number(order.totalAmount) || 0,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod || 'cod'
      };
    });
  };

  // Fetch user orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userData._id) {
          throw new Error('User ID not found');
        }
        
        const response = await getUserOrdersAxios(userData._id);
        
        if (response.error) {
          throw new Error(response.message || 'Failed to load order data');
        }
        
        if (response && response.data) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to load order data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
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

  // Apply sorting and filtering
  const getSortedAndFilteredOrders = () => {
    const safeOrders = parseOrderData(orders);
    
    return safeOrders
      .filter(order => filterStatus === 'all' || order.status === filterStatus)
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

  const sortedAndFilteredOrders = getSortedAndFilteredOrders();

  return (
    <div className={cx('profileContainer')}>
      {/* Sidebar */}
      <div className={cx('sidebar')}>
        <div className={cx('sidebarHeader')}>
          <div className={cx('avatarPlaceholder')}>
            <User size={32} className={cx('avatarIcon')} />
          </div>
          <div className={cx('userInfo')}>
            <h2 className={cx('userGreeting')}>Chào (K18 HCM)</h2>
            <p className={cx('editAccount')}>Chỉnh sửa tài khoản</p>
          </div>
        </div>
        
        <div className={cx('navigation')}>
          <button 
            className={cx('navItem', { [styles.active]: selectedTab === 'profile' })}
            onClick={() => {
              setSelectedTab('profile');
              navigate(routes.profile);
            }}
          >
            Thông tin tài khoản
          </button>
          
          <button 
            className={cx('navItem', { [styles.active]: selectedTab === 'orders' })}
            onClick={() => {
              setSelectedTab('orders');
              navigate(routes.ordersPage);
            }}
          >
            Đơn hàng của tôi
          </button>
          
          <button 
            className={cx('navItem', { [styles.active]: selectedTab === 'favorites' })}
            onClick={() => {
              setSelectedTab('favorites');
              navigate(routes.favorites);
            }}
          >
            Danh sách yêu thích
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cx('mainContent')}>
        <div className={cx('contentSection')}>
          <h1 className={cx('sectionTitle')}>Đơn hàng của tôi</h1>
          
          {/* Filter dropdown for order status */}
          <div className={cx('filterBar')}>
            <div className={cx('filterGroup')}>
              <label>Trạng thái đơn hàng:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={cx('filterSelect')}
              >
                <option value="all">Tất cả đơn hàng</option>
                <option value="pending">Đang xử lý</option>
                <option value="done">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className={cx('loadingIndicator')}>
              <div className={cx('spinner')}></div>
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : error ? (
            <div className={cx('errorMessage')}>{error}</div>
          ) : sortedAndFilteredOrders.length === 0 ? (
            <div className={cx('emptyOrderState')}>
              <div className={cx('emptyOrderIcon')}>
                <FaShoppingCart className={cx('cartIcon')} />
              </div>
              <p className={cx('emptyOrderText')}>Bạn chưa có đơn hàng nào</p>
              <button 
                className={cx('continueShopping')}
                onClick={() => navigate(routes.home)}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className={cx('orderList')}>
              <div className={cx('orderListHeader')}>
                <div className={cx('orderColumn', 'idColumn')}>Mã đơn hàng</div>
                <div 
                  className={cx('orderColumn', 'dateColumn', 'sortableColumn')} 
                  onClick={() => handleSort('purchaseDate')}
                >
                  Ngày mua {getSortIcon('purchaseDate')}
                </div>
                <div className={cx('orderColumn', 'statusColumn')}>
                  Trạng thái
                </div>
                <div 
                  className={cx('orderColumn', 'amountColumn', 'sortableColumn')}
                  onClick={() => handleSort('totalAmount')}
                >
                  Tổng tiền {getSortIcon('totalAmount')}
                </div>
                <div className={cx('orderColumn', 'actionColumn')}></div>
              </div>
              
              {sortedAndFilteredOrders.map(order => (
                <div key={order._id} className={cx('orderCard')}>
                  <div 
                    className={cx('orderHeader')}
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className={cx('orderColumn', 'idColumn')}>
                      #{order._id.substring(order._id.length - 8)}
                    </div>
                    
                    <div className={cx('orderColumn', 'dateColumn')}>
                      <FaCalendarAlt className={cx('columnIcon')} />
                      {formatDate(order.purchaseDate)}
                    </div>
                    
                    <div className={cx('orderColumn', 'statusColumn')}>
                      <span className={cx('orderStatus', getStatusBadgeClass(order.status))}>
                        {order.status === 'pending' ? 'ĐANG XỬ LÝ' : 
                         order.status === 'done' ? 'HOÀN THÀNH' : 
                         order.status === 'cancelled' ? 'ĐÃ HỦY' : 
                         order.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className={cx('orderColumn', 'amountColumn')}>
                      {formatPrice(order.totalAmount)}
                    </div>
                    
                    <div className={cx('orderColumn', 'actionColumn')}>
                      {expandedOrders[order._id] ? (
                        <FaChevronUp className={cx('expandIcon')} />
                      ) : (
                        <FaChevronDown className={cx('expandIcon')} />
                      )}
                    </div>
                  </div>
                  
                  {expandedOrders[order._id] && (
                    <div className={cx('orderDetails')}>
                      <div className={cx('orderInfo')}>
                        <div className={cx('orderInfoItem')}>
                          <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(order.paymentMethod)}
                        </div>
                      </div>
                      
                      <div className={cx('itemsList')}>
                        <h3>Sản phẩm đã mua</h3>
                        {order.items && order.items.length > 0 ? (
                          <table className={cx('itemsTable')}>
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, index) => {
                                // Check if itemId is an object (the full product) or a string (just the ID)
                                const productName = typeof item.itemId === 'object' ? 
                                  (item.itemId?.name || 'Sản phẩm không xác định') : 
                                  `Sản phẩm #${item.itemId || index + 1}`;
                                  
                                return (
                                  <tr key={index}>
                                    <td>{productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td>{formatPrice(item.price * item.quantity)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <p className={cx('noItemsMessage')}>Không có thông tin sản phẩm</p>
                        )}
                      </div>
                      
                      <div className={cx('orderSummary')}>
                        <div className={cx('summaryRow')}>
                          <span>Tổng tiền:</span>
                          <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;