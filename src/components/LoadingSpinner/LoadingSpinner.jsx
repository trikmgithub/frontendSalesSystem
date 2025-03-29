// src/components/LoadingSpinner/LoadingSpinner.jsx
import classNames from 'classnames/bind';
import styles from './LoadingSpinner.module.scss';

const cx = classNames.bind(styles);

function LoadingSpinner({ size = 'medium' }) {
    return (
        <div className={cx('spinner', size)}>
            <div className={cx('bounce1')}></div>
            <div className={cx('bounce2')}></div>
            <div className={cx('bounce3')}></div>
        </div>
    );
}

export default LoadingSpinner;