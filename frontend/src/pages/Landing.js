import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Landing() {
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <nav className="sticky-top pt-3" style={{ top: '24px' }}>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Home</Link></li>
                <li className="mb-2"><Link to="/incidents" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">All Questions</Link></li>
                <li className="mb-2"><Link to="/tags" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Tags</Link></li>
                <li className="mb-2"><Link to="/submit-incident" className="text-decoration-none px-3 py-2 d-block rounded bg-primary bg-opacity-10 fw-medium">Submit Query</Link></li>
                <li className="mb-2"><Link to="/pricing" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Pricing</Link></li>
                <li><Link to="/help-support" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Contact</Link></li>
              </ul>
            </nav>
          </Col>

          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Post Query Box */}
            <Card className="shadow-sm mb-5" id="submit">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Post Your Cloud Query</h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      placeholder="Describe your issue or question..."
                      className="border rounded px-3 py-2"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" className="px-4 py-2">Submit Question</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Recent Questions List */}
            <section>
              <h3 className="fs-5 fw-semibold mb-3">Recent Questions</h3>
              <div className="d-flex flex-column gap-3">
                {/* Example Question Cards */}
                <Card className="shadow-sm hover-border-primary">
                  <Card.Body className="p-3">
                    <Link to="/incident/1" className="text-primary fw-medium text-decoration-none">How do I configure AWS S3 bucket permissions for public access?</Link>
                    <p className="text-muted small mt-1">Posted by <span className="fw-medium">user123</span> • 15 minutes ago</p>
                  </Card.Body>
                </Card>
                <Card className="shadow-sm hover-border-primary">
                  <Card.Body className="p-3">
                    <Link to="/incident/2" className="text-primary fw-medium text-decoration-none">Why is my Azure VM unreachable via SSH?</Link>
                    <p className="text-muted small mt-1">Posted by <span className="fw-medium">cloudpro</span> • 2 hours ago</p>
                  </Card.Body>
                </Card>
                <Card className="shadow-sm hover-border-primary">
                  <Card.Body className="p-3">
                    <Link to="/incident/3" className="text-primary fw-medium text-decoration-none">Google Cloud Storage access control best practices?</Link>
                    <p className="text-muted small mt-1">Posted by <span className="fw-medium">gcp_user</span> • 3 hours ago</p>
                  </Card.Body>
                </Card>
              </div>
            </section>
          </Col>

          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Free vs Premium CTA */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Upgrade for AI & Engineer Support</h4>
                <p className="text-muted mb-3">Free community support is always available. For enhanced AI answers and dedicated tickets, choose a plan.</p>
                <Link to="/pricing" className="btn btn-primary d-block">View Pricing</Link>
              </Card.Body>
            </Card>

            {/* Pricing Summary */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Pricing Plans</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">$0/mo – Unlimited community Q&A</li>
                  <li className="mb-2">$25/mo – 100 AI credits (AI Premium)</li>
                  <li>$100/mo – 10 engineer tickets</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Landing;