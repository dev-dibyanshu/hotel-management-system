import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Bills.css';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);
  const [formData, setFormData] = useState({
    billingNumber: '',
    date: '',
    taxes: 0,
    billItems: [
      { service: '', unit: '', quantity: 1, price: 0 }
    ]
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bills');
      setBills(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bills');
      console.error('Error fetching bills:', err);
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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.billItems];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      billItems: newItems
    }));
  };

  const addBillItem = () => {
    setFormData(prev => ({
      ...prev,
      billItems: [...prev.billItems, { service: '', unit: '', quantity: 1, price: 0 }]
    }));
  };

  const removeBillItem = (index) => {
    if (formData.billItems.length > 1) {
      const newItems = formData.billItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        billItems: newItems
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.billItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.price || 0));
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxes = parseFloat(formData.taxes || 0);
    return subtotal + taxes;
  };

  const resetForm = () => {
    setFormData({
      billingNumber: '',
      date: '',
      taxes: 0,
      billItems: [
        { service: '', unit: '', quantity: 1, price: 0 }
      ]
    });
    setEditingBill(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        taxes: parseFloat(formData.taxes),
        total: calculateTotal(),
        billItems: formData.billItems.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };
      
      if (editingBill) {
        await api.put(`/api/bills/${editingBill.id}`, payload);
      } else {
        await api.post('/api/bills', payload);
      }
      fetchBills();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
      console.error('Error saving bill:', err);
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      billingNumber: bill.billingNumber || '',
      date: bill.date?.split('T')[0] || '',
      taxes: bill.taxes || 0,
      billItems: bill.billItems && bill.billItems.length > 0 
        ? bill.billItems.map(item => ({
            service: item.service || '',
            unit: item.unit || '',
            quantity: item.quantity || 1,
            price: item.price || 0
          }))
        : [{ service: '', unit: '', quantity: 1, price: 0 }]
    });
    setShowForm(true);
  };

  const handleView = (bill) => {
    setViewingBill(bill);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/api/bills/${id}`);
        fetchBills();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bill');
        console.error('Error deleting bill:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="loading">Loading bills...</div>;
  }

  return (
    <div className="bills-container">
      <div className="page-header">
        <h1>Bill Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Bill'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="bill-form-container">
          <h2>{editingBill ? 'Edit Bill' : 'Create New Bill'}</h2>
          <form onSubmit={handleSubmit} className="bill-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingNumber">Billing Number *</label>
                <input
                  type="text"
                  id="billingNumber"
                  name="billingNumber"
                  value={formData.billingNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., BILL001"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={getTodayDate()}
                  required
                />
              </div>
            </div>

            <div className="bill-items-section">
              <div className="bill-items-header">
                <h3>Bill Items</h3>
                <button 
                  type="button" 
                  className="btn-add-item"
                  onClick={addBillItem}
                >
                  + Add Item
                </button>
              </div>

              {formData.billItems.map((item, index) => (
                <div key={index} className="bill-item">
                  <div className="bill-item-row">
                    <div className="form-group">
                      <label>Service *</label>
                      <input
                        type="text"
                        value={item.service}
                        onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                        placeholder="e.g., Room Service"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Unit *</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        placeholder="e.g., Night, Item"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Total</label>
                      <input
                        type="text"
                        value={`$${(item.quantity * item.price).toFixed(2)}`}
                        readOnly
                        className="readonly-input"
                      />
                    </div>
                    {formData.billItems.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeBillItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bill-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="amount">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <label htmlFor="taxes">Taxes:</label>
                <input
                  type="number"
                  id="taxes"
                  name="taxes"
                  step="0.01"
                  value={formData.taxes}
                  onChange={handleInputChange}
                  min="0"
                  className="taxes-input"
                />
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span className="amount">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingBill ? 'Update Bill' : 'Create Bill'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewingBill && (
        <div className="bill-modal-overlay" onClick={() => setViewingBill(null)}>
          <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bill-modal-header">
              <h2>Bill Details</h2>
              <button 
                className="btn-close"
                onClick={() => setViewingBill(null)}
              >
                ×
              </button>
            </div>
            <div className="bill-modal-content">
              <div className="bill-info">
                <p><strong>Billing Number:</strong> {viewingBill.billingNumber}</p>
                <p><strong>Date:</strong> {formatDate(viewingBill.date)}</p>
              </div>
              <table className="bill-items-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingBill.billItems?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.service}</td>
                      <td>{item.unit}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bill-modal-summary">
                <div className="summary-row">
                  <span>Taxes:</span>
                  <span>${viewingBill.taxes?.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${viewingBill.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Billing Number</th>
              <th>Date</th>
              <th>Items</th>
              <th>Taxes</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No bills found</td>
              </tr>
            ) : (
              bills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.billingNumber}</td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{bill.billItems?.length || 0} items</td>
                  <td>${bill.taxes?.toFixed(2)}</td>
                  <td className="total-amount">${bill.total?.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-view" 
                      onClick={() => handleView(bill)}
                    >
                      View
                    </button>
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(bill)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(bill.id)}
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

export default Bills;
