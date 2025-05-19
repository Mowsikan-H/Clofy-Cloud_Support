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
import SubmitPost from './pages/Submitpost';
import PostsList from './pages/PostsList';
import KnowledgeBase from './pages/KnowledgeBase';
import AccountBilling from './pages/AccountBilling';
import PricingPlans from './pages/PricingPlans';
import AdminModeration from './pages/AdminModeration';
import Legal from './pages/Legal';
import MyPosts from './pages/Myposts';
import SLADashboard from './pages/SLADashboard';
import TagsCategories from './pages/TagsCategories';
import UserProfile from './pages/UserProfile';

// Add this import
import KnowledgeBaseDetail from './pages/KnowledgeBaseDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PostsList />} /> {/* Changed from Landing to IncidentsList */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<PricingPlans />} />
            
            
            {/* Protected Routes */}
           
            <Route path="/submit-post" element={
              <PrivateRoute>
                <SubmitPost />
              </PrivateRoute>
            } />
           
            <Route path="/posts" element={
              <PrivateRoute>
                <PostsList />
              </PrivateRoute>
            } />
           
            {/* Knowledge Base Routes */}
           
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
            <Route path="/my-posts" element={<MyPosts />} /> {/* Removed PrivateRoute wrapper */}
           
            <Route path="/profile" element={<UserProfile />} /> {/* Removed PrivateRoute wrapper */}
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;