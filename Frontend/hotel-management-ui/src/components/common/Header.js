import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Hotel Management System</h1>
        <div className="header-user">
          <span className="user-info">
            <strong>{user?.username}</strong>
            <span className="user-role">({user?.role})</span>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
