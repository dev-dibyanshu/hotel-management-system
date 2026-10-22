import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    guestId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    status: 'Confirmed'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, guestsRes, roomsRes] = await Promise.all([
        api.get('/api/reservations'),
        api.get('/api/guests'),
        api.get('/api/rooms')
      ]);
      setReservations(reservationsRes.data);
      setGuests(guestsRes.data);
      setRooms(roomsRes.data);
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

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const resetForm = () => {
    setFormData({
      code: '',
      guestId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfAdults: 1,
      numberOfChildren: 0,
      status: 'Confirmed'
    });
    setEditingReservation(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }

    try {
      const payload = {
        ...formData,
        guestId: parseInt(formData.guestId),
        roomId: parseInt(formData.roomId),
        numberOfAdults: parseInt(formData.numberOfAdults),
        numberOfChildren: parseInt(formData.numberOfChildren),
        numberOfNights: calculateNights()
      };
      
      if (editingReservation) {
        await api.put(`/api/reservations/${editingReservation.id}`, payload);
      } else {
        await api.post('/api/reservations', payload);
      }
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save reservation');
      console.error('Error saving reservation:', err);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      code: reservation.code || '',
      guestId: reservation.guestId?.toString() || '',
      roomId: reservation.roomId?.toString() || '',
      checkInDate: reservation.checkInDate?.split('T')[0] || '',
      checkOutDate: reservation.checkOutDate?.split('T')[0] || '',
      numberOfAdults: reservation.numberOfAdults || 1,
      numberOfChildren: reservation.numberOfChildren || 0,
      status: reservation.status || 'Confirmed'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await api.delete(`/api/reservations/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete reservation');
        console.error('Error deleting reservation:', err);
      }
    }
  };

  const getGuestName = (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.memberCode} - ${guest.email}` : 'Unknown';
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'Unknown';
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
    return <div className="loading">Loading reservations...</div>;
  }

  return (
    <div className="reservations-container">
      <div className="page-header">
        <h1>Reservation Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Reservation'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="reservation-form-container">
          <h2>{editingReservation ? 'Edit Reservation' : 'New Reservation'}</h2>
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="code">Reservation Code *</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., RES001"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="CheckedIn">Checked In</option>
                  <option value="CheckedOut">Checked Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="guestId">Guest *</label>
                <select
                  id="guestId"
                  name="guestId"
                  value={formData.guestId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Guest</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>
                      {guest.memberCode} - {guest.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="roomId">Room *</label>
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} ({room.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkInDate">Check-In Date *</label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="checkOutDate">Check-Out Date *</label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  min={formData.checkInDate || getTodayDate()}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numberOfAdults">Number of Adults *</label>
                <input
                  type="number"
                  id="numberOfAdults"
                  name="numberOfAdults"
                  value={formData.numberOfAdults}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numberOfChildren">Number of Children</label>
                <input
                  type="number"
                  id="numberOfChildren"
                  name="numberOfChildren"
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                />
              </div>
            </div>

            {calculateNights() > 0 && (
              <div className="nights-display">
                Total Nights: <strong>{calculateNights()}</strong>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingReservation ? 'Update Reservation' : 'Create Reservation'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No reservations found</td>
              </tr>
            ) : (
              reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.code}</td>
                  <td>{getGuestName(reservation.guestId)}</td>
                  <td>Room {getRoomNumber(reservation.roomId)}</td>
                  <td>{formatDate(reservation.checkInDate)}</td>
                  <td>{formatDate(reservation.checkOutDate)}</td>
                  <td>{reservation.numberOfNights}</td>
                  <td>
                    A: {reservation.numberOfAdults}, C: {reservation.numberOfChildren}
                  </td>
                  <td>
                    <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(reservation)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(reservation.id)}
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

export default Reservations;
