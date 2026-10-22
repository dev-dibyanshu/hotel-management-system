import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/departments');
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
      console.error('Error fetching departments:', err);
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
      name: '',
      description: ''
    });
    setEditingDepartment(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.put(`/api/departments/${editingDepartment.id}`, formData);
      } else {
        await api.post('/api/departments', formData);
      }
      fetchDepartments();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department');
      console.error('Error saving department:', err);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete department');
        console.error('Error deleting department:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading departments...</div>;
  }

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Department Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Department'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingDepartment ? 'Edit Department' : 'Add New Department'}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-group">
              <label htmlFor="name">Department Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Department description, responsibilities, or notes"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingDepartment ? 'Update Department' : 'Add Department'}
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
              <th>Department Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No departments found</td>
              </tr>
            ) : (
              departments.map(department => (
                <tr key={department.id}>
                  <td><strong>{department.name}</strong></td>
                  <td>{department.description || '-'}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(department)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(department.id)}
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

export default Departments;
