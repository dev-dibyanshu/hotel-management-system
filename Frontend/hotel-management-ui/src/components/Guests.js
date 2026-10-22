import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    memberCode: '',
    phoneNumber: '',
    companyName: '',
    email: '',
    gender: '',
    address: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/guests');
      setGuests(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch guests');
      console.error('Error fetching guests:', err);
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
      memberCode: '',
      phoneNumber: '',
      companyName: '',
      email: '',
      gender: '',
      address: ''
    });
    setEditingGuest(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        await api.put(`/api/guests/${editingGuest.id}`, formData);
      } else {
        await api.post('/api/guests', formData);
      }
      fetchGuests();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save guest');
      console.error('Error saving guest:', err);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      memberCode: guest.memberCode || '',
      phoneNumber: guest.phoneNumber || '',
      companyName: guest.companyName || '',
      email: guest.email || '',
      gender: guest.gender || '',
      address: guest.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await api.delete(`/api/guests/${id}`);
        fetchGuests();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete guest');
        console.error('Error deleting guest:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading guests...</div>;
  }

  return (
    <div className="guests-container">
      <div className="page-header">
        <h1>Guest Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Guest'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="guest-form-container">
          <h2>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
          <form onSubmit={handleSubmit} className="guest-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memberCode">Member Code *</label>
                <input
                  type="text"
                  id="memberCode"
                  name="memberCode"
                  value={formData.memberCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingGuest ? 'Update Guest' : 'Add Guest'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="guests-table-container">
        <table className="guests-table">
          <thead>
            <tr>
              <th>Member Code</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Company</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No guests found</td>
              </tr>
            ) : (
              guests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.memberCode}</td>
                  <td>{guest.phoneNumber}</td>
                  <td>{guest.email}</td>
                  <td>{guest.gender}</td>
                  <td>{guest.companyName || '-'}</td>
                  <td className="address-cell">{guest.address}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(guest)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(guest.id)}
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

export default Guests;
