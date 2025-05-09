import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
// Add this import
import EnvDebug from '../components/EnvDebug';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to incidents list
  const from = location.state?.from?.pathname || '/incidents';
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h2 className="fs-3 fw-semibold text-center mb-4">Sign In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white text-center border-0 p-3">
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="text-decoration-none small">Sign Up</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
      {/* Then add the component inside your return statement, just before the Card */}
      <EnvDebug />
    </div>
  );
}

export default Login;