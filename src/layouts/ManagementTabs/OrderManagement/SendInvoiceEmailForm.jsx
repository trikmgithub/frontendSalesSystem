import React, { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { sendInvoiceEmailAxios } from '~/services/cartAxios';
import classNames from 'classnames/bind';
import styles from './OrderManagement.module.scss';

const cx = classNames.bind(styles);

const SendInvoiceEmailForm = ({ isOpen, onClose, cartId, defaultEmail = '' }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
      setError('');
      setLoading(false);
      setSuccess(false);
    }
  }, [isOpen, defaultEmail]);

  const validateEmail = (email) => {
    // Simple email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setError('');
    setSuccess(false);
    
    // Validate email
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Submit the form
    setLoading(true);
    
    try {
      const result = await sendInvoiceEmailAxios(cartId, email);
      
      if (result.error) {
        throw new Error(result.message || 'Failed to send invoice email');
      }
      
      // Show success message
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error sending invoice email:', err);
      setError(err.message || 'Failed to send invoice email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className={cx('emailFormModal')}>
      <div className={cx('emailFormContent')}>
        <div className={cx('emailFormHeader')}>
          <h3>Send Invoice by Email</h3>
          <button className={cx('closeButton')} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className={cx('emailFormBody')}>
          {success ? (
            <div className={cx('successMessage')}>
              <FaCheck />
              <p>Invoice has been sent successfully to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={cx('formGroup')}>
                <label htmlFor="email">Recipient Email Address</label>
                <div className={cx('emailInputContainer')}>
                  <FaEnvelope className={cx('emailIcon')} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={cx('emailInput', { 'errorInput': error })}
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className={cx('errorMessage')}>
                    <FaExclamationTriangle />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              
              <div className={cx('formDescription')}>
                <p>
                  The invoice will be sent as a PDF attachment to the email address provided.
                </p>
              </div>
              
              <div className={cx('formButtons')}>
                <button
                  type="button"
                  className={cx('cancelButton')}
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cx('submitButton')}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Invoice'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendInvoiceEmailForm;