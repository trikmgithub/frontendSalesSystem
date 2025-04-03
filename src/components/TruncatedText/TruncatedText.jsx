import React from 'react';
import classNames from 'classnames/bind';
import styles from './TruncatedText.module.scss';

const cx = classNames.bind(styles);

const TruncatedText = ({ text, maxLength = 20, className, ...props }) => {
  if (!text) return null;
  
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  
  return (
    <span 
      className={classNames(cx('truncatedText'), className)} 
      title={text} // Show full text on hover
      {...props}
    >
      {truncated}
    </span>
  );
};

export default TruncatedText;