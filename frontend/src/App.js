import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitIncident from './pages/SubmitIncident';
import IncidentDetail from './pages/IncidentDetail';
import IncidentsList from './pages/IncidentsList';
import KnowledgeBase from './pages/KnowledgeBase';
import AccountBilling from './pages/AccountBilling';
import PricingPlans from './pages/PricingPlans';
import AdminModeration from './pages/AdminModeration';
import Legal from './pages/Legal';
import MyQueries from './pages/MyQueries';
import SLADashboard from './pages/SLADashboard';
import TagsCategories from './pages/TagsCategories';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/submit-incident" element={
              <PrivateRoute>
                <SubmitIncident />
              </PrivateRoute>
            } />
            <Route path="/incident/:id" element={
              <PrivateRoute>
                <IncidentDetail />
              </PrivateRoute>
            } />
            <Route path="/incidents" element={
              <PrivateRoute>
                <IncidentsList />
              </PrivateRoute>
            } />
            <Route path="/knowledge-base" element={
              <PrivateRoute>
                <KnowledgeBase />
              </PrivateRoute>
            } />
            <Route path="/account-billing" element={
              <PrivateRoute>
                <AccountBilling />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminModeration />
              </PrivateRoute>
            } />
            <Route path="/my-queries" element={
              <PrivateRoute>
                <MyQueries />
              </PrivateRoute>
            } />
            <Route path="/sla-dashboard" element={
              <PrivateRoute>
                <SLADashboard />
              </PrivateRoute>
            } />
            <Route path="/tags" element={
              <PrivateRoute>
                <TagsCategories />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;