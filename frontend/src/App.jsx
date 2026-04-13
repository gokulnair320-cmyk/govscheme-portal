import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages - dynamically imported or straight imported
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import SchemeList from './pages/SchemeList';
import MyApplications from './pages/MyApplications';
import MyDocuments from './pages/MyDocuments';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import FraudPanel from './pages/FraudPanel';
import AuditTrail from './pages/AuditTrail';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Navbar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
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
