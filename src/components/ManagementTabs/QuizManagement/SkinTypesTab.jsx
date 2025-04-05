// src/components/ManagementTabs/QuizManagement/SkinTypesTab.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './QuizManagement.module.scss';
import useDisableBodyScroll from '~/hooks/useDisableBodyScroll';
import { toast } from 'react-toastify';
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
  FaSpa,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  getSkinTypesAxios,
  getSkinTypeDetailsAxios,
  createSkinTypeAxios,
  updateSkinTypeAxios,
  deleteSkinTypeAxios,
} from '~/services/quizAxios';

const cx = classNames.bind(styles);
const PAGE_SIZE = 10;

function SkinTypesTab() {
  // State for skin types
  const [skinTypes, setSkinTypes] = useState([]);
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
  const [filteredSkinTypes, setFilteredSkinTypes] = useState([]);

  // State for skin type modals and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSkinType, setCurrentSkinType] = useState(null);
  const [skinTypeFormData, setSkinTypeFormData] = useState({
    skinType: '',
    description: '',
    recommendations: ['']
  });
  const [skinTypeFormErrors, setSkinTypeFormErrors] = useState({});

  // Use hook to disable body scroll when modal is open
  useDisableBodyScroll(showCreateModal || showEditModal || showDeleteModal);

  // Fetch skin types when component mounts
  useEffect(() => {
    fetchSkinTypes();
  }, []);

  // Filter and sort skin types whenever they change
  useEffect(() => {
    applySkinTypesFiltersAndSort();
  }, [skinTypes, searchTerm, sortField, sortDirection]);

  // Update filtered skin types
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

  // Fetch all skin types
  const fetchSkinTypes = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError(err.message || 'Failed to fetch skin types. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSkinTypes.slice(startIndex, startIndex + PAGE_SIZE);
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    applySkinTypesFiltersAndSort();
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
    setShowCreateModal(true);
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
    setShowEditModal(true);
  };

  // Function to open delete skin type modal
  const openDeleteSkinTypeModal = (skinType) => {
    setCurrentSkinType(skinType);
    setShowDeleteModal(true);
  };

  // Function to create skin type
  const createSkinType = async () => {
    if (!validateSkinTypeForm()) {
      return;
    }

    try {
      setLoading(true);

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

      setShowCreateModal(false);
      fetchSkinTypes();
      toast.success('Skin type created successfully');

    } catch (err) {
      console.error('Error creating skin type:', err);
      toast.error(err.message || 'Failed to create skin type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update skin type
  const updateSkinType = async () => {
    if (!validateSkinTypeForm()) {
      return;
    }

    try {
      setLoading(true);

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

      setShowEditModal(false);
      fetchSkinTypes();
      toast.success('Skin type updated successfully');

    } catch (err) {
      console.error('Error updating skin type:', err);
      toast.error(err.message || 'Failed to update skin type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete skin type
  const deleteSkinType = async () => {
    try {
      setLoading(true);

      const response = await deleteSkinTypeAxios(currentSkinType.skinType);

      if (response.error) {
        throw new Error(response.message || 'Failed to delete skin type');
      }

      // Close modal and refresh data
      setShowDeleteModal(false);
      fetchSkinTypes();
      toast.success('Skin type deleted successfully');

    } catch (err) {
      console.error('Error deleting skin type:', err);
      toast.error(err.message || 'Failed to delete skin type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hidden button for create trigger from parent */}
      <button
        id="create-skin-type-btn"
        onClick={openCreateSkinTypeModal}
        style={{ display: 'none' }}
      />

      <div className={cx('tools')}>
        <form className={cx('search-form')} onSubmit={handleSearch}>
          <div className={cx('search-input-container')}>
            <input
              type="text"
              placeholder="Search skin types..."
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

      {loading && skinTypes.length === 0 ? (
        <div className={cx('loading')}>
          <div className={cx('loader')}></div>
          <p>Loading skin types...</p>
        </div>
      ) : error ? (
        <div className={cx('error')}>
          <p>{error}</p>
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
            <table className={cx('questions-table')}>
              <thead>
                <tr>
                  <th
                    className={cx('skin-type-column', 'sortable')}
                    onClick={() => handleSort('skinType')}
                  >
                    Skin Type {getSortIcon('skinType')}
                  </th>
                  <th className={cx('description-column')}>
                    Description
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
                      <ul className={cx('options-list')}>
                        {skinType.recommendations?.map((rec, index) => (
                          <li key={index} className={cx('option-item')}>
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
              {Math.min(currentPage * PAGE_SIZE, filteredSkinTypes.length)} of {
                filteredSkinTypes.length} skin types
            </span>
          </div>
        </div>
      )}

      {/* Create Skin Type Modal */}
      {showCreateModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Create New Skin Type</h3>
              <button
                className={cx('close-button')}
                onClick={() => setShowCreateModal(false)}
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

              <div className={cx('form-group', 'options-form-group')}>
                <div className={cx('options-header')}>
                  <label>Recommendations</label>
                  <button
                    type="button"
                    onClick={addRecommendation}
                    className={cx('add-option-button')}
                  >
                    <FaPlus /> Add Recommendation
                  </button>
                </div>

                {skinTypeFormData.recommendations.map((rec, index) => (
                  <div key={index} className={cx('option-form-row')}>
                    <div className={cx('option-form-group')}>
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
                      className={cx('remove-option-button')}
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
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={createSkinType}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Skin Type'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skin Type Modal */}
      {showEditModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Edit Skin Type</h3>
              <button
                className={cx('close-button')}
                onClick={() => setShowEditModal(false)}
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

              <div className={cx('form-group', 'options-form-group')}>
                <div className={cx('options-header')}>
                  <label>Recommendations</label>
                  <button
                    type="button"
                    onClick={addRecommendation}
                    className={cx('add-option-button')}
                  >
                    <FaPlus /> Add Recommendation
                  </button>
                </div>

                {skinTypeFormData.recommendations.map((rec, index) => (
                  <div key={index} className={cx('option-form-row')}>
                    <div className={cx('option-form-group')}>
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
                      className={cx('remove-option-button')}
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
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={updateSkinType}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Skin Type Confirmation Modal */}
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
              <p>Are you sure you want to delete this skin type?</p>
              <div className={cx('question-preview')}>
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
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={cx('delete-button')}
                onClick={deleteSkinType}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Skin Type'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SkinTypesTab;