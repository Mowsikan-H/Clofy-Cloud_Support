import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function SubmitIncident() {
  const [showModal, setShowModal] = useState(false);

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
                
                <Form>
                  {/* Problem Description */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Problem Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      required 
                      placeholder="One-sentence summary of the problem"
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
                          <option>VM Failures</option>
                          <option>Database Issues</option>
                          <option>Scaling Issues</option>
                          <option>API/Integration Issues</option>
                          <option>Other...</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {/* Priority Level */}
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Priority Level</Form.Label>
                        <Form.Select>
                          <option>Critical</option>
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                          <option>Other...</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {/* Root Cause */}
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Root Cause</Form.Label>
                        <Form.Select>
                          <option>Configuration Issue</option>
                          <option>Software Bug</option>
                          <option>Hardware Failure</option>
                          <option>Network Congestion</option>
                          <option>User Error</option>
                          <option>Third-Party Failure</option>
                          <option>Other...</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {/* Affected CSP */}
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-medium">Affected Cloud Service Provider</Form.Label>
                        <Form.Select>
                          <option>AWS</option>
                          <option>Azure</option>
                          <option>Google Cloud</option>
                          <option>IBM Cloud</option>
                          <option>Oracle Cloud</option>
                          <option>Other...</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {/* More dropdowns would follow the same pattern */}
                  </Row>
                  
                  {/* Optional Fields */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Detailed Description <span className="text-muted small">(optional)</span></Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      placeholder="Provide additional context or troubleshooting steps"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Attachments <span className="text-muted small">(optional)</span></Form.Label>
                    <Form.Control type="file" />
                  </Form.Group>
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary" className="px-4 py-2">Submit Incident</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-semibold mb-2">Need help?</h4>
                <p className="text-muted">
                  Refer to our <a href="#" className="text-primary text-decoration-underline">submission guide</a> or <a href="#contact" className="text-primary text-decoration-underline">contact support</a>.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Modal for Quick Submit */}
      <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-4 position-relative">
            <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setShowModal(false)}></button>
            <h3 className="fs-4 fw-semibold mb-3">Quick Submit Incident</h3>
            <Form>
              <Form.Control 
                type="text" 
                required 
                placeholder="One-sentence problem summary" 
                className="mb-3"
              />
              <div className="text-end">
                <Button type="submit" variant="primary">Submit</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default SubmitIncident;