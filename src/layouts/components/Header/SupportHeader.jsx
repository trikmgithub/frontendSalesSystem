import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SupportHeader.module.scss';
import logo from '~/assets/logo2.png';

function SupportHeader() {
    return (
        <header className={styles.supportHeader}>
            <div className={styles.logo}>
                <Link to="/"><img src={logo} alt="Logo" /></Link>            
            </div>
            <div className={styles.actions}>
                <Link to="/request" className={styles.link}>Gửi yêu cầu</Link>
                <Link to="/login" className={styles.link}>Đăng nhập</Link>
            </div>
        </header>
    );
}

export default SupportHeader;