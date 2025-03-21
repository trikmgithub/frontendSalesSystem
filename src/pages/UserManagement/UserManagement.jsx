// src/pages/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserManagement.module.scss';
import { 
  FaEdit, 
  FaTrashAlt, 
  FaLock,
  FaUnlock,
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
  FaUserAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  getUsersAxios, 
  getUserByIdAxios, 
  createUserAxios, 
  updateUserAxios, 
  deleteUserAxios 
} from '~/services/userAxios';

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

function UserManagement() {
  // State for user list and filtering
  const [users, setUsers] = useState([]);
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
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for new user form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    gender: '',
    dateOfBirth: '',
    address: '',
    confirmPassword: '' // This is for frontend validation only, not sent to API
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  // Function to fetch users using the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUsersAxios(currentPage, PAGE_SIZE);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch users');
      }
      
      if (response.data && response.data.result) {
        setUsers(response.data.result);
        
        // Update pagination based on meta data
        if (response.data.meta) {
          setTotalItems(response.data.meta.numberUsers || 0);
          setTotalPages(response.data.meta.totalPages || 1);
        }
      } else {
        setUsers([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or when page, sort, or search changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
    // Note: This is a simple implementation. For actual search, 
    // we would need a separate API endpoint or filter on the frontend
  };

  // Function to handle sort (client-side since the API doesn't support sorting)
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Apply sorting to the current data
    const sortedUsers = [...users].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      // Handle dates
      if (field === 'createdAt') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setUsers(sortedUsers);
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

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (showCreateModal && !formData.password) {
      errors.password = 'Password is required';
    }
    
    if (showCreateModal && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      email: '',
      password: '',
      role: 'USER',
      gender: '',
      dateOfBirth: '',
      address: '',
      confirmPassword: ''
    });
    setCurrentUser(null);
    setFormErrors({});
  };

  // Function to open edit modal and fetch user details
  const openEditModal = async (user) => {
    try {
      setLoading(true);
      
      // Fetch detailed user info
      const response = await getUserByIdAxios(user._id);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch user details');
      }
      
      const userData = response.data || user;
      
      setCurrentUser(userData);
      
      // Set form data with the fetched user info
      setFormData({
        _id: userData._id,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.roleId || 'USER', // This might need adjustment based on API response
        gender: userData.gender || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        address: userData.address || '',
        password: '',
        confirmPassword: ''
      });
      
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      alert('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to open delete modal
  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Function to toggle user active status (soft delete/undelete)
  const toggleUserStatus = async (userId, isDeleted) => {
    try {
      setLoading(true);
      
      // If already deleted, we would need an "undelete" endpoint
      // For now, we only support deletion
      if (!isDeleted) {
        const response = await deleteUserAxios(userId);
        
        if (response.error) {
          throw new Error(response.message || 'Failed to update user status');
        }
        
        // Update UI optimistically
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? { ...user, isDeleted: true } : user
          )
        );
        
        // Refresh data to ensure UI is in sync with backend
        fetchUsers();
      } else {
        // Future implementation: undelete user
        alert('Restoring deleted users is not currently supported');
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to update user status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to create a user
  const createUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare user data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };
      
      const response = await createUserAxios(userData);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to create user');
      }
      
      // Success - refresh user list and close modal
      fetchUsers();
      resetForm();
      setShowCreateModal(false);
      
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a user
  const updateUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare user data for API
      const userData = {
        _id: currentUser._id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };
      
      // Only include password if it was changed
      if (formData.password) {
        userData.password = formData.password;
      }
      
      const response = await updateUserAxios(userData);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to update user');
      }
      
      // Success - refresh user list and close modal
      fetchUsers();
      resetForm();
      setShowEditModal(false);
      
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user
  const deleteUser = async () => {
    try {
      setLoading(true);
      
      const response = await deleteUserAxios(currentUser._id);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to delete user');
      }
      
      // Success - refresh user list and close modal
      fetchUsers();
      setShowDeleteModal(false);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.message || 'Failed to delete user. Please try again.');
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

  // Helper function to map roleId to a display name
  const getRoleDisplay = (roleId) => {
    // This is a simplified mapping - adjust based on your system's role IDs
    const roleMap = {
      '67bbe4fd48a9a527b0332e4e': 'USER',
      '67bbe4fd48a9a527b0332e4f': 'STAFF',
      '67bbe4fd48a9a527b0332e50': 'ADMIN'
    };
    
    return roleMap[roleId] || 'USER';
  };

  // Get role badge class
  const getRoleBadgeClass = (roleId) => {
    const role = getRoleDisplay(roleId);
    
    switch (role) {
      case 'ADMIN':
        return 'roleBadgeAdmin';
      case 'STAFF':
        return 'roleBadgeStaff';
      default:
        return 'roleBadgeUser';
    }
  };

  return (
    <div className={cx('user-management')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>User Management</h2>
        <button 
          className={cx('create-button')}
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Add New User
        </button>
      </div>

      <div className={cx('tools')}>
        <form className={cx('search-form')} onSubmit={handleSearch}>
          <div className={cx('search-input-container')}>
            <input
              type="text"
              placeholder="Search users..."
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
            fetchUsers();
          }}
        >
          <FaUndo /> Reset Filters
        </button>
      </div>

      {loading && users.length === 0 ? (
        <div className={cx('loading')}>
          <div className={cx('loader')}></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className={cx('error')}>
          <p>{error}</p>
          <button onClick={fetchUsers} className={cx('retry-button')}>
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className={cx('empty-state')}>
          <FaUserAlt className={cx('empty-icon')} />
          <p>No users found</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className={cx('create-button')}
          >
            <FaPlus /> Add New User
          </button>
        </div>
      ) : (
        <>
          <div className={cx('user-table-container')}>
            <table className={cx('user-table')}>
              <thead>
                <tr>
                  <th className={cx('avatar-column')}>Avatar</th>
                  <th 
                    className={cx('name-column', 'sortable')}
                    onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th 
                    className={cx('email-column', 'sortable')}
                    onClick={() => handleSort('email')}
                  >
                    Email {getSortIcon('email')}
                  </th>
                  <th className={cx('role-column')}>Role</th>
                  <th 
                    className={cx('date-column', 'sortable')}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At {getSortIcon('createdAt')}
                  </th>
                  <th className={cx('status-column')}>Status</th>
                  <th className={cx('actions-column')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className={cx({ 'inactive-row': user.isDeleted })}>
                    <td className={cx('avatar-column')}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className={cx('user-avatar')}
                        />
                      ) : (
                        <div className={cx('avatar-placeholder')}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </td>
                    <td className={cx('name-column')}>{user.name}</td>
                    <td className={cx('email-column')}>{user.email}</td>
                    <td className={cx('role-column')}>
                      <span className={cx('role-badge', getRoleBadgeClass(user.roleId))}>
                        {getRoleDisplay(user.roleId)}
                      </span>
                    </td>
                    <td className={cx('date-column')}>{formatDate(user.createdAt)}</td>
                    <td className={cx('status-column')}>
                      <span className={cx('status-badge', user.isDeleted ? 'inactive' : 'active')}>
                        {user.isDeleted ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className={cx('actions-column')}>
                      <button 
                        className={cx('action-button', 'edit')}
                        onClick={() => openEditModal(user)}
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={cx('action-button', 'delete')}
                        onClick={() => openDeleteModal(user)}
                        title="Delete user"
                      >
                        <FaTrashAlt />
                      </button>
                      <button 
                        className={cx('action-button', user.isDeleted ? 'unlock' : 'lock')}
                        onClick={() => toggleUserStatus(user._id, user.isDeleted)}
                        title={user.isDeleted ? "Activate user" : "Deactivate user"}
                      >
                        {user.isDeleted ? <FaUnlock /> : <FaLock />}
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
                  {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} users
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Create New User</h3>
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
                <label htmlFor="name">Full Name</label>
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
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.email })}
                  required
                />
                {formErrors.email && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.email}
                  </div>
                )}
              </div>
              
              <div className={cx('form-row')}>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cx({ 'error-input': formErrors.password })}
                    required
                  />
                  {formErrors.password && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.password}
                    </div>
                  )}
                </div>
                
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cx({ 'error-input': formErrors.confirmPassword })}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={cx('form-row')}>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="role">User Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={cx({ 'error-input': formErrors.role })}
                  >
                    <option value="67bbe4fd48a9a527b0332e4e">Regular User</option>
                    <option value="67bbe4fd48a9a527b0332e4f">Staff</option>
                    <option value="67bbe4fd48a9a527b0332e50">Administrator</option>
                  </select>
                </div>
                
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
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
                onClick={createUser}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3>Edit User</h3>
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
                <label htmlFor="edit-name">Full Name</label>
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
                <label htmlFor="edit-email">Email Address</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cx({ 'error-input': formErrors.email })}
                  required
                />
                {formErrors.email && (
                  <div className={cx('error-message')}>
                    <FaExclamationTriangle /> {formErrors.email}
                  </div>
                )}
              </div>
              
              <div className={cx('form-row')}>
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="edit-role">User Role</label>
                  <select
                    id="edit-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="67bbe4fd48a9a527b0332e4e">Regular User</option>
                    <option value="67bbe4fd48a9a527b0332e4f">Staff</option>
                    <option value="67bbe4fd48a9a527b0332e50">Administrator</option>
                  </select>
                </div>
                
                <div className={cx('form-group', 'half')}>
                  <label htmlFor="edit-gender">Gender</label>
                  <select
                    id="edit-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="edit-dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="edit-dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={cx('form-group')}>
                <label htmlFor="edit-address">Address</label>
                <textarea
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={cx('form-group')}>
                <p className={cx('password-note')}>
                  <FaExclamationTriangle /> Leave password fields empty if you don't want to change the password.
                </p>
                
                <div className={cx('form-row')}>
                  <div className={cx('form-group', 'half')}>
                    <label htmlFor="edit-password">New Password</label>
                    <input
                      type="password"
                      id="edit-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cx({ 'error-input': formErrors.password })}
                    />
                    {formErrors.password && (
                      <div className={cx('error-message')}>
                        <FaExclamationTriangle /> {formErrors.password}
                      </div>
                    )}
                  </div>
                  
                  <div className={cx('form-group', 'half')}>
                    <label htmlFor="edit-confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cx({ 'error-input': formErrors.confirmPassword })}
                    />
                    {formErrors.confirmPassword && (
                      <div className={cx('error-message')}>
                        <FaExclamationTriangle /> {formErrors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
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
                onClick={updateUser}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update User'}
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
              <p>Are you sure you want to deactivate the user <strong>{currentUser?.name}</strong>?</p>
              <p className={cx('delete-warning')}>This user will be marked as inactive.</p>
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
                onClick={deleteUser}
              >
                {loading ? 'Deactivating...' : 'Deactivate User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;