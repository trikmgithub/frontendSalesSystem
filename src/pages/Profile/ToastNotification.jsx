import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import cx from 'classnames';
import styles from './ToastNotification.module.scss';

const Toast = ({ message, type, onClose, autoClose = true, duration = 3000 }) => {
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
  
  return (
    <div className={cx(styles.toast, {
      [styles.success]: type === 'success',
      [styles.error]: type === 'error'
    })}>
      <div className={cx(styles.icon)}>
        {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      </div>
      
      <p className={cx(styles.message)}>{message}</p>
      
      <button className={cx(styles.close)} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;