// src/pages/Profile/components/common/EmptyState/EmptyState.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './EmptyState.module.scss';
import sharedStyles from '../../../styles/ProfileShared.module.scss';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionText, 
  actionLink,
  onAction
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionLink) {
      navigate(actionLink);
    }
  };
  
  return (
    <div className={cx('emptyState')}>
      <div className={cx('emptyIcon')}>
        {icon}
      </div>
      
      <h3 className={cx('emptyTitle')}>{title}</h3>
      
      {message && (
        <p className={cx('emptyMessage')}>{message}</p>
      )}
      
      {(actionText && (actionLink || onAction)) && (
        <button 
          className={cx('button', 'primary')}
          onClick={handleAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;