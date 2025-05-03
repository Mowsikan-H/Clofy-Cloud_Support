import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ activePage }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'bi-speedometer2' },
    { id: 'questions', label: 'All Questions', path: '/incidents', icon: 'bi-question-circle' },
    { id: 'submit', label: 'Submit Incident', path: '/submit-incident', icon: 'bi-plus-circle' },
    { id: 'mytickets', label: 'My Tickets', path: '/my-queries', icon: 'bi-ticket' },
    { id: 'analytics', label: 'Analytics', path: '/sla-dashboard', icon: 'bi-graph-up' },
    { id: 'settings', label: 'Settings', path: '/profile', icon: 'bi-gear' },
  ];

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