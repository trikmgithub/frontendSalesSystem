// src/components/StaffProductManagement/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductManagement.module.scss';
import { 
  FaEdit, 
  FaTrashAlt, 
  FaEye, 
  FaEyeSlash, 
  FaPlus, 
  FaSearch, 
  FaSort, 
  FaSortAmountDown, 
  FaSortAmountUp, 
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck,
  FaImage,
  FaExclamationTriangle
} from 'react-icons/fa';
import * as itemAxios from '~/services/itemAxios';
import { getAllBrandsAxios } from '~/services/brandAxios';

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

function ProductManagement() {
  // State for product list and filtering
  const [products, setProducts] = useState([]);
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
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // State for new product form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 1,
    brand: {},
    images: [], // Will store file objects
    imageUrls: [], // For the API
    flashSale: false
  });
  
  // State for brands (to populate dropdowns)
  const [brands, setBrands] = useState([]);

  // Fetch products when component mounts or when page, sort, or search changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortDirection]);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // If there's a search term, use the fuzzy search endpoint
      if (searchTerm.trim()) {
        const response = await itemAxios.searchItemsAxios(searchTerm);
        
        if (response && response.data) {
          setProducts(response.data);
          setTotalItems(response.data.length);
          setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
        }
      } else {
        // Otherwise use the paginated endpoint
        const response = await itemAxios.getItemsPaginatedAxios(currentPage, PAGE_SIZE);
        
        if (response && response.data && response.data.paginateItem) {
          setProducts(response.data.paginateItem.result);
          setTotalItems(response.data.paginateItem.meta.numberItems);
          setTotalPages(response.data.paginateItem.meta.totalPages);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch brands when component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

  // Function to fetch brands
  const fetchBrands = async () => {
    try {
      const response = await getAllBrandsAxios();
      if (response && response.data) {
        setBrands(response.data);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Could not load brands. Please try again.');
    }
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchProducts();
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

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Helper function to compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          // Calculate new dimensions (max width/height of 800px)
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL (0.7 quality JPEG)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (formData.quantity < 0 || !Number.isInteger(Number(formData.quantity))) {
      errors.quantity = 'Quantity must be a non-negative integer';
    }
    
    if (!formData.brand._id) {
      errors.brand = 'Brand is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    // Validate at least one image
    if (formData.images.length === 0 && formData.imageUrls.length === 0) {
      errors.images = 'At least one image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to create a product
  const createProduct = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare product data with original files instead of base64
      const productData = {
        ...formData,
        imageFiles: formData.images // Use the actual File objects
      };
      
      const response = await itemAxios.createItemAxios(productData);
      
      if (response && response.data) {
        // Clear form and refresh product list
        resetForm();
        setShowCreateModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a product
  const updateProduct = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create product data for the update
      // Note: For updating, we don't need to send images
      const productData = {
        ...formData,
        // Keep only the data needed for the update
        name: formData.name,
        price: formData.price,
        description: formData.description,
        quantity: formData.quantity,
        brand: formData.brand
      };
      
      const response = await itemAxios.updateItemAxios(currentProduct._id, productData);
      
      if (response && response.data) {
        // Clear form and refresh product list
        resetForm();
        setShowEditModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product
  const deleteProduct = async () => {
    try {
      setLoading(true);
      
      const response = await itemAxios.deleteItemAxios(currentProduct._id);
      
      if (response) {
        setShowDeleteModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to hide/show a product (soft delete)
  const toggleProductVisibility = async (productId, isHidden) => {
    try {
      setLoading(true);
      
      const response = await itemAxios.hideItemAxios(productId, !isHidden);
      
      if (response) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Error updating product visibility:', err);
      setError('Failed to update product visibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'quantity') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'brand') {
      // Handle brand as object
      setFormData(prev => ({ 
        ...prev, 
        brand: { _id: value } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file upload for images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Restrict to a maximum of 3 images
    const totalImages = formData.images.length + files.length;
    if (totalImages > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    
    // Check file types
    const invalidFiles = files.filter(
      file => !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      alert('Only JPG and PNG image formats are allowed');
      return;
    }
    
    // Process each file
    const newImages = [...formData.images];
    const newImageUrls = [...formData.imageUrls];
    
    files.forEach(file => {
      // Create a URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      newImages.push(file);
      newImageUrls.push(fileUrl); // This will be temporary for preview only
    });
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
      imageUrls: newImageUrls
    }));
  };
  
  // Remove an image
  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newImageUrls = [...formData.imageUrls];
    
    // If it's a file we uploaded, revoke the object URL to prevent memory leaks
    if (newImages[index]) {
      URL.revokeObjectURL(newImageUrls[index]);
    }
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
      imageUrls: newImageUrls
    }));
  };

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 1,
      brand: {},
      images: [],
      imageUrls: [],
      flashSale: false
    });
    setCurrentProduct(null);
  };

  // Function to open edit modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    
    // For editing, we'll need to fetch the existing images
    const existingImageUrls = product.imageUrls?.length ? product.imageUrls : [];
    
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      quantity: product.quantity || 1,
      brand: product.brand || {},
      images: [], // Start with empty images array since we can't access file objects
      imageUrls: existingImageUrls, // But keep the existing image URLs
      flashSale: product.flashSale || false
    });
    setShowEditModal(true);
  };

  // Function to open delete modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div className={cx('product-management')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Product Management</h2>
        <button 
          className={cx('create-button')}
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className={cx('tools')}>
        <form className={cx('search-form')} onSubmit={handleSearch}>
          <div className={cx('search-input-container')}>
            <input
              type="text"
              placeholder="Search products..."
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
            fetchProducts();
          }}
        >
          <FaUndo /> Reset Filters
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className={cx('loading')}>
          <div className={cx('loader')}></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className={cx('error')}>
          <p>{error}</p>
          <button onClick={fetchProducts} className={cx('retry-button')}>
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className={cx('empty-state')}>
          <FaImage className={cx('empty-icon')} />
          <p>No products found</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className={cx('create-button')}
          >
            <FaPlus /> Add New Product
          </button>
        </div>
      ) : (
        <>
          <div className={cx('product-table-container')}>
            <table className={cx('product-table')}>
              <thead>
                <tr>
                  <th className={cx('image-column')}>Image</th>
                  <th 
                    className={cx('name-column', 'sortable')}
                    onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th 
                    className={cx('price-column', 'sortable')}
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIcon('price')}
                  </th>
                  <th 
                    className={cx('stock-column', 'sortable')}
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity {getSortIcon('quantity')}
                  </th>
                  <th className={cx('brand-column')}>Brand</th>
                  <th className={cx('flash-sale-column')}>Flash Sale</th>
                  <th className={cx('actions-column')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className={cx({ 'hidden-row': product.hidden })}>
                    <td className={cx('image-column')}>
                      <img 
                        src={product.imageUrls?.[0] || '/placeholder-image.jpg'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </td>
                    <td className={cx('name-column')}>{product.name}</td>
                    <td className={cx('price-column')}>{formatPrice(product.price)}</td>
                    <td className={cx('stock-column')}>
                      <span className={cx({
                        'in-stock': product.quantity > 10,
                        'low-stock': product.quantity > 0 && product.quantity <= 10,
                        'out-of-stock': product.quantity === 0
                      })}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className={cx('brand-column')}>{product.brand?.name || '-'}</td>
                    <td className={cx('flash-sale-column')}>
                      {product.flashSale ? <FaCheck className={cx('flash-sale-icon')} /> : <FaTimes />}
                    </td>
                    <td className={cx('actions-column')}>
                      <button 
                        className={cx('action-button', 'edit')}
                        onClick={() => openEditModal(product)}
                        title="Edit product"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={cx('action-button', 'delete')}
                        onClick={() => openDeleteModal(product)}
                        title="Delete product"
                      >
                        <FaTrashAlt />
                      </button>
                      <button 
                        className={cx('action-button', product.hidden ? 'show' : 'hide')}
                        onClick={() => toggleProductVisibility(product._id, product.hidden)}
                        title={product.hidden ? "Show product" : "Hide product"}
                      >
                        {product.hidden ? <FaEye /> : <FaEyeSlash />}
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
              <span className={cx('page-info')}>
                Showing {((currentPage - 1) * PAGE_SIZE) + 1}-
                {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} products
              </span>
            </div>
          )}
        </>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Create New Product</h3>
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
                <label htmlFor="name">Product Name</label>
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
                  rows="4"
                  className={cx({ 'error-input': formErrors.description })}
                />
                {formErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.description}
                  </div>
                )}
              </div>
                              <div className={cx('form-row')}>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="price">Price (VND)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                    className={cx({ 'error-input': formErrors.price })}
                  />
                  {formErrors.price && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.price}
                    </div>
                  )}
                </div>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className={cx({ 'error-input': formErrors.quantity })}
                  />
                  {formErrors.quantity && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.quantity}
                    </div>
                  )}
                </div>
              </div>
              <div className={cx('form-group')}>
                <label htmlFor="brand">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand._id || ''}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.brand })}
                >
                  <option value="">Select a brand</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {formErrors.brand && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.brand}
                  </div>
                )}
              </div>
              <div className={cx('form-group')}>
                <label>Product Images (Maximum 3)</label>
                <div className={cx('image-upload-container')}>
                  <div className={cx('image-previews')}>
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className={cx('image-preview-item')}>
                        <img 
                          src={url} 
                          alt={`Product ${index + 1}`} 
                          className={cx('image-preview')}
                        />
                        <button 
                          type="button"
                          className={cx('remove-image-button')}
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    
                    {/* Show upload button if less than 3 images */}
                    {formData.imageUrls.length < 3 && (
                      <label className={cx('image-upload-button')}>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleImageUpload}
                          multiple={formData.imageUrls.length < 2} // Allow multiple only if we can accept more than 1
                          className={cx('file-input')}
                        />
                        <FaPlus /> Upload Image
                      </label>
                    )}
                  </div>
                </div>
                {formErrors.images && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.images}
                  </div>
                )}
                <div className={cx('image-upload-help')}>
                  Upload up to 3 JPG or PNG images. Max 1MB per image recommended.
                </div>
              </div>
              <div className={cx('form-group')}>
                <label>Flash Sale Status</label>
                <div className={cx('toggle-container')}>
                  <button
                    type="button"
                    className={cx('toggle-button', { active: formData.flashSale })}
                    onClick={() => setFormData(prev => ({ ...prev, flashSale: !prev.flashSale }))}
                  >
                    <div className={cx('toggle-slider')}>
                      <div className={cx('toggle-knob')}></div>
                    </div>
                    <span className={cx('toggle-label')}>
                      {formData.flashSale ? 'On Sale' : 'Regular Price'}
                    </span>
                  </button>
                </div>
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
                onClick={createProduct}
                disabled={!formData.name || formData.price < 0 || loading}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Edit Product</h3>
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
              {/* Same form as create, but pre-filled with product data */}
              <div className={cx('form-group')}>
                <label htmlFor="name">Product Name</label>
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
                <label htmlFor="description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={cx({ 'error-input': formErrors.description })}
                />
                {formErrors.description && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.description}
                  </div>
                )}
              </div>
              <div className={cx('form-row')}>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="price">Price (VND)</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                    className={cx({ 'error-input': formErrors.price })}
                  />
                  {formErrors.price && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.price}
                    </div>
                  )}
                </div>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="edit-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className={cx({ 'error-input': formErrors.quantity })}
                  />
                  {formErrors.quantity && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.quantity}
                    </div>
                  )}
                </div>
              </div>
              <div className={cx('form-group')}>
                <label htmlFor="brand">Brand</label>
                <select
                  id="edit-brand"
                  name="brand"
                  value={formData.brand._id || ''}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.brand })}
                >
                  <option value="">Select a brand</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {formErrors.brand && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.brand}
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
                onClick={updateProduct}
                disabled={!formData.name || formData.price < 0 || loading}
              >
                {loading ? 'Updating...' : 'Update Product'}
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
              <p>Are you sure you want to delete the product <strong>{currentProduct?.name}</strong>?</p>
              <p className={cx('delete-warning')}>This action cannot be undone.</p>
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
                onClick={deleteProduct}
              >
                {loading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;