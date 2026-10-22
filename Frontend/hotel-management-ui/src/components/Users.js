import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Receptionist'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'Receptionist'
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // For update, only send changed fields
        const updatePayload = {
          username: formData.username,
          role: formData.role
        };
        // Only include password if it was changed
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        await api.put(`/api/auth/users/${editingUser.id}`, updatePayload);
      } else {
        await api.post('/api/auth/users', formData);
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
      console.error('Error saving user:', err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      password: '', // Don't populate password for security
      role: user.role || 'Receptionist'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/auth/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Owner':
        return 'role-owner';
      case 'Manager':
        return 'role-manager';
      case 'Receptionist':
        return 'role-receptionist';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>User Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password {editingUser ? '(leave blank to keep current)' : '*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
              />
              {!editingUser && (
                <small className="field-hint">
                  Password should be at least 8 characters with uppercase, lowercase, and numbers
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="Receptionist">Receptionist</option>
                <option value="Manager">Manager</option>
                <option value="Owner">Owner</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.username}</strong></td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
