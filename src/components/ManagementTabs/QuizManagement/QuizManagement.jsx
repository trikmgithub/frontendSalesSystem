// src/components/ManagementTabs/QuizManagement/QuizManagement.jsx
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
  FaSave,
  FaCheck,
  FaEye,
  FaSpa,
  FaListAlt
} from 'react-icons/fa';
import {
  getQuestionsAxios,
  createQuestionAxios,
  updateQuestionAxios,
  deleteQuestionAxios,
  getSkinTypesAxios,
  getSkinTypeDetailsAxios,
  createSkinTypeAxios,
  updateSkinTypeAxios
} from '~/services/quizAxios';

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

function QuizManagement() {
  // Tab state for switching between Questions and Skin Types management
  const [activeTab, setActiveTab] = useState('questions');

  // State for question list
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for skin types
  const [skinTypes, setSkinTypes] = useState([]);
  const [loadingSkinTypes, setLoadingSkinTypes] = useState(true);
  const [skinTypeError, setSkinTypeError] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filteredSkinTypes, setFilteredSkinTypes] = useState([]);

  // State for modals - Questions
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // State for modals - Skin Types
  const [showSkinTypeCreateModal, setShowSkinTypeCreateModal] = useState(false);
  const [showSkinTypeEditModal, setShowSkinTypeEditModal] = useState(false);
  const [showSkinTypeDeleteModal, setShowSkinTypeDeleteModal] = useState(false);
  const [currentSkinType, setCurrentSkinType] = useState(null);

  // State for form data - Questions
  const [formData, setFormData] = useState({
    questionId: '',
    questionText: '',
    options: [{ text: '', points: 1, skinType: '' }],
    order: 1,
    isActive: true
  });

  // State for form data - Skin Types
  const [skinTypeFormData, setSkinTypeFormData] = useState({
    skinType: '',
    description: '',
    recommendations: ['']
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  const [skinTypeFormErrors, setSkinTypeFormErrors] = useState({});

  // Use hook to disable body scroll when modal is open
  useDisableBodyScroll(
    showCreateModal || 
    showEditModal || 
    showDeleteModal || 
    showSkinTypeCreateModal || 
    showSkinTypeEditModal || 
    showSkinTypeDeleteModal
  );

  // Fetch questions and skin types when component mounts
  useEffect(() => {
    fetchQuestions();
    fetchSkinTypes();
  }, []);

  // Filter and sort questions whenever questions, search term, or sort parameters change
  useEffect(() => {
    if (activeTab === 'questions') {
      applyQuestionsFiltersAndSort();
    } else {
      applySkinTypesFiltersAndSort();
    }
  }, [questions, skinTypes, searchTerm, sortField, sortDirection, activeTab]);

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
          valueA = a.questionId?.toLowerCase() || '';
          valueB = b.questionId?.toLowerCase() || '';
          break;
        case 'questionText':
          valueA = a.questionText?.toLowerCase() || '';
          valueB = b.questionText?.toLowerCase() || '';
          break;
        case 'order':
          valueA = a.order || 0;
          valueB = b.order || 0;
          break;
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt || 0).getTime();
          valueB = new Date(b.createdAt || 0).getTime();
          break;
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredQuestions(result);
    setTotalPages(Math.ceil(result.length / PAGE_SIZE));
  };

  // Update filtered skin types when skin types change
  const applySkinTypesFiltersAndSort = () => {
    let result = [...skinTypes];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(skinType => 
        skinType.skinType?.toLowerCase().includes(search) ||
        skinType.description?.toLowerCase().includes(search) ||
        skinType.recommendations?.some(rec => rec.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case 'skinType':
          valueA = a.skinType?.toLowerCase() || '';
          valueB = b.skinType?.toLowerCase() || '';
          break;
        case 'description':
          valueA = a.description?.toLowerCase() || '';
          valueB = b.description?.toLowerCase() || '';
          break;
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt || 0).getTime();
          valueB = new Date(b.createdAt || 0).getTime();
          break;
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredSkinTypes(result);
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

  // Fetch all skin types
  const fetchSkinTypes = async () => {
    try {
      setLoadingSkinTypes(true);
      setSkinTypeError(null);

      const response = await getSkinTypesAxios();

      if (response.error) {
        throw new Error(response.message || 'Failed to fetch skin types');
      }

      if (response.data) {
        setSkinTypes(Array.isArray(response.data) ? response.data : []);
      } else {
        setSkinTypes([]);
      }
    } catch (err) {
      console.error('Error fetching skin types:', err);
      setSkinTypeError(err.message || 'Failed to fetch skin types. Please try again.');
    } finally {
      setLoadingSkinTypes(false);
    }
  };

  // Get current page items (questions or skin types)
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    if (activeTab === 'questions') {
      return filteredQuestions.slice(startIndex, startIndex + PAGE_SIZE);
    } else {
      return filteredSkinTypes.slice(startIndex, startIndex + PAGE_SIZE);
    }
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    if (activeTab === 'questions') {
      applyQuestionsFiltersAndSort();
    } else {
      applySkinTypesFiltersAndSort();
    }
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

  // Function to switch between tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSortField('createdAt');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  // QUESTION FORM FUNCTIONS
  // Function to handle input change for question form
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

  // Generate the next question ID
  const generateNextQuestionId = () => {
    // Extract all existing IDs
    const existingIds = questions
      .map(q => q.questionId || '')
      .filter(id => id.startsWith('Q'))
      .map(id => parseInt(id.substring(1), 10))
      .filter(num => !isNaN(num));
    
    // Find the max number
    const maxNum = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    
    // Return the next ID
    return `Q${maxNum + 1}`;
  };

  // Validate question form
  const validateQuestionForm = () => {
    const errors = {};

    if (!formData.questionId?.trim()) {
      errors.questionId = 'Question ID is required';
    }

    if (!formData.questionText?.trim()) {
      errors.questionText = 'Question text is required';
    }

    const optionErrors = [];
    let hasOptionError = false;

    formData.options?.forEach((option, index) => {
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

  // Function to open create question modal
  const openCreateQuestionModal = () => {
    const nextQuestionId = generateNextQuestionId();
    
    setFormData({
      questionId: nextQuestionId,
      questionText: '',
      options: [{ text: '', points: 1, skinType: '' }],
      order: questions.length + 1,
      isActive: true
    });
    
    setFormErrors({});
    setShowCreateModal(true);
  };

  // Function to open edit question modal
  const openEditQuestionModal = (question) => {
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

  // Function to open delete question modal
  const openDeleteQuestionModal = (question) => {
    setCurrentQuestion(question);
    setShowDeleteModal(true);
  };

  // Function to create question
  const createQuestion = async () => {
    if (!validateQuestionForm()) {
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
    if (!validateQuestionForm()) {
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

  // SKIN TYPE FORM FUNCTIONS
  // Function to handle input change for skin type form
  const handleSkinTypeInputChange = (e) => {
    const { name, value } = e.target;
    setSkinTypeFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle recommendation change
  const handleRecommendationChange = (index, value) => {
    setSkinTypeFormData(prev => {
      const newRecommendations = [...prev.recommendations];
      newRecommendations[index] = value;
      return { ...prev, recommendations: newRecommendations };
    });
  };

  // Function to add recommendation
  const addRecommendation = () => {
    setSkinTypeFormData(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, '']
    }));
  };

  // Function to remove recommendation
  const removeRecommendation = (index) => {
    if (skinTypeFormData.recommendations.length <= 1) {
      return; // Keep at least one recommendation
    }
    
    setSkinTypeFormData(prev => {
      const newRecommendations = [...prev.recommendations];
      newRecommendations.splice(index, 1);
      return { ...prev, recommendations: newRecommendations };
    });
  };

  // Validate skin type form
  const validateSkinTypeForm = () => {
    const errors = {};

    if (!skinTypeFormData.skinType?.trim()) {
      errors.skinType = 'Skin type code is required';
    }

    if (!skinTypeFormData.description?.trim()) {
      errors.description = 'Description is required';
    }

    const recommendationErrors = [];
    let hasRecommendationError = false;

    skinTypeFormData.recommendations?.forEach((rec, index) => {
      if (!rec.trim()) {
        recommendationErrors[index] = 'Recommendation cannot be empty';
        hasRecommendationError = true;
      }
    });

    if (hasRecommendationError) {
      errors.recommendations = recommendationErrors;
    }

    setSkinTypeFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to open create skin type modal
  const openCreateSkinTypeModal = () => {
    setSkinTypeFormData({
      skinType: '',
      description: '',
      recommendations: ['']
    });
    
    setSkinTypeFormErrors({});
    setShowSkinTypeCreateModal(true);
  };

  // Function to open edit skin type modal
  const openEditSkinTypeModal = (skinType) => {
    setCurrentSkinType(skinType);
    
    setSkinTypeFormData({
      skinType: skinType.skinType || '',
      description: skinType.description || '',
      recommendations: skinType.recommendations?.length 
        ? [...skinType.recommendations]
        : ['']
    });
    
    setSkinTypeFormErrors({});
    setShowSkinTypeEditModal(true);
  };

  // Function to open delete skin type modal
  const openDeleteSkinTypeModal = (skinType) => {
    setCurrentSkinType(skinType);
    setShowSkinTypeDeleteModal(true);
  };

  // Function to create skin type
  const createSkinType = async () => {
    if (!validateSkinTypeForm()) {
      return;
    }

    try {
      setLoadingSkinTypes(true);

      const response = await createSkinTypeAxios(skinTypeFormData);

      if (response.error) {
        throw new Error(response.message || 'Failed to create skin type');
      }

      // Reset form and close modal
      setSkinTypeFormData({
        skinType: '',
        description: '',
        recommendations: ['']
      });
      
      setShowSkinTypeCreateModal(false);
      fetchSkinTypes();

    } catch (err) {
      console.error('Error creating skin type:', err);
      alert(err.message || 'Failed to create skin type. Please try again.');
    } finally {
      setLoadingSkinTypes(false);
    }
  };

  // Function to update skin type
  const updateSkinType = async () => {
    if (!validateSkinTypeForm()) {
      return;
    }

    try {
      setLoadingSkinTypes(true);

      const response = await updateSkinTypeAxios(currentSkinType.skinType, skinTypeFormData);

      if (response.error) {
        throw new Error(response.message || 'Failed to update skin type');
      }

      // Reset form and close modal
      setSkinTypeFormData({
        skinType: '',
        description: '',
        recommendations: ['']
      });
      
      setShowSkinTypeEditModal(false);
      fetchSkinTypes();

    } catch (err) {
      console.error('Error updating skin type:', err);
      alert(err.message || 'Failed to update skin type. Please try again.');
    } finally {
      setLoadingSkinTypes(false);
    }
  };

  // Function to delete skin type
  const deleteSkinType = async () => {
    try {
      setLoadingSkinTypes(true);

      // We would implement this if the API supports deleting skin types
      alert('Deleting skin types is not currently supported by the API');
      setShowSkinTypeDeleteModal(false);

    } catch (err) {
      console.error('Error deleting skin type:', err);
      alert(err.message || 'Failed to delete skin type. Please try again.');
    } finally {
      setLoadingSkinTypes(false);
    }
  };

  return (
    <div className={cx('quiz-management')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Skin Quiz Management</h2>
        <div className={cx('tab-buttons')}>
          <button
            className={cx('tab-button', { active: activeTab === 'questions' })}
            onClick={() => switchTab('questions')}
          >
            <FaQuestion /> Questions
          </button>
          <button
            className={cx('tab-button', { active: activeTab === 'skinTypes' })}
            onClick={() => switchTab('skinTypes')}
          >
            <FaSpa /> Skin Types
          </button>
        </div>
        {activeTab === 'questions' && (
          <button
            className={cx('create-button')}
            onClick={openCreateQuestionModal}
          >
            <FaPlus /> Add New Question
          </button>
        )}
        {activeTab === 'skinTypes' && (
          <button
            className={cx('create-button')}
            onClick={openCreateSkinTypeModal}
          >
            <FaPlus /> Add New Skin Type
          </button>
        )}
      </div>

      <div className={cx('tools')}>
        <form className={cx('search-form')} onSubmit={handleSearch}>
          <div className={cx('search-input-container')}>
            <input
              type="text"
              placeholder={activeTab === 'questions' ? "Search questions..." : "Search skin types..."}
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

      {/* QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <>
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
                onClick={openCreateQuestionModal}
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
                        className={cx('id-column', 'sortable')}
                        onClick={() => handleSort('questionId')}
                      >
                        ID {getSortIcon('questionId')}
                      </th>
                      <th
                        className={cx('question-column', 'sortable')}
                        onClick={() => handleSort('questionText')}
                      >
                        Question {getSortIcon('questionText')}
                      </th>
                      <th className={cx('options-column')}>Options</th>
                      <th className={cx('status-column')}>Status</th>
                      <th className={cx('actions-column')}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageItems().map(question => (
                      <tr key={question._id} className={cx({ 'inactive-row': !question.isActive })}>
                        <td className={cx('id-column')}>{question.questionId}</td>
                        <td className={cx('question-column')}>{question.questionText}</td>
                        <td className={cx('options-column')}>
                          <ul className={cx('options-list')}>
                            {question.options?.map((option, index) => (
                              <li key={index} className={cx('option-item')}>
                                <span className={cx('option-text')}>{option.text}</span>
                                <div className={cx('option-meta')}>
                                  <span className={cx('option-points')}>{option.points} pts</span>
                                  <span className={cx('option-skin-type')}>{option.skinType}</span>
                                </div>
                              </li>
                            )) || 'No options'}
                          </ul>
                        </td>
                        <td className={cx('status-column')}>
                          <span className={cx('status-badge', {
                            'active': question.isActive !== false,
                            'inactive': question.isActive === false
                          })}>
                            {question.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className={cx('actions-column')}>
                          <button
                            className={cx('action-button', 'edit')}
                            onClick={() => openEditQuestionModal(question)}
                            title="Edit question"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={cx('action-button', 'delete')}
                            onClick={() => openDeleteQuestionModal(question)}
                            title="Delete question"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* SKIN TYPES TAB */}
      {activeTab === 'skinTypes' && (
        <>
          {loadingSkinTypes && skinTypes.length === 0 ? (
            <div className={cx('loading')}>
              <div className={cx('loader')}></div>
              <p>Loading skin types...</p>
            </div>
          ) : skinTypeError ? (
            <div className={cx('error')}>
              <p>{skinTypeError}</p>
              <button onClick={fetchSkinTypes} className={cx('retry-button')}>
                Try Again
              </button>
            </div>
          ) : filteredSkinTypes.length === 0 ? (
            <div className={cx('empty-state')}>
              <FaSpa className={cx('empty-icon')} />
              <p>No skin types found</p>
              <button
                onClick={openCreateSkinTypeModal}
                className={cx('create-button')}
              >
                <FaPlus /> Add New Skin Type
              </button>
            </div>
          ) : (
            <>
              <div className={cx('table-container')}>
                <table className={cx('skin-types-table')}>
                  <thead>
                    <tr>
                      <th
                        className={cx('skin-type-column', 'sortable')}
                        onClick={() => handleSort('skinType')}
                      >
                        Skin Type {getSortIcon('skinType')}
                      </th>
                      <th
                        className={cx('description-column', 'sortable')}
                        onClick={() => handleSort('description')}
                      >
                        Description {getSortIcon('description')}
                      </th>
                      <th className={cx('recommendations-column')}>Recommendations</th>
                      <th className={cx('actions-column')}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageItems().map(skinType => (
                      <tr key={skinType._id}>
                        <td className={cx('skin-type-column')}>{skinType.skinType}</td>
                        <td className={cx('description-column')}>
                          <div className={cx('truncated-text')}>{skinType.description}</div>
                        </td>
                        <td className={cx('recommendations-column')}>
                          <ul className={cx('recommendations-list')}>
                            {skinType.recommendations?.map((rec, index) => (
                              <li key={index} className={cx('recommendation-item')}>
                                {rec}
                              </li>
                            )) || 'No recommendations'}
                          </ul>
                        </td>
                        <td className={cx('actions-column')}>
                          <button
                            className={cx('action-button', 'edit')}
                            onClick={() => openEditSkinTypeModal(skinType)}
                            title="Edit skin type"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={cx('action-button', 'delete')}
                            onClick={() => openDeleteSkinTypeModal(skinType)}
                            title="Delete skin type"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* Pagination - Shared for both tabs */}
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
              {Math.min(currentPage * PAGE_SIZE, 
                activeTab === 'questions' ? filteredQuestions.length : filteredSkinTypes.length)} of {
                activeTab === 'questions' ? filteredQuestions.length : filteredSkinTypes.length} {
                activeTab === 'questions' ? 'questions' : 'skin types'}
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
                      <div className={cx('option-form-group', 'option-text-group')}>
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

                      <div className={cx('option-form-group', 'option-points-group')}>
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

                      <div className={cx('option-form-group', 'option-skintype-group')}>
                        <select
                          value={option.skinType}
                          onChange={(e) => handleOptionChange(index, 'skinType', e.target.value)}
                          className={cx({ 'error-input': formErrors.options?.[index]?.skinType })}
                        >
                          <option value="">Select Skin Type</option>
                          {loadingSkinTypes ? (
                            <option disabled>Loading skin types...</option>
                          ) : (
                            skinTypes.map((type, idx) => (
                              <option key={idx} value={type.skinType}>
                                {type.skinType}
                              </option>
                            ))
                          )}
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
                      <div className={cx('option-form-group', 'option-text-group')}>
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

                      <div className={cx('option-form-group', 'option-points-group')}>
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

                      <div className={cx('option-form-group', 'option-skintype-group')}>
                        <select
                          value={option.skinType}
                          onChange={(e) => handleOptionChange(index, 'skinType', e.target.value)}
                          className={cx({ 'error-input': formErrors.options?.[index]?.skinType })}
                        >
                          <option value="">Select Skin Type</option>
                          {loadingSkinTypes ? (
                            <option disabled>Loading skin types...</option>
                          ) : (
                            skinTypes.map((type, idx) => (
                              <option key={idx} value={type.skinType}>
                                {type.skinType}
                              </option>
                            ))
                          )}
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

      {/* Delete Question Confirmation Modal */}
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
                <div><strong>ID:</strong> {currentQuestion?.questionId}</div>
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

      {/* Create Skin Type Modal */}
      {showSkinTypeCreateModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Create New Skin Type</h3>
              <button
                className={cx('close-button')}
                onClick={() => setShowSkinTypeCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('form-group')}>
                <label htmlFor="skinType">Skin Type Code</label>
                <input
                  type="text"
                  id="skinType"
                  name="skinType"
                  value={skinTypeFormData.skinType}
                  onChange={handleSkinTypeInputChange}
                  className={cx({ 'error-input': skinTypeFormErrors.skinType })}
                  placeholder="e.g. da_kho, da_dau, da_thuong"
                />
                {skinTypeFormErrors.skinType && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {skinTypeFormErrors.skinType}
                  </div>
                )}
                <div className={cx('form-help-text')}>
                  Use a unique code for this skin type (like da_kho, da_dau, etc.)
                </div>
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={skinTypeFormData.description}
                  onChange={handleSkinTypeInputChange}
                  className={cx({ 'error-input': skinTypeFormErrors.description })}
                  rows="4"
                ></textarea>
                {skinTypeFormErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {skinTypeFormErrors.description}
                  </div>
                )}
              </div>

              <div className={cx('form-group', 'recommendations-form-group')}>
                <div className={cx('recommendations-header')}>
                  <label>Recommendations</label>
                  <button
                    type="button"
                    onClick={addRecommendation}
                    className={cx('add-recommendation-button')}
                  >
                    <FaPlus /> Add Recommendation
                  </button>
                </div>

                {skinTypeFormData.recommendations.map((rec, index) => (
                  <div key={index} className={cx('recommendation-form-row')}>
                    <div className={cx('recommendation-form-group')}>
                      <input
                        type="text"
                        placeholder="Recommendation"
                        value={rec}
                        onChange={(e) => handleRecommendationChange(index, e.target.value)}
                        className={cx({ 'error-input': skinTypeFormErrors.recommendations?.[index] })}
                      />
                      {skinTypeFormErrors.recommendations?.[index] && (
                        <div className={cx('error-message')}>
                          <FaExclamationTriangle /> {skinTypeFormErrors.recommendations[index]}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRecommendation(index)}
                      className={cx('remove-recommendation-button')}
                      disabled={skinTypeFormData.recommendations.length <= 1}
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
                onClick={() => setShowSkinTypeCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={createSkinType}
                disabled={loadingSkinTypes}
              >
                {loadingSkinTypes ? 'Creating...' : 'Create Skin Type'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skin Type Modal */}
      {showSkinTypeEditModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Edit Skin Type</h3>
              <button
                className={cx('close-button')}
                onClick={() => setShowSkinTypeEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('form-group')}>
                <label htmlFor="edit-skinType">Skin Type Code</label>
                <input
                  type="text"
                  id="edit-skinType"
                  name="skinType"
                  value={skinTypeFormData.skinType}
                  className={cx({ 'error-input': skinTypeFormErrors.skinType })}
                  readOnly // Skin type code should not be editable
                />
                {skinTypeFormErrors.skinType && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {skinTypeFormErrors.skinType}
                  </div>
                )}
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={skinTypeFormData.description}
                  onChange={handleSkinTypeInputChange}
                  className={cx({ 'error-input': skinTypeFormErrors.description })}
                  rows="4"
                ></textarea>
                {skinTypeFormErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {skinTypeFormErrors.description}
                  </div>
                )}
              </div>

              <div className={cx('form-group', 'recommendations-form-group')}>
                <div className={cx('recommendations-header')}>
                  <label>Recommendations</label>
                  <button
                    type="button"
                    onClick={addRecommendation}
                    className={cx('add-recommendation-button')}
                  >
                    <FaPlus /> Add Recommendation
                  </button>
                </div>

                {skinTypeFormData.recommendations.map((rec, index) => (
                  <div key={index} className={cx('recommendation-form-row')}>
                    <div className={cx('recommendation-form-group')}>
                      <input
                        type="text"
                        placeholder="Recommendation"
                        value={rec}
                        onChange={(e) => handleRecommendationChange(index, e.target.value)}
                        className={cx({ 'error-input': skinTypeFormErrors.recommendations?.[index] })}
                      />
                      {skinTypeFormErrors.recommendations?.[index] && (
                        <div className={cx('error-message')}>
                          <FaExclamationTriangle /> {skinTypeFormErrors.recommendations[index]}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRecommendation(index)}
                      className={cx('remove-recommendation-button')}
                      disabled={skinTypeFormData.recommendations.length <= 1}
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
                onClick={() => setShowSkinTypeEditModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={updateSkinType}
                disabled={loadingSkinTypes}
              >
                {loadingSkinTypes ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Skin Type Confirmation Modal */}
      {showSkinTypeDeleteModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal', 'delete-modal')}>
            <div className={cx('modal-header')}>
              <h3>Confirm Deletion</h3>
              <button
                className={cx('close-button')}
                onClick={() => setShowSkinTypeDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={cx('modal-body')}>
              <p>Are you sure you want to delete this skin type?</p>
              <div className={cx('skin-type-preview')}>
                <div><strong>Skin Type:</strong> {currentSkinType?.skinType}</div>
                <div><strong>Description:</strong> {currentSkinType?.description}</div>
              </div>
              <p className={cx('delete-warning')}>
                <FaExclamationTriangle /> This action cannot be undone. Deleting a skin type may impact quiz questions that reference it.
              </p>
            </div>
            <div className={cx('modal-footer')}>
              <button
                className={cx('cancel-button')}
                onClick={() => setShowSkinTypeDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('delete-button')}
                onClick={deleteSkinType}
                disabled={loadingSkinTypes}
              >
                {loadingSkinTypes ? 'Deleting...' : 'Delete Skin Type'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizManagement;