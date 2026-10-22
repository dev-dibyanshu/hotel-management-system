import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'Owner':
        return 'You have full access to all system features.';
      case 'Manager':
        return 'You have access to all features except Departments and Reports.';
      case 'Receptionist':
        return 'You can manage guests, search rooms, handle reservations, and issue bills.';
      default:
        return '';
    }
  };

  const getQuickLinks = () => {
    const allLinks = [
      { path: '/guests', label: 'Manage Guests', icon: '👥', roles: ['Owner', 'Manager', 'Receptionist'] },
      { path: '/reservations', label: 'View Reservations', icon: '📅', roles: ['Owner', 'Manager', 'Receptionist'] },
      { path: '/room-search', label: 'Search Rooms', icon: '🔍', roles: ['Owner', 'Manager', 'Receptionist'] },
      { path: '/bills', label: 'Issue Bills', icon: '🧾', roles: ['Owner', 'Manager', 'Receptionist'] },
      { path: '/rooms', label: 'Manage Rooms', icon: '🏨', roles: ['Owner', 'Manager'] },
      { path: '/staff', label: 'Manage Staff', icon: '👔', roles: ['Owner', 'Manager'] },
      { path: '/departments', label: 'Manage Departments', icon: '🏢', roles: ['Owner'] },
    ];

    return allLinks.filter(link => link.roles.includes(user?.role));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getWelcomeMessage()}, {user?.username}!</h1>
        <p className="role-description">{getRoleDescription()}</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">🏨</div>
          <div className="stat-info">
            <h3>Hotel Management</h3>
            <p>System</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{user?.role}</h3>
            <p>Current Role</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>Session Status</p>
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h2>Quick Actions</h2>
        <div className="links-grid">
          {getQuickLinks().map((link) => (
            <a key={link.path} href={link.path} className="quick-link-card">
              <span className="link-icon">{link.icon}</span>
              <span className="link-label">{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="system-info">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Backend:</strong> ASP.NET Core Microservices
          </div>
          <div className="info-item">
            <strong>Authentication:</strong> JWT Bearer Token
          </div>
          <div className="info-item">
            <strong>API Gateway:</strong> https://localhost:5000
          </div>
          <div className="info-item">
            <strong>Version:</strong> 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
