import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const Rates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    day: '',
    numberOfGuests: 1,
    firstNightPrice: 0,
    extensionPrice: 0
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/rates');
      setRates(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rates');
      console.error('Error fetching rates:', err);
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
      checkIn: '',
      checkOut: '',
      day: '',
      numberOfGuests: 1,
      firstNightPrice: 0,
      extensionPrice: 0
    });
    setEditingRate(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests),
        firstNightPrice: parseFloat(formData.firstNightPrice),
        extensionPrice: parseFloat(formData.extensionPrice)
      };
      
      if (editingRate) {
        await api.put(`/api/rates/${editingRate.id}`, payload);
      } else {
        await api.post('/api/rates', payload);
      }
      fetchRates();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rate');
      console.error('Error saving rate:', err);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      checkIn: rate.checkIn?.split('T')[0] || '',
      checkOut: rate.checkOut?.split('T')[0] || '',
      day: rate.day || '',
      numberOfGuests: rate.numberOfGuests || 1,
      firstNightPrice: rate.firstNightPrice || 0,
      extensionPrice: rate.extensionPrice || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      try {
        await api.delete(`/api/rates/${id}`);
        fetchRates();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete rate');
        console.error('Error deleting rate:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading rates...</div>;
  }

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Rate Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Rate'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingRate ? 'Edit Rate' : 'Add New Rate'}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkIn">Check-In Date *</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="checkOut">Check-Out Date *</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="day">Day *</label>
                <input
                  type="text"
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday, Weekend"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numberOfGuests">Number of Guests *</label>
                <input
                  type="number"
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstNightPrice">First Night Price *</label>
                <input
                  type="number"
                  id="firstNightPrice"
                  name="firstNightPrice"
                  step="0.01"
                  value={formData.firstNightPrice}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="extensionPrice">Extension Price *</label>
                <input
                  type="number"
                  id="extensionPrice"
                  name="extensionPrice"
                  step="0.01"
                  value={formData.extensionPrice}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingRate ? 'Update Rate' : 'Add Rate'}
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
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Day</th>
              <th>Guests</th>
              <th>First Night</th>
              <th>Extension</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No rates found</td>
              </tr>
            ) : (
              rates.map(rate => (
                <tr key={rate.id}>
                  <td>{formatDate(rate.checkIn)}</td>
                  <td>{formatDate(rate.checkOut)}</td>
                  <td>{rate.day}</td>
                  <td>{rate.numberOfGuests}</td>
                  <td className="price-cell">${rate.firstNightPrice?.toFixed(2)}</td>
                  <td className="price-cell">${rate.extensionPrice?.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(rate)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(rate.id)}
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

export default Rates;
