import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Rooms.css';

const Rooms = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Room form data
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    status: 'Available'
  });

  // RoomType form data
  const [roomTypeFormData, setRoomTypeFormData] = useState({
    typeName: '',
    description: '',
    services: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'rooms') {
        const [roomsRes, typesRes] = await Promise.all([
          api.get('/api/rooms'),
          api.get('/api/roomtypes')
        ]);
        setRooms(roomsRes.data);
        setRoomTypes(typesRes.data);
      } else {
        const response = await api.get('/api/roomtypes');
        setRoomTypes(response.data);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomTypeInputChange = (e) => {
    const { name, value } = e.target;
    setRoomTypeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setRoomFormData({
      roomNumber: '',
      roomTypeId: '',
      status: 'Available'
    });
    setRoomTypeFormData({
      typeName: '',
      description: '',
      services: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...roomFormData,
        roomTypeId: parseInt(roomFormData.roomTypeId)
      };
      
      if (editingItem) {
        await api.put(`/api/rooms/${editingItem.id}`, payload);
      } else {
        await api.post('/api/rooms', payload);
      }
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
      console.error('Error saving room:', err);
    }
  };

  const handleRoomTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/api/roomtypes/${editingItem.id}`, roomTypeFormData);
      } else {
        await api.post('/api/roomtypes', roomTypeFormData);
      }
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room type');
      console.error('Error saving room type:', err);
    }
  };

  const handleEditRoom = (room) => {
    setEditingItem(room);
    setRoomFormData({
      roomNumber: room.roomNumber || '',
      roomTypeId: room.roomTypeId?.toString() || '',
      status: room.status || 'Available'
    });
    setShowForm(true);
  };

  const handleEditRoomType = (roomType) => {
    setEditingItem(roomType);
    setRoomTypeFormData({
      typeName: roomType.typeName || '',
      description: roomType.description || '',
      services: roomType.services || ''
    });
    setShowForm(true);
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/api/rooms/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete room');
        console.error('Error deleting room:', err);
      }
    }
  };

  const handleDeleteRoomType = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await api.delete(`/api/roomtypes/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete room type');
        console.error('Error deleting room type:', err);
      }
    }
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    return roomType ? roomType.typeName : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="rooms-container">
      <div className="page-header">
        <h1>Room Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : `+ Add ${activeTab === 'rooms' ? 'Room' : 'Room Type'}`}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => { setActiveTab('rooms'); resetForm(); }}
        >
          Rooms
        </button>
        <button 
          className={`tab ${activeTab === 'roomTypes' ? 'active' : ''}`}
          onClick={() => { setActiveTab('roomTypes'); resetForm(); }}
        >
          Room Types
        </button>
      </div>

      {showForm && activeTab === 'rooms' && (
        <div className="form-container">
          <h2>{editingItem ? 'Edit Room' : 'Add New Room'}</h2>
          <form onSubmit={handleRoomSubmit} className="room-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomNumber">Room Number *</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={roomFormData.roomNumber}
                  onChange={handleRoomInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roomTypeId">Room Type *</label>
                <select
                  id="roomTypeId"
                  name="roomTypeId"
                  value={roomFormData.roomTypeId}
                  onChange={handleRoomInputChange}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.typeName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={roomFormData.status}
                onChange={handleRoomInputChange}
                required
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingItem ? 'Update Room' : 'Add Room'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && activeTab === 'roomTypes' && (
        <div className="form-container">
          <h2>{editingItem ? 'Edit Room Type' : 'Add New Room Type'}</h2>
          <form onSubmit={handleRoomTypeSubmit} className="room-form">
            <div className="form-group">
              <label htmlFor="typeName">Type Name *</label>
              <input
                type="text"
                id="typeName"
                name="typeName"
                value={roomTypeFormData.typeName}
                onChange={handleRoomTypeInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={roomTypeFormData.description}
                onChange={handleRoomTypeInputChange}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="services">Services</label>
              <textarea
                id="services"
                name="services"
                value={roomTypeFormData.services}
                onChange={handleRoomTypeInputChange}
                rows="3"
                placeholder="e.g., WiFi, TV, Mini Bar, etc."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingItem ? 'Update Room Type' : 'Add Room Type'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No rooms found</td>
                </tr>
              ) : (
                rooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.roomNumber}</td>
                    <td>{getRoomTypeName(room.roomTypeId)}</td>
                    <td>
                      <span className={`status-badge status-${room.status.toLowerCase()}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditRoom(room)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteRoom(room.id)}
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
      )}

      {activeTab === 'roomTypes' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type Name</th>
                <th>Description</th>
                <th>Services</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No room types found</td>
                </tr>
              ) : (
                roomTypes.map(roomType => (
                  <tr key={roomType.id}>
                    <td>{roomType.typeName}</td>
                    <td>{roomType.description || '-'}</td>
                    <td>{roomType.services || '-'}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditRoomType(roomType)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteRoomType(roomType.id)}
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
      )}
    </div>
  );
};

export default Rooms;
