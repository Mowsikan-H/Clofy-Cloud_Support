import React from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function IncidentsList() {
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
            
            {/* Questions List */}
            <div className="d-flex flex-column gap-3">
              {/* Example Item */}
              <Card className="shadow-sm hover-border-primary">
                <Card.Body className="p-3">
                  <div className="d-flex">
                    <div className="text-center me-3" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5 text-primary">5</div>
                      <div className="small text-muted">answers</div>
                    </div>
                    <div className="text-center me-3" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5">12</div>
                      <div className="small text-muted">votes</div>
                    </div>
                    <div>
                      <Link to="/incident/1" className="text-primary fw-medium fs-5 text-decoration-none">How to configure AWS IAM roles for cross-account access?</Link>
                      <p className="text-muted small mt-2">I need to allow services in one AWS account to access resources in another. What's the best practice for setting up IAM roles for cross-account access?</p>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        <Badge bg="light" text="dark" className="rounded-pill">aws</Badge>
                        <Badge bg="light" text="dark" className="rounded-pill">iam</Badge>
                        <Badge bg="light" text="dark" className="rounded-pill">security</Badge>
                      </div>
                      <p className="mt-2 text-muted small">asked by <span className="fw-medium">user123</span> • 1 hour ago</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              {/* Additional question items would follow the same pattern */}
              <Card className="shadow-sm hover-border-primary">
                <Card.Body className="p-3">
                  <div className="d-flex">
                    <div className="text-center me-3" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5 text-primary">2</div>
                      <div className="small text-muted">answers</div>
                    </div>
                    <div className="text-center me-3" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5">8</div>
                      <div className="small text-muted">votes</div>
                    </div>
                    <div>
                      <Link to="/incident/2" className="text-primary fw-medium fs-5 text-decoration-none">Azure VM scale set autoscaling not triggering</Link>
                      <p className="text-muted small mt-2">My Azure VM scale set isn't scaling out despite high CPU usage. I've configured autoscaling rules but they don't seem to be working.</p>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        <Badge bg="light" text="dark" className="rounded-pill">azure</Badge>
                        <Badge bg="light" text="dark" className="rounded-pill">vm</Badge>
                        <Badge bg="light" text="dark" className="rounded-pill">scaling</Badge>
                      </div>
                      <p className="mt-2 text-muted small">asked by <span className="fw-medium">azure_dev</span> • 3 hours ago</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
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