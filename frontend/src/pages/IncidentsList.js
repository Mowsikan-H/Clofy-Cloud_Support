import React from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useState, useEffect } from 'react';

function IncidentsList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await api.incidents.getAll();
        if (response.success) {
          setIncidents(response.data);
        } else {
          setError(response.message || 'Failed to fetch incidents');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidents();
  }, []);
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="questions" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Header Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fs-4 fw-semibold mb-0">All Questions</h2>
              <div className="d-flex gap-2">
                <Button variant="light" size="sm">Newest</Button>
                <Button variant="light" size="sm">Active</Button>
                <Button variant="light" size="sm">Unanswered</Button>
              </div>
            </div>
            
            {/* Tag Filter */}
            <Form.Group className="mb-4">
              <Form.Control 
                type="text" 
                placeholder="Filter by tags (e.g., aws, azure)" 
                className="border rounded px-3 py-2"
              />
            </Form.Group>
          
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No incidents found. Be the first to submit a question!</p>
                <Button as={Link} to="/submit-incident" variant="primary" className="mt-3">
                  Submit Question
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {incidents.map(incident => (
                  <Card key={incident._id} className="shadow-sm hover-border-primary">
                    <Card.Body className="p-3">
                      <div className="d-flex">
                        <div className="text-center me-3" style={{ width: '80px' }}>
                          <div className="fw-bold fs-5 text-primary">{incident.comments?.length || 0}</div>
                          <div className="small text-muted">answers</div>
                        </div>
                        <div className="text-center me-3" style={{ width: '80px' }}>
                          <div className="fw-bold fs-5">{incident.votes || 0}</div>
                          <div className="small text-muted">votes</div>
                        </div>
                        <div>
                          <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                            {incident.title}
                          </Link>
                          <p className="text-muted small mt-2">{incident.description.substring(0, 150)}...</p>
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {incident.tags.map(tag => (
                              <Badge key={tag} bg="light" text="dark" className="rounded-pill">{tag}</Badge>
                            ))}
                          </div>
                          <p className="mt-2 text-muted small">
                            asked by <span className="fw-medium">{incident.user?.name || 'Anonymous'}</span> • 
                            {new Date(incident.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Premium CTA */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Get Premium Support</h4>
                <p className="text-muted mb-3">Upgrade for AI responses or direct engineer help.</p>
                <Link to="/pricing" className="btn btn-primary d-block">View Plans</Link>
              </Card.Body>
            </Card>
            
            {/* Top Tags */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Top Tags</h4>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="light" text="dark" className="rounded-pill">aws</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">azure</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">gcp</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">docker</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">kubernetes</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default IncidentsList;