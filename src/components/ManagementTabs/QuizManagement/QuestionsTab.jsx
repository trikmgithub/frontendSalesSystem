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
    FaQuestion,
} from 'react-icons/fa';
import { getQuestionsAxios } from '~/services/quizAxios';

// Import the extracted form components
import CreateQuestionForm from './CreateQuestionForm';
import EditQuestionForm from './EditQuestionForm';
import DeleteQuestionModal from './DeleteQuestionModal';

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

    // State for question modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

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

    // Function to open create modal
    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    // Function to handle create success
    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchQuestions();
    };

    // Function to open edit modal
    const openEditModal = (question) => {
        setCurrentQuestion(question);
        setShowEditModal(true);
    };

    // Function to handle edit success
    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchQuestions();
    };

    // Function to open delete modal
    const openDeleteModal = (question) => {
        setCurrentQuestion(question);
        setShowDeleteModal(true);
    };

    // Function to handle delete success
    const handleDeleteSuccess = () => {
        setShowDeleteModal(false);
        fetchQuestions();
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
                                    <th className={cx('question-column')}>
                                        Question
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
                                                <tr key={`${question._id}-option-${index}`} className={cx('option-data-row')}>
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
                                            <tr className={cx('option-data-row')}>
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

            {/* Render forms as needed */}
            {showCreateModal && (
                <CreateQuestionForm 
                    skinTypes={skinTypes}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {showEditModal && currentQuestion && (
                <EditQuestionForm 
                    skinTypes={skinTypes}
                    question={currentQuestion}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {showDeleteModal && currentQuestion && (
                <DeleteQuestionModal
                    question={currentQuestion}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </>
    );
}

export default QuestionsTab;