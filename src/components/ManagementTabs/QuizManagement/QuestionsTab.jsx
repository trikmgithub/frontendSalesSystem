import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './QuizManagement.module.scss';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';
import {
    FaEdit,
    FaTrashAlt,
    FaPlus,
    FaSearch,
    FaSort,
    FaSortAmountDown,
    FaSortAmountUp,
    FaUndo,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaQuestion,
    FaExclamationTriangle,
} from 'react-icons/fa';
import {
    getQuestionsAxios,
    createQuestionAxios,
    updateQuestionAxios,
    deleteQuestionAxios,
} from '~/services/quizAxios';

const cx = classNames.bind(styles);
const PAGE_SIZE = 10;

function QuestionsTab({ skinTypes }) {
    // State for question list
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // State for sorting
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // State for filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    // State for question modals and form
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [formData, setFormData] = useState({
        questionId: '',
        questionText: '',
        options: [{ text: '', points: 1, skinType: '' }],
        order: 1,
        isActive: true
    });
    const [formErrors, setFormErrors] = useState({});

    // Use hook to disable body scroll when modal is open
    useDisableBodyScroll(showCreateModal || showEditModal || showDeleteModal);

    // Fetch questions when component mounts
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Filter and sort questions whenever questions, search term, or sort parameters change
    useEffect(() => {
        applyQuestionsFiltersAndSort();
    }, [questions, searchTerm, sortField, sortDirection]);

    // Update filtered questions when questions change
    const applyQuestionsFiltersAndSort = () => {
        let result = [...questions];

        // Apply search filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            result = result.filter(question =>
                question.questionText?.toLowerCase().includes(search) ||
                question.questionId?.toLowerCase().includes(search) ||
                question.options?.some(option =>
                    option.text?.toLowerCase().includes(search) ||
                    option.skinType?.toLowerCase().includes(search)
                )
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let valueA, valueB;

            switch (sortField) {
                case 'questionId':
                    // Extract numeric portion from questionId (e.g., "Q9" -> 9)
                    const numA = parseInt(a.questionId?.replace(/\D/g, '') || '0', 10);
                    const numB = parseInt(b.questionId?.replace(/\D/g, '') || '0', 10);
                    return sortDirection === 'asc' ? numA - numB : numB - numA;
                case 'questionText':
                    valueA = a.questionText?.toLowerCase() || '';
                    valueB = b.questionText?.toLowerCase() || '';
                    break;
                case 'createdAt':
                default:
                    valueA = new Date(a.createdAt || 0).getTime();
                    valueB = new Date(b.createdAt || 0).getTime();
                    break;
            }

            if (sortField !== 'questionId') {
                if (sortDirection === 'asc') {
                    return valueA > valueB ? 1 : -1;
                } else {
                    return valueA < valueB ? 1 : -1;
                }
            }
        });

        setFilteredQuestions(result);
        setTotalPages(Math.ceil(result.length / PAGE_SIZE));
    };

    // Fetch all quiz questions
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getQuestionsAxios();

            if (response.error) {
                throw new Error(response.message || 'Failed to fetch quiz questions');
            }

            if (response.data) {
                setQuestions(Array.isArray(response.data) ? response.data : []);
            } else {
                setQuestions([]);
            }
        } catch (err) {
            console.error('Error fetching quiz questions:', err);
            setError(err.message || 'Failed to fetch quiz questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredQuestions.slice(startIndex, startIndex + PAGE_SIZE);
    };

    // Function to handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        applyQuestionsFiltersAndSort();
    };

    // Function to handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Function to get sort icon
    const getSortIcon = (field) => {
        if (sortField !== field) return <FaSort />;
        return sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
    };

    // Function to reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setSortField('createdAt');
        setSortDirection('desc');
        setCurrentPage(1);
    };

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
                [field]: field === 'points' ? parseInt(value, 10) || 1 : value
            };
            return { ...prev, options: newOptions };
        });
    };

    // Function to add option
    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { text: '', points: 1, skinType: '' }]
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

            if (isNaN(option.points) || option.points < 1) {
                optError.points = 'Points must be a positive number';
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

    // Function to open create modal
    const openCreateModal = () => {
        // Generate a new question ID (e.g., "Q10")
        const highestId = questions
            .map(q => q.questionId || '')
            .filter(id => id.startsWith('Q'))
            .map(id => parseInt(id.substring(1), 10) || 0)
            .reduce((max, id) => Math.max(max, id), 0);

        const nextId = `Q${highestId + 1}`;

        setFormData({
            questionId: nextId,
            questionText: '',
            options: [{ text: '', points: 1, skinType: '' }],
            order: questions.length + 1,
            isActive: true
        });
        setFormErrors({});
        setShowCreateModal(true);
    };

    // Function to open edit modal
    const openEditModal = (question) => {
        setCurrentQuestion(question);

        setFormData({
            questionId: question.questionId || '',
            questionText: question.questionText || '',
            options: question.options?.length
                ? question.options.map(opt => ({
                    text: opt.text || '',
                    points: opt.points || 1,
                    skinType: opt.skinType || ''
                }))
                : [{ text: '', points: 1, skinType: '' }],
            order: question.order || 1,
            isActive: question.isActive !== false
        });

        setFormErrors({});
        setShowEditModal(true);
    };

    // Function to open delete modal
    const openDeleteModal = (question) => {
        setCurrentQuestion(question);
        setShowDeleteModal(true);
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

            // Reset form and close modal
            setFormData({
                questionId: '',
                questionText: '',
                options: [{ text: '', points: 1, skinType: '' }],
                order: questions.length + 1,
                isActive: true
            });

            setShowCreateModal(false);
            fetchQuestions();

        } catch (err) {
            console.error('Error creating question:', err);
            alert(err.message || 'Failed to create question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to update question
    const updateQuestion = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await updateQuestionAxios(currentQuestion._id, formData);

            if (response.error) {
                throw new Error(response.message || 'Failed to update question');
            }

            // Reset form and close modal
            setFormData({
                questionId: '',
                questionText: '',
                options: [{ text: '', points: 1, skinType: '' }],
                order: 1,
                isActive: true
            });

            setShowEditModal(false);
            fetchQuestions();

        } catch (err) {
            console.error('Error updating question:', err);
            alert(err.message || 'Failed to update question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to delete question
    const deleteQuestion = async () => {
        try {
            setLoading(true);

            const response = await deleteQuestionAxios(currentQuestion._id);

            if (response.error) {
                throw new Error(response.message || 'Failed to delete question');
            }

            setShowDeleteModal(false);
            fetchQuestions();

        } catch (err) {
            console.error('Error deleting question:', err);
            alert(err.message || 'Failed to delete question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hidden button for create trigger from parent */}
            <button
                id="create-question-btn"
                onClick={openCreateModal}
                style={{ display: 'none' }}
            />

            <div className={cx('tools')}>
                <form className={cx('search-form')} onSubmit={handleSearch}>
                    <div className={cx('search-input-container')}>
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cx('search-input')}
                        />
                        <button type="submit" className={cx('search-button')}>
                            <FaSearch />
                        </button>
                    </div>
                </form>

                <button
                    className={cx('reset-button')}
                    onClick={resetFilters}
                >
                    <FaUndo /> Reset Filters
                </button>
            </div>

            {loading && questions.length === 0 ? (
                <div className={cx('loading')}>
                    <div className={cx('loader')}></div>
                    <p>Loading questions...</p>
                </div>
            ) : error ? (
                <div className={cx('error')}>
                    <p>{error}</p>
                    <button onClick={fetchQuestions} className={cx('retry-button')}>
                        Try Again
                    </button>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className={cx('empty-state')}>
                    <FaQuestion className={cx('empty-icon')} />
                    <p>No questions found</p>
                    <button
                        onClick={openCreateModal}
                        className={cx('create-button')}
                    >
                        <FaPlus /> Add New Question
                    </button>
                </div>
            ) : (
                <>
                    <div className={cx('table-container')}>
                        <table className={cx('questions-table')}>
                            <thead>
                                <tr>
                                    <th
                                        className={cx('order-column', 'sortable')}
                                        onClick={() => handleSort('questionId')}
                                    >
                                        Order {getSortIcon('questionId')}
                                    </th>
                                    <th
                                        className={cx('question-column', 'sortable')}
                                        onClick={() => handleSort('questionText')}
                                    >
                                        Question {getSortIcon('questionText')}
                                    </th>
                                    <th className={cx('options-column')}>Options</th>
                                    <th className={cx('point-column')}>Point</th>
                                    <th className={cx('skin-type-column')}>Skin Type</th>
                                    <th className={cx('actions-column')}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageItems().map(question => (
                                    <React.Fragment key={question._id}>
                                        {question.options && question.options.length > 0 ? (
                                            // Render each option as a separate row to maintain alignment
                                            question.options.map((option, index) => (
                                                <tr key={`${question._id}-option-${index}`} className={cx('option-data-row', { 'inactive-row': !question.isActive })}>
                                                    {/* Only show question ID and text in the first row */}
                                                    {index === 0 ? (
                                                        <>
                                                            <td rowSpan={question.options.length} className={cx('order-column')}>
                                                                <strong>{question.questionId || '-'}</strong>
                                                            </td>
                                                            <td rowSpan={question.options.length} className={cx('question-column')}>
                                                                <div>{question.questionText}</div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <td className={cx('options-column')}>
                                                        <div className={cx('option-item')}>{option.text}</div>
                                                    </td>
                                                    <td className={cx('point-column')}>
                                                        <div className={cx('point-item')}>{option.points} pts</div>
                                                    </td>
                                                    <td className={cx('skin-type-column')}>
                                                        <div className={cx('skin-type-item')}>{option.skinType}</div>
                                                    </td>
                                                    {/* Only show actions in the first row */}
                                                    {index === 0 ? (
                                                        <td rowSpan={question.options.length} className={cx('actions-column')}>
                                                            <button
                                                                className={cx('action-button', 'edit')}
                                                                onClick={() => openEditModal(question)}
                                                                title="Edit question"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                className={cx('action-button', 'delete')}
                                                                onClick={() => openDeleteModal(question)}
                                                                title="Delete question"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </td>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            // Handle case with no options
                                            <tr className={cx({ 'inactive-row': !question.isActive })}>
                                                <td className={cx('order-column')}>
                                                    <strong>{question.questionId || '-'}</strong>
                                                </td>
                                                <td className={cx('question-column')}>
                                                    <div>{question.questionText}</div>
                                                </td>
                                                <td className={cx('options-column')}>No options</td>
                                                <td className={cx('point-column')}>-</td>
                                                <td className={cx('skin-type-column')}>-</td>
                                                <td className={cx('actions-column')}>
                                                    <button
                                                        className={cx('action-button', 'edit')}
                                                        onClick={() => openEditModal(question)}
                                                        title="Edit question"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className={cx('action-button', 'delete')}
                                                        onClick={() => openDeleteModal(question)}
                                                        title="Delete question"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={cx('pagination')}>
                    <div className={cx('pagination-buttons')}>
                        <button
                            className={cx('page-button', 'prev')}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ))
                            .map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className={cx('ellipsis')}>...</span>
                                    )}
                                    <button
                                        className={cx('page-button', { active: currentPage === page })}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))}
                        <button
                            className={cx('page-button', 'next')}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                    <div className={cx('page-info-container')}>
                        <span className={cx('page-info')}>
                            Showing {((currentPage - 1) * PAGE_SIZE) + 1}-
                            {Math.min(currentPage * PAGE_SIZE, filteredQuestions.length)} of {
                                filteredQuestions.length} questions
                        </span>
                    </div>
                </div>
            )}

            {/* Create Question Modal */}
            {showCreateModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal')}>
                        <div className={cx('modal-header')}>
                            <h3>Create New Question</h3>
                            <button
                                className={cx('close-button')}
                                onClick={() => setShowCreateModal(false)}
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

                            <div className={cx('form-group', 'checkbox-group')}>
                                <label className={cx('checkbox-label')}>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    <span>Active</span>
                                </label>
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
                                                <input
                                                    type="number"
                                                    placeholder="Points"
                                                    value={option.points}
                                                    onChange={(e) => handleOptionChange(index, 'points', e.target.value)}
                                                    min="1"
                                                    className={cx({ 'error-input': formErrors.options?.[index]?.points })}
                                                />
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
                                onClick={() => setShowCreateModal(false)}
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
            )}

            {/* Edit Question Modal */}
            {showEditModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal')}>
                        <div className={cx('modal-header')}>
                            <h3>Edit Question</h3>
                            <button
                                className={cx('close-button')}
                                onClick={() => setShowEditModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className={cx('modal-body')}>
                            <div className={cx('form-group')}>
                                <label htmlFor="edit-questionId">Question ID</label>
                                <input
                                    type="text"
                                    id="edit-questionId"
                                    name="questionId"
                                    value={formData.questionId}
                                    onChange={handleInputChange}
                                    className={cx({ 'error-input': formErrors.questionId })}
                                    readOnly // Question ID should not be editable
                                />
                                {formErrors.questionId && (
                                    <div className={cx('error-message')}>
                                        <FaExclamationTriangle /> {formErrors.questionId}
                                    </div>
                                )}
                            </div>

                            <div className={cx('form-group')}>
                                <label htmlFor="edit-questionText">Question Text</label>
                                <input
                                    type="text"
                                    id="edit-questionText"
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
                                <label htmlFor="edit-order">Question Order</label>
                                <input
                                    type="number"
                                    id="edit-order"
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

                            <div className={cx('form-group', 'checkbox-group')}>
                                <label className={cx('checkbox-label')}>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    <span>Active</span>
                                </label>
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
                                                <input
                                                    type="number"
                                                    placeholder="Points"
                                                    value={option.points}
                                                    onChange={(e) => handleOptionChange(index, 'points', e.target.value)}
                                                    min="1"
                                                    className={cx({ 'error-input': formErrors.options?.[index]?.points })}
                                                />
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
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={cx('submit-button')}
                                onClick={updateQuestion}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Question Modal */}
            {showDeleteModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal', 'delete-modal')}>
                        <div className={cx('modal-header')}>
                            <h3>Confirm Deletion</h3>
                            <button
                                className={cx('close-button')}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className={cx('modal-body')}>
                            <p>Are you sure you want to delete this question?</p>
                            <div className={cx('question-preview')}>
                                <div><strong>Question ID:</strong> {currentQuestion?.questionId}</div>
                                <div><strong>Question:</strong> {currentQuestion?.questionText}</div>
                            </div>
                            <p className={cx('delete-warning')}>
                                <FaExclamationTriangle /> This action cannot be undone.
                            </p>
                        </div>
                        <div className={cx('modal-footer')}>
                            <button
                                className={cx('cancel-button')}
                                onClick={() => setShowDeleteModal(false)}
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
            )}
        </>
    );
}

export default QuestionsTab;