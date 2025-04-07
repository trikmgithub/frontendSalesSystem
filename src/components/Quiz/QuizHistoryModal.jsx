import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuizHistoryModal.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { IoClose } from 'react-icons/io5';
import { BsArrowRight } from 'react-icons/bs';

const cx = classNames.bind(styles);

const QuizHistoryModal = ({ isOpen, onClose, history, getSkinTypeName }) => {
  const navigate = useNavigate();

  // Handle click outside modal
  const handleOverlayClick = useCallback((e) => {
    if (e.target.className === cx('modal-overlay')) {
      onClose();
    }
  }, [onClose]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResultClick = (entry) => {
    // Use the skin type code directly in the URL
    const resultPath = config.routes.skinQuizResult.replace(':skinType', entry.determinedSkinType);

    navigate(resultPath, {
      state: {
        points: entry.scorePercentage,
        skinType: entry.determinedSkinType,
        fromHistory: true,
        answers: entry.answers
      }
    });
    
    onClose();
  };

  return (
    <div className={cx('modal-overlay')} onClick={handleOverlayClick}>
      <div className={cx('modal-content')}>
        <div className={cx('modal-header')}>
          <h2>Lịch Sử Kiểm Tra Da</h2>
          <button className={cx('close-button')} onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        <div className={cx('modal-body')}>
          {history.length === 0 ? (
            <p className={cx('no-history')}>Chưa có lịch sử kiểm tra da.</p>
          ) : (
            <div className={cx('history-list')}>
              {history.map((entry, index) => (
                <div key={entry._id} className={cx('history-item')}>
                  <div className={cx('history-content')}>
                    <div className={cx('history-header')}>
                      <h3>Kết quả #{history.length - index}</h3>
                      <span className={cx('history-date')}>
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    <div className={cx('history-details')}>
                      <p>
                        <strong>Loại da xác định:</strong>{' '}
                        <span className={cx('skin-type')}>
                          {getSkinTypeName(entry.determinedSkinType)}
                        </span>
                      </p>
                      <p>
                        <strong>Điểm số:</strong>{' '}
                        <span className={cx('score')}>
                          {Math.round(entry.scorePercentage)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    className={cx('view-result-button')}
                    onClick={() => handleResultClick(entry)}
                  >
                    Xem chi tiết
                    <BsArrowRight />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryModal;