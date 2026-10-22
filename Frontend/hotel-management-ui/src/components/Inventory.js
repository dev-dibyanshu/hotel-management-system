import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 0,
    description: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/inventory');
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
      console.error('Error fetching inventory:', err);
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
      itemName: '',
      quantity: 0,
      description: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity)
      };
      
      if (editingItem) {
        await api.put(`/api/inventory/${editingItem.id}`, payload);
      } else {
        await api.post('/api/inventory', payload);
      }
      fetchInventory();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save inventory item');
      console.error('Error saving inventory:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName || '',
      quantity: item.quantity || 0,
      description: item.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await api.delete(`/api/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete inventory item');
        console.error('Error deleting inventory:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="management-container">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-group">
              <label htmlFor="itemName">Item Name *</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
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
                placeholder="Item description, specifications, or notes"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingItem ? 'Update Item' : 'Add Item'}
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
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No inventory items found</td>
              </tr>
            ) : (
              inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>
                    <span className={`quantity-badge ${item.quantity < 10 ? 'low-stock' : ''}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.description || '-'}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(item.id)}
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

export default Inventory;
