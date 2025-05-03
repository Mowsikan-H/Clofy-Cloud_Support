import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <Container className="text-center text-muted">
        <p>© 2025 CLOFY. All rights reserved.</p>
        <div className="mt-2">
          <Link to="/legal#privacy" className="text-decoration-none text-muted me-3 hover-underline">Privacy Policy</Link>
          <Link to="/legal#terms" className="text-decoration-none text-muted me-3 hover-underline">Terms of Service</Link>
          <Link to="/help-support" className="text-decoration-none text-muted hover-underline">Contact Support</Link>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;