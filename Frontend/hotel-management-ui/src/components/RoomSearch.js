import React, { useState } from 'react';
import api from '../services/api';
import './RoomSearch.css';

const RoomSearch = () => {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate dates
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      // Build query string
      const params = new URLSearchParams({
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        numberOfGuests: searchParams.numberOfGuests
      });
      
      const response = await api.get(`/api/rooms/search?${params}`);
      setAvailableRooms(response.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search rooms');
      console.error('Error searching rooms:', err);
    } finally {
      setSearching(false);
    }
  };

  const calculateNights = () => {
    if (searchParams.checkIn && searchParams.checkOut) {
      const checkIn = new Date(searchParams.checkIn);
      const checkOut = new Date(searchParams.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getRateForRoom = (room) => {
    // In a real application, this would query the rates API
    // For now, return mock data or actual rates if available
    if (room.rates && room.rates.length > 0) {
      const rate = room.rates[0];
      return {
        firstNight: rate.firstNightPrice,
        extension: rate.extensionPrice
      };
    }
    return {
      firstNight: 100,
      extension: 80
    };
  };

  const calculateTotal = (room) => {
    const nights = calculateNights();
    const rates = getRateForRoom(room);
    if (nights === 0) return 0;
    if (nights === 1) return rates.firstNight;
    return rates.firstNight + (rates.extension * (nights - 1));
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="room-search-container">
      <h1>Room Search</h1>
      
      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkIn">Check-In Date *</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleInputChange}
                min={getTodayDate()}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="checkOut">Check-Out Date *</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleInputChange}
                min={searchParams.checkIn || getTodayDate()}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfGuests">Number of Guests *</label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                value={searchParams.numberOfGuests}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
              />
            </div>
          </div>
          
          {calculateNights() > 0 && (
            <div className="nights-info">
              Total Nights: <strong>{calculateNights()}</strong>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-search"
            disabled={searching}
          >
            {searching ? 'Searching...' : 'Search Available Rooms'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searched && (
        <div className="search-results">
          <h2>Available Rooms</h2>
          
          {availableRooms.length === 0 ? (
            <div className="no-results">
              <p>No rooms available for the selected dates and number of guests.</p>
              <p>Please try different dates or contact our front desk for assistance.</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {availableRooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <h3>Room {room.roomNumber}</h3>
                    <span className="room-type">{room.roomType?.typeName || 'Standard'}</span>
                  </div>
                  
                  <div className="room-details">
                    {room.roomType?.description && (
                      <p className="room-description">{room.roomType.description}</p>
                    )}
                    
                    {room.roomType?.services && (
                      <div className="room-services">
                        <strong>Services:</strong>
                        <p>{room.roomType.services}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="room-pricing">
                    <div className="price-row">
                      <span>First Night:</span>
                      <span className="price">${getRateForRoom(room).firstNight}</span>
                    </div>
                    {calculateNights() > 1 && (
                      <div className="price-row">
                        <span>Extension ({calculateNights() - 1} nights):</span>
                        <span className="price">
                          ${getRateForRoom(room).extension} × {calculateNights() - 1} = 
                          ${getRateForRoom(room).extension * (calculateNights() - 1)}
                        </span>
                      </div>
                    )}
                    <div className="price-row total">
                      <span>Total:</span>
                      <span className="price">${calculateTotal(room)}</span>
                    </div>
                  </div>
                  
                  <div className="room-status">
                    <span className="status-badge status-available">
                      {room.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomSearch;
