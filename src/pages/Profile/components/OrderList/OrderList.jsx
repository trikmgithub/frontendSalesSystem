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

  if (loading) {
    return (
      <div className={cx('loadingContainer')}>
        <div className={cx('spinner', 'large')}></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('errorContainer')}>
        <p className={cx('errorMessage')}>{error}</p>
      </div>
    );
  }

  if (!sortedAndFilteredOrders.length) {
    return (
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
    );
  }

  return (
    <div className={cx('orderListContainer')}>
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

      <div className={cx('tableContainer')}>
        <table className={cx('table', 'orderTable')}>
          <thead>
            <tr>
              <th className={cx('idColumn')}>Mã đơn hàng</th>
              <th 
                className={cx('dateColumn')}
                onClick={() => handleSort('purchaseDate')}
              >
                <div className={cx('sortableColumn')}>
                  <span>Ngày mua</span>
                  {getSortIcon('purchaseDate')}
                </div>
              </th>
              <th className={cx('statusColumn')}>Trạng thái</th>
              <th 
                className={cx('amountColumn')}
                onClick={() => handleSort('totalAmount')}
              >
                <div className={cx('sortableColumn')}>
                  <span>Tổng tiền</span>
                  {getSortIcon('totalAmount')}
                </div>
              </th>
              <th className={cx('actionColumn')}></th>
            </tr>
          </thead>
        </table>
      </div>

      <div className={cx('ordersList')}>
        {sortedAndFilteredOrders.map(order => (
          <OrderItem 
            key={order._id} 
            order={order}
            isExpanded={!!expandedOrders[order._id]}
            onToggleExpand={() => toggleOrderExpansion(order._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderList;