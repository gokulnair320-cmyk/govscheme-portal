import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import SchemeList from './pages/SchemeList';
import MyApplications from './pages/MyApplications';
import MyDocuments from './pages/MyDocuments';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminDocumentsQueue from './pages/AdminDocumentsQueue';
import AdminNotifications from './pages/AdminNotifications';
import FraudPanel from './pages/FraudPanel';
import AuditTrail from './pages/AuditTrail';

const AppLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
    }}>
      <Navbar />
      <div style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem 3rem',
        minHeight: '100vh',
        background: '#f8fafc',
        position: 'relative',
      }}>
        {/* Subtle accent line at the top */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: '260px',
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #0f4c5c, #115e59, transparent)',
          zIndex: 10,
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <AppLayout><CitizenDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/schemes" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <AppLayout><SchemeList /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <AppLayout><MyApplications /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <AppLayout><MyDocuments /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <AppLayout><Notifications /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/documents" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AdminDocumentsQueue /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AdminNotifications /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/fraud" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><FraudPanel /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AuditTrail /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
