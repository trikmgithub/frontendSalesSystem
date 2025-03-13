import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Staff.module.scss';
import { logoutAxios } from '~/services/authAxios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAxios();
      localStorage.removeItem('user'); // Ensure user info is removed
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || userInfo === 'null') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className={cx('adminContainer')}>
      <h1 className={cx('adminTitle')}>Admin Dashboard</h1>
      <div className={cx('adminContent')}>
        <p className={cx('adminDescription')}>Welcome to the admin panel. Manage users, settings, and data here.</p>
        <button className={cx('adminButton')}>Manage Users</button>
        <button className={cx('adminButton')}>Settings</button>
        <button className={cx('logoutButton')} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AdminPage;
