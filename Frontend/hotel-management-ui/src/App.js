import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Guests from './components/Guests';
import Rooms from './components/Rooms';
import RoomSearch from './components/RoomSearch';
import Reservations from './components/Reservations';
import Bills from './components/Bills';
import Payments from './components/Payments';
import Rates from './components/Rates';
import Staff from './components/Staff';
import Inventory from './components/Inventory';
import Departments from './components/Departments';
import Users from './components/Users';
import './App.css';

const Unauthorized = () => <div className="page-content"><h1>Unauthorized</h1><p>You don't have permission to access this page.</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Header />
                  <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        
                        {/* Guest routes - Owner, Manager, Receptionist */}
                        <Route
                          path="/guests"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager', 'Receptionist']}>
                              <Guests />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Room search - All roles */}
                        <Route
                          path="/room-search"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager', 'Receptionist']}>
                              <RoomSearch />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Reservation routes - Owner, Manager, Receptionist */}
                        <Route
                          path="/reservations"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager', 'Receptionist']}>
                              <Reservations />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Bill routes - Owner, Manager, Receptionist */}
                        <Route
                          path="/bills"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager', 'Receptionist']}>
                              <Bills />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Room management - Owner, Manager only */}
                        <Route
                          path="/rooms"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Rooms />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Payment routes - Owner, Manager only */}
                        <Route
                          path="/payments"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Payments />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Rate routes - Owner, Manager only */}
                        <Route
                          path="/rates"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Rates />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Staff routes - Owner, Manager only */}
                        <Route
                          path="/staff"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Staff />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Inventory routes - Owner, Manager only */}
                        <Route
                          path="/inventory"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Inventory />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* User routes - Owner, Manager only */}
                        <Route
                          path="/users"
                          element={
                            <ProtectedRoute roles={['Owner', 'Manager']}>
                              <Users />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Department routes - Owner only */}
                        <Route
                          path="/departments"
                          element={
                            <ProtectedRoute roles={['Owner']}>
                              <Departments />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
