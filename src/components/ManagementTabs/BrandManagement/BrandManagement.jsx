// src/pages/BrandManagement/BrandManagement.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './BrandManagement.module.scss';
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
  FaTag,
  FaExclamationTriangle
} from 'react-icons/fa';
import {
  getBrandsPaginatedAxios,
  searchBrandsAxios,
  getBrandByIdAxios,
  createBrandAxios,
  updateBrandAxios,
  deleteBrandAxios
} from '~/services/brandAxios';

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

function BrandManagement() {
  // State for brand list and filtering
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  
  // Disable body scroll when any modal is open
  useDisableBodyScroll(showCreateModal || showEditModal || showDeleteModal);

  // Fetch brands when component mounts or when page changes
  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  // Function to fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      // If there's a search term, use the search endpoint
      if (searchTerm.trim()) {
        const response = await searchBrandsAxios(searchTerm);

        if (response.error) {
          throw new Error(response.message || 'Failed to search brands');
        }

        if (response.data) {
          // Apply sorting to search results
          const brandsData = response.data;
          sortBrandsData(brandsData);
          
          setBrands(brandsData);
          setTotalItems(brandsData.length);
          setTotalPages(Math.ceil(brandsData.length / PAGE_SIZE));
        } else {
          setBrands([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } else {
        // Otherwise use the paginated endpoint
        const response = await getBrandsPaginatedAxios(currentPage, PAGE_SIZE);

        if (response.error) {
          throw new Error(response.message || 'Failed to fetch brands');
        }

        if (response.data) {
          const brandsData = response.data.brands || [];
          
          // Apply sorting if needed
          sortBrandsData(brandsData);
          
          setBrands(brandsData);
          
          // Update pagination based on meta data
          if (response.data.meta) {
            setTotalItems(response.data.meta.numberBrands || 0);
            setTotalPages(response.data.meta.totalPages || 1);
          }
        } else {
          setBrands([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message || 'Failed to load brands. Please try again.');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to sort brands data
  const sortBrandsData = (data) => {
    if (!sortField) return;
    
    data.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle special cases for different field types
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (sortField === 'name') {
        valueA = valueA?.toString().toLowerCase() || '';
        valueB = valueB?.toString().toLowerCase() || '';
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBrands();
  };

  // Function to handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Apply sorting to current data immediately
    const sortedBrands = [...brands].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      // Handle special cases for different field types
      if (field === 'createdAt' || field === 'updatedAt') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (field === 'name') {
        valueA = valueA?.toString().toLowerCase() || '';
        valueB = valueB?.toString().toLowerCase() || '';
      }
      
      if ((sortField === field && sortDirection === 'asc') || 
          (sortField !== field && sortDirection === 'desc')) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });
    
    setBrands(sortedBrands);
  };

  // Function to get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Brand name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Brand description is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setCurrentBrand(null);
    setFormErrors({});
  };

  // Function to open edit modal
  const openEditModal = async (brand) => {
    try {
      setLoading(true);

      // Fetch detailed brand info
      const response = await getBrandByIdAxios(brand._id);

      if (response.error) {
        throw new Error(response.message || 'Failed to fetch brand details');
      }

      const brandData = response.data || brand;

      setCurrentBrand(brandData);

      // Set form data with the fetched brand info
      setFormData({
        name: brandData.name || '',
        description: brandData.description || ''
      });

      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching brand details:', err);
      alert('Failed to load brand details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to open delete modal
  const openDeleteModal = (brand) => {
    setCurrentBrand(brand);
    setShowDeleteModal(true);
  };

  // Function to create a brand
  const createBrand = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const brandData = {
        name: formData.name,
        description: formData.description
      };

      const response = await createBrandAxios(brandData);

      if (response.error) {
        throw new Error(response.message || 'Failed to create brand');
      }

      // Success - refresh brand list and close modal
      fetchBrands();
      resetForm();
      setShowCreateModal(false);

    } catch (err) {
      console.error('Error creating brand:', err);
      alert(err.message || 'Failed to create brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a brand
  const updateBrand = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const brandData = {
        name: formData.name,
        description: formData.description
      };

      const response = await updateBrandAxios(currentBrand._id, brandData);

      if (response.error) {
        throw new Error(response.message || 'Failed to update brand');
      }

      // Success - refresh brand list and close modal
      fetchBrands();
      resetForm();
      setShowEditModal(false);

    } catch (err) {
      console.error('Error updating brand:', err);
      alert(err.message || 'Failed to update brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a brand
  const deleteBrand = async () => {
    try {
      setLoading(true);

      const response = await deleteBrandAxios(currentBrand._id);

      if (response.error) {
        throw new Error(response.message || 'Failed to delete brand');
      }

      // Success - refresh brand list and close modal
      fetchBrands();
      setShowDeleteModal(false);

    } catch (err) {
      console.error('Error deleting brand:', err);
      alert(err.message || 'Failed to delete brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={cx('brand-management')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Brand Management</h2>
        <button
          className={cx('create-button')}
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Add New Brand
        </button>
      </div>

      <div className={cx('tools')}>
        <form className={cx('search-form')} onSubmit={handleSearch}>
          <div className={cx('search-input-container')}>
            <input
              type="text"
              placeholder="Search brands..."
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
          onClick={() => {
            setSearchTerm('');
            setSortField('createdAt');
            setSortDirection('desc');
            setCurrentPage(1);
            fetchBrands();
          }}
        >
          <FaUndo /> Reset Filters
        </button>
      </div>

      {loading && brands.length === 0 ? (
        <div className={cx('loading')}>
          <div className={cx('loader')}></div>
          <p>Loading brands...</p>
        </div>
      ) : error ? (
        <div className={cx('error')}>
          <p>{error}</p>
          <button onClick={fetchBrands} className={cx('retry-button')}>
            Try Again
          </button>
        </div>
      ) : brands.length === 0 ? (
        <div className={cx('empty-state')}>
          <FaTag className={cx('empty-icon')} />
          <p>No brands found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className={cx('create-button')}
          >
            <FaPlus /> Add New Brand
          </button>
        </div>
      ) : (
        <>
          <div className={cx('brand-table-container')}>
            <table className={cx('brand-table')}>
              <thead>
                <tr>
                  <th
                    className={cx('name-column', 'sortable')}
                    onClick={() => handleSort('name')}
                  >
                    Brand Name {getSortIcon('name')}
                  </th>
                  <th className={cx('description-column')}>
                    Description
                  </th>
                  <th
                    className={cx('date-column', 'sortable')}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At {getSortIcon('createdAt')}
                  </th>
                  <th className={cx('actions-column')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(brand => (
                  <tr key={brand._id}>
                    <td className={cx('name-column')}>{brand.name}</td>
                    <td className={cx('description-column')}>
                      <div className={cx('truncated-text')}>
                        {brand.description}
                      </div>
                    </td>
                    <td className={cx('date-column')}>{formatDate(brand.createdAt)}</td>
                    <td className={cx('actions-column')}>
                      <button
                        className={cx('action-button', 'edit')}
                        onClick={() => openEditModal(brand)}
                        title="Edit brand"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={cx('action-button', 'delete')}
                        onClick={() => openDeleteModal(brand)}
                        title="Delete brand"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={cx('pagination')}>
              <div className={cx('pagination-buttons')}>
                <button
                  className={cx('page-button', 'prev')}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  className={cx('page-button', 'next')}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
              <div className={cx('page-info-container')}>
                <span className={cx('page-info')}>
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}-
                  {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} brands
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Brand Modal */}
      {showCreateModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Create New Brand</h3>
              <button
                className={cx('close-button')}
                onClick={() => {
                  resetForm();
                  setShowCreateModal(false);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('form-group')}>
                <label htmlFor="name">Brand Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.name })}
                  required
                />
                {formErrors.name && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.name}
                  </div>
                )}
              </div>

              <div className={cx('form-group')}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={cx({ 'error-input': formErrors.description })}
                  required
                />
                {formErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.description}
                  </div>
                )}
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <button
                className={cx('cancel-button')}
                onClick={() => {
                  resetForm();
                  setShowCreateModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={createBrand}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Brand'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Edit Brand</h3>
              <button
                className={cx('close-button')}
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('form-group')}>
                <label htmlFor="edit-name">Brand Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.name })}
                  required
                />
                {formErrors.name && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.name}
                  </div>
                )}
              </div>

              <div className={cx('form-group')}>
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={cx({ 'error-input': formErrors.description })}
                  required
                />
                {formErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.description}
                  </div>
                )}
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <button
                className={cx('cancel-button')}
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className={cx('submit-button')}
                onClick={updateBrand}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Brand'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              <p>Are you sure you want to delete the brand <strong>{currentBrand?.name}</strong>?</p>
              <p className={cx('delete-warning')}>
                <FaExclamationTriangle /> This action cannot be undone. Products associated with this brand may be affected.
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
                onClick={deleteBrand}
              >
                {loading ? 'Deleting...' : 'Delete Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandManagement;