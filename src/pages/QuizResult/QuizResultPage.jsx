import React from 'react';
import QuizResult from '~/layouts/components/Quiz/QuizResult';
import styles from './QuizResultPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const QuizResultPage = () => {
    return (
        <div className={cx('quiz-result-page')}>
            <QuizResult />
        </div>
    );
};

export default QuizResultPage;