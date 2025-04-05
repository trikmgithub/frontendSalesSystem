import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './QuizManagement.module.scss';
import { FaPlus, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { createQuestionAxios } from '~/services/quizAxios';

const cx = classNames.bind(styles);

function CreateQuestionForm({ skinTypes, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionId: '',
    questionText: '',
    options: [{ text: '', points: '', skinType: '' }],
    order: 1,
  });
  const [formErrors, setFormErrors] = useState({});

  // Function to handle input change for form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Function to handle option change
  const handleOptionChange = (index, field, value) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]: field === 'points' ? parseInt(value, 10) : value
      };
      return { ...prev, options: newOptions };
    });
  };

  // Function to add option
  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', points: '', skinType: '' }]
    }));
  };

  // Function to remove option
  const removeOption = (index) => {
    if (formData.options.length <= 1) {
      return; // Keep at least one option
    }

    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions.splice(index, 1);
      return { ...prev, options: newOptions };
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.questionId?.trim()) {
      errors.questionId = 'Question ID is required';
    }

    if (!formData.questionText?.trim()) {
      errors.questionText = 'Question text is required';
    }

    const optionErrors = [];
    let hasOptionError = false;

    formData.options.forEach((option, index) => {
      const optError = {};

      if (!option.text?.trim()) {
        optError.text = 'Option text is required';
        hasOptionError = true;
      }

      if (!option.skinType?.trim()) {
        optError.skinType = 'Skin type is required';
        hasOptionError = true;
      }

      if (option.points === '') {
        optError.points = 'Please select a point value';
        hasOptionError = true;
      }

      optionErrors[index] = optError;
    });

    if (hasOptionError) {
      errors.options = optionErrors;
    }

    if (isNaN(formData.order) || formData.order < 1) {
      errors.order = 'Order must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to create question
  const createQuestion = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await createQuestionAxios(formData);

      if (response.error) {
        throw new Error(response.message || 'Failed to create question');
      }

      // Reset form
      setFormData({
        questionId: '',
        questionText: '',
        options: [{ text: '', points: '', skinType: '' }],
        order: 1,
      });

      // Notify parent component of success
      onSuccess();
      
    } catch (err) {
      console.error('Error creating question:', err);
      alert(err.message || 'Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('modal-overlay')}>
      <div className={cx('modal')}>
        <div className={cx('modal-header')}>
          <h3>Create New Question</h3>
          <button
            className={cx('close-button')}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className={cx('modal-body')}>
          <div className={cx('form-group')}>
            <label htmlFor="questionId">Question ID</label>
            <input
              type="text"
              id="questionId"
              name="questionId"
              value={formData.questionId}
              onChange={handleInputChange}
              className={cx({ 'error-input': formErrors.questionId })}
            />
            {formErrors.questionId && (
              <div className={cx('error-message')}>
                <FaExclamationTriangle /> {formErrors.questionId}
              </div>
            )}
          </div>

          <div className={cx('form-group')}>
            <label htmlFor="questionText">Question Text</label>
            <input
              type="text"
              id="questionText"
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              className={cx({ 'error-input': formErrors.questionText })}
            />
            {formErrors.questionText && (
              <div className={cx('error-message')}>
                <FaExclamationTriangle /> {formErrors.questionText}
              </div>
            )}
          </div>

          <div className={cx('form-group')}>
            <label htmlFor="order">Question Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="1"
              className={cx({ 'error-input': formErrors.order })}
            />
            {formErrors.order && (
              <div className={cx('error-message')}>
                <FaExclamationTriangle /> {formErrors.order}
              </div>
            )}
          </div>

          <div className={cx('form-group', 'options-form-group')}>
            <div className={cx('options-header')}>
              <label>Answer Options</label>
              <button
                type="button"
                onClick={addOption}
                className={cx('add-option-button')}
              >
                <FaPlus /> Add Option
              </button>
            </div>

            {formData.options.map((option, index) => (
              <div key={index} className={cx('option-form-row')}>
                <div className={cx('option-form-fields')}>
                  <div className={cx('option-form-group')}>
                    <input
                      type="text"
                      placeholder="Option text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      className={cx({ 'error-input': formErrors.options?.[index]?.text })}
                    />
                    {formErrors.options?.[index]?.text && (
                      <div className={cx('error-message')}>
                        <FaExclamationTriangle /> {formErrors.options[index].text}
                      </div>
                    )}
                  </div>

                  <div className={cx('option-form-group')}>
                    <select
                      value={option.points}
                      onChange={(e) => handleOptionChange(index, 'points', e.target.value)}
                      className={cx({ 'error-input': formErrors.options?.[index]?.points })}
                    >
                      <option value="">Select Point</option>
                      <option value="1">1 Point</option>
                      <option value="2">2 Points</option>
                      <option value="3">3 Points</option>
                      <option value="4">4 Points</option>
                      <option value="5">5 Points</option>
                    </select>
                    {formErrors.options?.[index]?.points && (
                      <div className={cx('error-message')}>
                        <FaExclamationTriangle /> {formErrors.options[index].points}
                      </div>
                    )}
                  </div>

                  <div className={cx('option-form-group')}>
                    <select
                      value={option.skinType}
                      onChange={(e) => handleOptionChange(index, 'skinType', e.target.value)}
                      className={cx({ 'error-input': formErrors.options?.[index]?.skinType })}
                    >
                      <option value="">Select Skin Type</option>
                      {skinTypes.map((type, idx) => (
                        <option key={idx} value={type.skinType || type}>
                          {type.skinType || type}
                        </option>
                      ))}
                    </select>
                    {formErrors.options?.[index]?.skinType && (
                      <div className={cx('error-message')}>
                        <FaExclamationTriangle /> {formErrors.options[index].skinType}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className={cx('remove-option-button')}
                  disabled={formData.options.length <= 1}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={cx('modal-footer')}>
          <button
            className={cx('cancel-button')}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={cx('submit-button')}
            onClick={createQuestion}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestionForm;