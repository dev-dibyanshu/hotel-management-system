import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      roles: ['Owner', 'Manager', 'Receptionist']
    },
    {
      path: '/guests',
      label: 'Guests',
      icon: '👥',
      roles: ['Owner', 'Manager', 'Receptionist']
    },
    {
      path: '/rooms',
      label: 'Rooms',
      icon: '🏨',
      roles: ['Owner', 'Manager']
    },
    {
      path: '/room-search',
      label: 'Room Search',
      icon: '🔍',
      roles: ['Owner', 'Manager', 'Receptionist']
    },
    {
      path: '/reservations',
      label: 'Reservations',
      icon: '📅',
      roles: ['Owner', 'Manager', 'Receptionist']
    },
    {
      path: '/bills',
      label: 'Bills',
      icon: '🧾',
      roles: ['Owner', 'Manager', 'Receptionist']
    },
    {
      path: '/payments',
      label: 'Payments',
      icon: '💳',
      roles: ['Owner', 'Manager']
    },
    {
      path: '/rates',
      label: 'Rates',
      icon: '💰',
      roles: ['Owner', 'Manager']
    },
    {
      path: '/staff',
      label: 'Staff',
      icon: '👔',
      roles: ['Owner', 'Manager']
    },
    {
      path: '/inventory',
      label: 'Inventory',
      icon: '📦',
      roles: ['Owner', 'Manager']
    },
    {
      path: '/departments',
      label: 'Departments',
      icon: '🏢',
      roles: ['Owner']
    },
    {
      path: '/users',
      label: 'Users',
      icon: '👤',
      roles: ['Owner', 'Manager']
    }
  ];

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
