// src/components/LoadingScreen/LoadingScreen.jsx
import React from 'react';
import styles from './LoadingScreen.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function LoadingScreen() {
  return (
    <div className={cx('loadingContainer')}>
      <div className={cx('spinner')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingScreen;