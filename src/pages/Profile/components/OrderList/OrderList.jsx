// src/pages/Profile/components/OrderList/OrderList.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ShoppingBag
} from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './OrderList.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';
import EmptyState from '../common/EmptyState/EmptyState';
import OrderItem from './OrderItem';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const OrderList = ({ orders, loading, error }) => {
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState({});

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
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
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  // Format date consistently
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  // Apply sorting and filtering
  const getSortedAndFilteredOrders = () => {
    if (!Array.isArray(orders)) return [];
    
    return orders
      .filter(order => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'cancelled') 
          return order.status === 'cancelled' || order.status === 'cancel';
        return order.status === filterStatus;
      })
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

  // Render loading state
  if (loading) {
    return (
      <div className={cx('loadingContainer')}>
        <div className={cx('spinner', 'large')}></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={cx('errorContainer')}>
        <p className={cx('errorMessage')}>{error}</p>
      </div>
    );
  }

  return (
    <div className={cx('orderListContainer')}>
      {/* Filter section - always visible */}
      <div className={cx('filterContainer')}>
        <label className={cx('filterLabel')}>Trạng thái đơn hàng:</label>
        <select 
          className={cx('filterSelect')}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Lọc theo trạng thái đơn hàng"
        >
          <option value="all">Tất cả đơn hàng</option>
          <option value="pending">Đang xử lý</option>
          <option value="done">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Either show table or empty state */}
      {sortedAndFilteredOrders.length > 0 ? (
        <div className={cx('tableWrapper')}>
          {/* Fixed header */}
          <div className={cx('tableHeader')}>
            <div className={cx('headerCell', 'idColumn')}>Mã đơn hàng</div>
            <div 
              className={cx('headerCell', 'dateColumn')}
              onClick={() => handleSort('purchaseDate')}
            >
              <div className={cx('sortableColumn')}>
                <span>Ngày mua</span>
                {getSortIcon('purchaseDate')}
              </div>
            </div>
            <div className={cx('headerCell', 'statusColumn')}>Trạng thái</div>
            <div 
              className={cx('headerCell', 'amountColumn')}
              onClick={() => handleSort('totalAmount')}
            >
              <div className={cx('sortableColumn')}>
                <span>Tổng tiền</span>
                {getSortIcon('totalAmount')}
              </div>
            </div>
            <div className={cx('headerCell', 'actionColumn')}></div>
          </div>
          
          {/* Scrollable body */}
          <div className={cx('tableBodyWrapper')}>
            {sortedAndFilteredOrders.map(order => (
              <div key={order._id} className={cx('orderRow')}>
                <div className={cx('orderHeader', { 'expanded': !!expandedOrders[order._id] })} 
                    onClick={() => toggleOrderExpansion(order._id)}>
                  <div className={cx('orderCell', 'idColumn')}>
                    #{order._id.substring(order._id.length - 8)}
                  </div>
                  <div className={cx('orderCell', 'dateColumn')}>
                    <Calendar size={16} className={cx('columnIcon')} />
                    <span>{formatDate(order.purchaseDate)}</span>
                  </div>
                  <div className={cx('orderCell', 'statusColumn')}>
                    <span className={cx('badge', {
                      'done': order.status.toLowerCase() === 'done',
                      'pending': order.status.toLowerCase() === 'pending',
                      'cancelled': ['cancelled', 'cancel'].includes(order.status.toLowerCase())
                    })}>
                      {order.status.toLowerCase() === 'pending' ? 'ĐANG XỬ LÝ' :
                       order.status.toLowerCase() === 'done' ? 'HOÀN THÀNH' :
                       'ĐÃ HỦY'}
                    </span>
                  </div>
                  <div className={cx('orderCell', 'amountColumn')}>
                    <span>{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ</span>
                  </div>
                  <div className={cx('orderCell', 'actionColumn')}>
                    {expandedOrders[order._id] ? (
                      <ChevronUp size={18} className={cx('expandIcon')} />
                    ) : (
                      <ChevronDown size={18} className={cx('expandIcon')} />
                    )}
                  </div>
                </div>
                
                {/* Order details section (only shown when expanded) */}
                {expandedOrders[order._id] && (
                  <div className={cx('orderDetails')}>
                    <div className={cx('orderInfo')}>
                      <div className={cx('orderInfoItem')}>
                        <span className={cx('infoLabel')}>Phương thức thanh toán:</span>
                        <span className={cx('infoValue')}>
                          {order.paymentMethod === 'credit_card' ? 'Chuyển khoản' : 
                           order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                           order.paymentMethod}
                        </span>
                      </div>
                    </div>
                    
                    <div className={cx('itemsList')}>
                      <h3 className={cx('detailsTitle')}>Sản phẩm đã mua</h3>
                      
                      {order.items && order.items.length > 0 ? (
                        <div className={cx('tableContainer')}>
                          <table className={cx('table', 'itemsTable')}>
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
                                const productName = typeof item.itemId === 'object' 
                                  ? (item.itemId?.name || 'Sản phẩm không xác định') 
                                  : `Sản phẩm #${item.itemId || index + 1}`;
                                  
                                return (
                                  <tr key={index}>
                                    <td>{productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(item.price)} đ</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className={cx('noItemsMessage')}>Không có thông tin sản phẩm</p>
                      )}
                    </div>
                    
                    <div className={cx('orderSummary')}>
                      <div className={cx('summaryRow')}>
                        <span className={cx('summaryLabel')}>Tổng tiền:</span>
                        <span className={cx('summaryValue')}>{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={<ShoppingBag size={48} />}
          title="Không có đơn hàng nào"
          message={
            filterStatus !== 'all' 
              ? `Bạn không có đơn hàng nào ${filterStatus === 'pending' ? 'đang xử lý' : 
                                          filterStatus === 'done' ? 'đã hoàn thành' : 'đã hủy'}`
              : "Bạn chưa có đơn hàng nào"
          }
          actionText="Tiếp tục mua sắm"
          actionLink="/"
        />
      )}
    </div>
  );
};

export default OrderList;