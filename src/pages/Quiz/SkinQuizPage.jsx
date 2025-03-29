import React from 'react';
import SkinQuiz from '~/components/Quiz/SkinQuiz';
import styles from './SkinQuizPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SkinQuizPage = () => {
    return (
        <div className={cx('skin-quiz-page')}>
            <SkinQuiz />
        </div>
    );
};

export default SkinQuizPage;