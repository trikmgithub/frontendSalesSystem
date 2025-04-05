import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './QuizManagement.module.scss';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { deleteQuestionAxios } from '~/services/quizAxios';

const cx = classNames.bind(styles);

function DeleteQuestionModal({ question, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  // Function to delete question
  const deleteQuestion = async () => {
    try {
      setLoading(true);

      const response = await deleteQuestionAxios(question._id);

      if (response.error) {
        throw new Error(response.message || 'Failed to delete question');
      }

      // Notify parent component of success
      onSuccess();

    } catch (err) {
      console.error('Error deleting question:', err);
      alert(err.message || 'Failed to delete question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('modal-overlay')}>
      <div className={cx('modal', 'delete-modal')}>
        <div className={cx('modal-header')}>
          <h3>Confirm Deletion</h3>
          <button
            className={cx('close-button')}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className={cx('modal-body')}>
          <p>Are you sure you want to delete this question?</p>
          <div className={cx('question-preview')}>
            <div><strong>Question ID:</strong> {question?.questionId}</div>
            <div><strong>Question:</strong> {question?.questionText}</div>
          </div>
          <p className={cx('delete-warning')}>
            <FaExclamationTriangle /> This action cannot be undone.
          </p>
        </div>
        <div className={cx('modal-footer')}>
          <button
            className={cx('cancel-button')}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={cx('delete-button')}
            onClick={deleteQuestion}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteQuestionModal;