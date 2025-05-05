import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function SubmitIncident() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and description');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const response = await api.incidents.create({
        title,
        description,
        tags: tagsArray,
        priority: 'medium' // Default priority
      });
      
      if (response.success) {
        navigate(`/incident/${response.data._id}`);
      } else {
        setError(response.message || 'Failed to create incident');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="submit" />
          </Col>
          
          {/* Main Form */}
          <Col lg={7} md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h2 className="fs-3 fw-semibold mb-3">Submit a New Incident</h2>
                <p className="text-muted small mb-4">Fill out the form below to get community support or upgrade for AI/engineer help.</p>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  {/* Problem Description */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Problem Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      required 
                      placeholder="One-sentence summary of the problem"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  
                  {/* Dropdown Grid */}
                  <Row className="mb-4">
                    {/* Incident Category */}
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Incident Category</Form.Label>
                        <Form.Select>
                          <option>Cloud Service Outage</option>
                          <option>Cloud Storage Issues</option>
                          <option>Performance Degradation</option>
                          <option>Cloud Network Issues</option>
                          <option>Security Breach</option>
                          <option>Access/Permissions Issue</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {/* Cloud Provider */}
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Cloud Provider</Form.Label>
                        <Form.Select>
                          <option>AWS</option>
                          <option>Azure</option>
                          <option>Google Cloud</option>
                          <option>IBM Cloud</option>
                          <option>Oracle Cloud</option>
                          <option>Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* Detailed Description */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Detailed Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={6} 
                      required
                      placeholder="Describe the issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  
                  {/* Tags */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Tags</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., ec2, s3, networking, security (comma separated)"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <Form.Text className="text-muted">Add relevant tags to help others find your incident</Form.Text>
                  </Form.Group>
                  
                  {/* Submit Button */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Incident'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-3">Submission Guidelines</h4>
                <ul className="small text-muted ps-3">
                  <li className="mb-2">Be specific about your cloud issue</li>
                  <li className="mb-2">Include any error messages exactly as they appear</li>
                  <li className="mb-2">Mention what you've already tried</li>
                  <li>Add relevant tags to get faster responses</li>
                </ul>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-3">Need Faster Resolution?</h4>
                <p className="small text-muted">Upgrade to get direct access to cloud engineers and AI-powered solutions.</p>
                <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>View Upgrade Options</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default SubmitIncident;