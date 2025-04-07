// src/pages/Profile/components/common/Toast/Toast.jsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

const Toast = ({ 
  message, 
  type = 'success', 
  onClose, 
  autoClose = true, 
  duration = 3000 
}) => {
  useEffect(() => {
    let timer;
    if (autoClose && message) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, onClose, autoClose, duration]);
  
  if (!message) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };
  
  return (
    <div className={cx('toast', type)}>
      <div className={cx('icon')}>
        {getIcon()}
      </div>
      
      <p className={cx('message')}>{message}</p>
      
      <button className={cx('closeButton')} onClick={onClose} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;