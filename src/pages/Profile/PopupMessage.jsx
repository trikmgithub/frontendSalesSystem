import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import cx from 'classnames';
import styles from './PopupMessage.module.scss';

const PopupMessage = ({ message, type, onClose, autoClose = true, duration = 3000 }) => {
  useEffect(() => {
    let timer;
    
    // Tự động đóng pop-up sau khoảng thời gian đã định
    if (autoClose && message) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    // Clear timeout khi component unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, onClose, autoClose, duration]);
  
  if (!message) return null;
  
  return (
    <div className={cx(styles.popupOverlay)}>
      <div className={cx(styles.popupContainer, {
        [styles.success]: type === 'success',
        [styles.error]: type === 'error'
      })}>
        <div className={cx(styles.popupIcon)}>
          {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        </div>
        
        <div className={cx(styles.popupContent)}>
          <p className={cx(styles.popupMessage)}>{message}</p>
        </div>
        
        <button 
          className={cx(styles.closeButton)} 
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;