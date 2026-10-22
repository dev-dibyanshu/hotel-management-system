import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    billId: '',
    total: '',
    paymentTime: '',
    creditCardDetails: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, billsRes] = await Promise.all([
        api.get('/api/payments'),
        api.get('/api/bills')
      ]);
      setPayments(paymentsRes.data);
      setBills(billsRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
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

  const handleBillSelect = (e) => {
    const billId = e.target.value;
    const selectedBill = bills.find(b => b.id === parseInt(billId));
    
    setFormData(prev => ({
      ...prev,
      billId: billId,
      total: selectedBill ? selectedBill.total.toString() : ''
    }));
  };

  const resetForm = () => {
    setFormData({
      billId: '',
      total: '',
      paymentTime: '',
      creditCardDetails: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        billId: parseInt(formData.billId),
        total: parseFloat(formData.total),
        paymentTime: new Date(formData.paymentTime).toISOString(),
        creditCardDetails: formData.creditCardDetails
      };
      
      await api.post('/api/payments', payload);
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payment');
      console.error('Error saving payment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await api.delete(`/api/payments/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete payment');
        console.error('Error deleting payment:', err);
      }
    }
  };

  const getBillNumber = (billId) => {
    const bill = bills.find(b => b.id === billId);
    return bill ? bill.billingNumber : 'Unknown';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const maskCardDetails = (details) => {
    if (!details || details.length < 4) return '****';
    return `**** **** **** ${details.slice(-4)}`;
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="payments-container">
      <div className="page-header">
        <h1>Payment Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Record Payment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="payment-form-container">
          <h2>Record New Payment</h2>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billId">Select Bill *</label>
                <select
                  id="billId"
                  name="billId"
                  value={formData.billId}
                  onChange={handleBillSelect}
                  required
                >
                  <option value="">Select a Bill</option>
                  {bills.map(bill => (
                    <option key={bill.id} value={bill.id}>
                      {bill.billingNumber} - ${bill.total?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="total">Total Amount *</label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  step="0.01"
                  value={formData.total}
                  onChange={handleInputChange}
                  readOnly
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paymentTime">Payment Date & Time *</label>
              <input
                type="datetime-local"
                id="paymentTime"
                name="paymentTime"
                value={formData.paymentTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="creditCardDetails">Credit Card Details *</label>
              <input
                type="text"
                id="creditCardDetails"
                name="creditCardDetails"
                value={formData.creditCardDetails}
                onChange={handleInputChange}
                placeholder="Last 4 digits or payment reference"
                required
              />
              <small className="field-hint">
                Note: Only store last 4 digits for security. Never store full card numbers.
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Record Payment
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Bill Number</th>
              <th>Amount</th>
              <th>Payment Time</th>
              <th>Card Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No payments found</td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td>{getBillNumber(payment.billId)}</td>
                  <td className="amount-cell">${payment.total?.toFixed(2)}</td>
                  <td>{formatDateTime(payment.paymentTime)}</td>
                  <td>{maskCardDetails(payment.creditCardDetails)}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(payment.id)}
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

export default Payments;
