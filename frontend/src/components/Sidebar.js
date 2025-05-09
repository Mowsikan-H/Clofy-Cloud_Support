import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar({ activePage }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser } = useAuth();
  
  // Define all navigation items
  const publicNavItems = [
    { id: 'questions', label: 'All Posts', path: '/incidents', icon: 'bi-list-ul' },
    { id: 'submit', label: 'Submit Post', path: '/submit-incident', icon: 'bi-plus-circle' },
  ];
  
  // Add authenticated-only items if user is logged in
  const navItems = [...publicNavItems];
  
  // Only add these items if user is logged in
  if (currentUser) {
    navItems.push(
      { id: 'mytickets', label: 'My Posts', path: '/my-queries', icon: 'bi-ticket' },
      { id: 'settings', label: 'My Profile', path: '/profile', icon: 'bi-gear' }
    );
  }

  return (
    <div className="sticky-top pt-3" style={{ top: '70px' }}>
      <Nav className="flex-column">
        {navItems.map(item => {
          const isActive = activePage === item.id || currentPath === item.path;
          return (
            <Nav.Link
              key={item.id}
              as={Link}
              to={item.path}
              className={`px-3 py-2 rounded mb-1 d-flex align-items-center ${isActive ? 'bg-primary bg-opacity-10 text-primary fw-medium' : 'text-dark hover-bg-light'}`}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Nav.Link>
          );
        })}
      </Nav>
      
      <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded">
        <h6 className="fw-medium">Need Help?</h6>
        <p className="small text-muted mb-2">Contact our support team for assistance</p>
        <Link to="/help-support" className="btn btn-sm btn-primary w-100">Contact Support</Link>
      </div>
    </div>
  );
}

export default Sidebar;