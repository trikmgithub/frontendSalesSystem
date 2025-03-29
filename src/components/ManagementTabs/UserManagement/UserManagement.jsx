// src/pages/UserManagement/UserManagement.jsx - Updated version
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserManagement.module.scss';
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
import { getRoleByIdAxios } from '~/services/roleAxios';

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

function UserManagement() {
  // State for user list and filtering
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
    role: 'user',
    gender: '',
    dateOfBirth: '',
    address: '',
    confirmPassword: ''
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  // State for role names cache
  const [roleNames, setRoleNames] = useState({});
  
  // Disable body scroll when any modal is open
  useDisableBodyScroll(showCreateModal || showEditModal || showDeleteModal);

  // Function to fetch role name by roleId
  const fetchRoleName = async (roleId) => {
    // Return from cache if available
    if (roleNames[roleId]) {
      return roleNames[roleId];
    }

    try {
      const response = await getRoleByIdAxios(roleId);

      if (response.error) {
        console.error('Error fetching role:', response.message);
        return 'Unknown';
      }

      // Get the role name from the API response
      const roleName = response.data?.name?.toLowerCase() || 'unknown';

      // Cache the role name
      setRoleNames(prev => ({
        ...prev,
        [roleId]: roleName
      }));

      return roleName;
    } catch (error) {
      console.error('Error in fetchRoleName:', error);
      return 'unknown';
    }
  };

  // Function to fetch users using the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users we can get (or use a larger limit if needed)
      const response = await getUsersAxios(1, 50);

      if (response.error) {
        throw new Error(response.message || 'Failed to fetch users');
      }

      if (response.data && response.data.result) {
        const allUsers = response.data.result;
        
        // Store all users and set initial filtered users to all users
        setUsers(allUsers);
        setFilteredUsers(allUsers);

        // Update pagination based on filtered results
        updatePagination(allUsers);

        // Fetch role names for all users
        for (const user of allUsers) {
          if (user.roleId && !roleNames[user.roleId]) {
            await fetchRoleName(user.roleId);
          }
        }
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to update pagination based on filtered results
  const updatePagination = (userList) => {
    setTotalItems(userList.length);
    setTotalPages(Math.ceil(userList.length / PAGE_SIZE));
    // If current page is now invalid, reset to page 1
    if (currentPage > Math.ceil(userList.length / PAGE_SIZE)) {
      setCurrentPage(1);
    }
  };

  // Fetch users when component mounts - only once
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle search (client-side filtering)
  const handleSearch = (e) => {
    e.preventDefault();
    
    // If search term is empty, show all users
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      updatePagination(users);
      setCurrentPage(1);
      return;
    }
    
    // Filter users based on search term (case-insensitive)
    const term = searchTerm.toLowerCase().trim();
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(term) || 
      user.email?.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
    updatePagination(filtered);
    setCurrentPage(1);
  };

  // Function to handle sort (client-side since the API doesn't support sorting)
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }

    // Apply sorting to the current filtered data
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    sortUsersList(field, newDirection);
  };
  
  // Function to sort users list
  const sortUsersList = (field, direction) => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // Handle dates
      if (field === 'createdAt') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredUsers(sortedUsers);
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
  
  // Get current page of users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredUsers.slice(startIndex, endIndex);
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

    if (!formData.role) {
      errors.role = 'Role is required';
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
      role: 'user', // Default role
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

      // Get role name for this user's roleId
      let roleName = 'user'; // Default
      if (userData.roleId) {
        roleName = await fetchRoleName(userData.roleId);
      }

      // Set form data with the fetched user info
      setFormData({
        _id: userData._id,
        name: userData.name || '',
        email: userData.email || '',
        role: roleName,
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

  // Function to create a user
  const createUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare user data for API - send role name directly
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role, // Send role name directly
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

      // Prepare user data for API - send role name directly
      const userData = {
        _id: currentUser._id,
        name: formData.name,
        email: formData.email,
        role: formData.role, // Send role name directly
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

      // Success - refresh the user list and close modal
      const updatedUsers = users.map(u => 
        u._id === userData._id ? { ...u, ...userData } : u
      );
      setUsers(updatedUsers);
      
      // Re-apply any filtering
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const filtered = updatedUsers.filter(user => 
          user.name?.toLowerCase().includes(term) || 
          user.email?.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(updatedUsers);
      }
      
      resetForm();
      setShowEditModal(false);

    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to permanently delete a user
  const deleteUser = async () => {
    try {
      setLoading(true);

      const response = await deleteUserAxios(currentUser._id);

      if (response.error) {
        throw new Error(response.message || 'Failed to delete user');
      }

      // Success - refresh user list and close modal
      alert('User has been permanently deleted from the database.');
      
      // Remove user from both arrays
      const updatedUsers = users.filter(u => u._id !== currentUser._id);
      setUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter(u => u._id !== currentUser._id));
      
      // Update pagination
      updatePagination(filteredUsers.filter(u => u._id !== currentUser._id));
      
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

  // Get role badge class based on role name
  const getRoleBadgeClass = (roleName) => {
    if (!roleName) return 'roleBadgeUser'; // Default for unknown roles

    const role = roleName.toLowerCase();

    switch (role) {
      case 'admin':
      case 'manager': 
        return 'roleBadgeAdmin';
      case 'staff':
        return 'roleBadgeStaff';
      default:
        return 'roleBadgeUser';
    }
  };

  // Capitalize first letter for display
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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

      {loading && filteredUsers.length === 0 ? (
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
      ) : filteredUsers.length === 0 ? (
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
                  <th className={cx('actions-column')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageUsers().map(user => (
                  <tr key={user._id}>
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
                      <span className={cx('role-badge', getRoleBadgeClass(roleNames[user.roleId]))}>
                        {capitalizeFirstLetter(roleNames[user.roleId] || 'Loading...')}
                      </span>
                    </td>
                    <td className={cx('date-column')}>{formatDate(user.createdAt)}</td>
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
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                  {formErrors.role && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.role}
                    </div>
                  )}
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
                    className={cx({ 'error-input': formErrors.role })}
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                  {formErrors.role && (
                    <div className={cx('error-message')}>
                      <FaExclamationTriangle /> {formErrors.role}
                    </div>
                  )}
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
              <p>Are you sure you want to permanently delete the user <strong>{currentUser?.name}</strong>?</p>
              <p className={cx('delete-warning')}>
                <FaExclamationTriangle /> Warning: This action cannot be undone! All user data will be permanently removed from the database.
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
                onClick={deleteUser}
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;