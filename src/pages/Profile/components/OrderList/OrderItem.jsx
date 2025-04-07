// src/pages/Profile/components/OrderList/OrderItem.jsx
import React from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './OrderList.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const OrderItem = ({ order, isExpanded, onToggleExpand }) => {
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
        return 'done';
      case 'pending':
        return 'pending';
      case 'cancelled':
      case 'cancel':
        return 'cancelled';
      default:
        return 'pending';
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

  // Get status display text
  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'ĐANG XỬ LÝ';
      case 'done':
        return 'HOÀN THÀNH';
      case 'cancelled':
      case 'cancel':
        return 'ĐÃ HỦY';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className={cx('orderItem', { 'expanded': isExpanded })}>
      <div className={cx('orderHeader')} onClick={onToggleExpand}>
        <div className={cx('orderColumn', 'idColumn')}>
          #{order._id.substring(order._id.length - 8)}
        </div>
        
        <div className={cx('orderColumn', 'dateColumn')}>
          <Calendar size={16} className={cx('columnIcon')} />
          {formatDate(order.purchaseDate)}
        </div>
        
        <div className={cx('orderColumn', 'statusColumn')}>
          <span className={cx('badge', getStatusBadgeClass(order.status))}>
            {getStatusText(order.status)}
          </span>
        </div>
        
        <div className={cx('orderColumn', 'amountColumn')}>
          {formatPrice(order.totalAmount)}
        </div>
        
        <div className={cx('orderColumn', 'actionColumn')}>
          {isExpanded ? (
            <ChevronUp size={18} className={cx('expandIcon')} />
          ) : (
            <ChevronDown size={18} className={cx('expandIcon')} />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className={cx('orderDetails')}>
          <div className={cx('orderInfo')}>
            <div className={cx('orderInfoItem')}>
              <span className={cx('infoLabel')}>Phương thức thanh toán:</span>
              <span className={cx('infoValue')}>{getPaymentMethodText(order.paymentMethod)}</span>
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
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
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
              <span className={cx('summaryValue')}>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;