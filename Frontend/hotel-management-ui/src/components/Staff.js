import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    employeeName: '',
    employeeAddress: '',
    nic: '',
    salary: 0,
    age: 18,
    occupation: '',
    email: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/staff');
      setStaff(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
      console.error('Error fetching staff:', err);
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
      code: '',
      employeeName: '',
      employeeAddress: '',
      nic: '',
      salary: 0,
      age: 18,
      occupation: '',
      email: ''
    });
    setEditingStaff(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
        age: parseInt(formData.age)
      };
      
      if (editingStaff) {
        await api.put(`/api/staff/${editingStaff.id}`, payload);
      } else {
        await api.post('/api/staff', payload);
      }
      fetchStaff();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save staff member');
      console.error('Error saving staff:', err);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      code: staffMember.code || '',
      employeeName: staffMember.employeeName || '',
      employeeAddress: staffMember.employeeAddress || '',
      nic: staffMember.nic || '',
      salary: staffMember.salary || 0,
      age: staffMember.age || 18,
      occupation: staffMember.occupation || '',
      email: staffMember.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/api/staff/${id}`);
        fetchStaff();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete staff member');
        console.error('Error deleting staff:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Staff Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="code">Employee Code *</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name *</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nic">NIC *</label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="employeeAddress">Address *</label>
              <textarea
                id="employeeAddress"
                name="employeeAddress"
                value={formData.employeeAddress}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="occupation">Occupation *</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="e.g., Receptionist, Housekeeper"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                step="0.01"
                value={formData.salary}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingStaff ? 'Update Staff' : 'Add Staff'}
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
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>NIC</th>
              <th>Occupation</th>
              <th>Age</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No staff members found</td>
              </tr>
            ) : (
              staff.map(member => (
                <tr key={member.id}>
                  <td>{member.code}</td>
                  <td>{member.employeeName}</td>
                  <td>{member.email}</td>
                  <td>{member.nic}</td>
                  <td>{member.occupation}</td>
                  <td>{member.age}</td>
                  <td className="price-cell">${member.salary?.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(member.id)}
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

export default Staff;
