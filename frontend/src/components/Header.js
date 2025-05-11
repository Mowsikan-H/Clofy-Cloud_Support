import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/incidents?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <Container fluid className="px-4 py-2">
        <Navbar expand="lg" className="p-0">
          <div className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/" className="fs-4 fw-bold me-4 d-flex align-items-center">
              <span className="text-primary me-2">CLOFY</span>
            </Navbar.Brand>
            <Form className="d-none d-md-flex" onSubmit={handleSearch}>
              <div className="position-relative">
                <FormControl
                  type="search"
                  placeholder="Search questions..."
                  className="me-2 border rounded px-3 py-1"
                  style={{ width: '260px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="link" 
                  className="position-absolute end-0 top-0 text-muted" 
                  style={{ padding: '0.35rem' }}
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </Button>
              </div>
            </Form>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              
              
              {currentUser ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center border-0">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                      {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="d-none d-md-inline">{currentUser.name || 'User'}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button as={Link} to="/login" variant="primary" className="rounded px-3 py-1">Sign In</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
}

export default Header;