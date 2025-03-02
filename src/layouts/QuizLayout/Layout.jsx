import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './Layout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Layout = () => {
  return (
    <div className={cx('layout')}>
      <main className={cx('main-content')}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;