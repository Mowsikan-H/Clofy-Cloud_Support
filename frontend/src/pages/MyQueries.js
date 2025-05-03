import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function MyQueries() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="mytickets" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <h2 className="fs-3 fw-semibold mb-4">My Tickets</h2>
            
            {/* Status Filter */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Button 
                variant={activeFilter === 'all' ? 'primary' : 'light'} 
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={activeFilter === 'open' ? 'primary' : 'light'} 
                onClick={() => setActiveFilter('open')}
              >
                Open
              </Button>
              <Button 
                variant={activeFilter === 'answered' ? 'primary' : 'light'} 
                onClick={() => setActiveFilter('answered')}
              >
                Answered
              </Button>
              <Button 
                variant={activeFilter === 'escalated' ? 'primary' : 'light'} 
                onClick={() => setActiveFilter('escalated')}
              >
                Escalated
              </Button>
            </div>

            {/* Tickets List */}
            <div className="d-flex flex-column gap-3">
              {/* Ticket Item */}
              <Card className="shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Link to="/incident/1" className="text-primary fw-medium fs-5 text-decoration-none">S3 bucket access denied on public endpoint</Link>
                      <p className="text-muted small mt-1">Submitted: 2025-04-30 • Tags: 
                        <Badge bg="light" text="dark" className="ms-1 me-1">aws-s3</Badge>
                        <Badge bg="light" text="dark">permissions</Badge>
                      </p>
                    </div>
                    <div className="text-end">
                      <Badge bg="success" className="mb-2">Answered</Badge>
                      <div>
                        <Button variant="primary" size="sm">Upgrade</Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Link to="/incident/2" className="text-primary fw-medium fs-5 text-decoration-none">Error provisioning Azure VM instance</Link>
                      <p className="text-muted small mt-1">Submitted: 2025-05-01 • Tags: 
                        <Badge bg="light" text="dark" className="ms-1 me-1">azure-vm</Badge>
                        <Badge bg="light" text="dark">provisioning</Badge>
                      </p>
                    </div>
                    <div className="text-end">
                      <Badge bg="danger" className="mb-2">Open</Badge>
                      <div>
                        <Button variant="primary" size="sm">Upgrade</Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Link to="/incident/3" className="text-primary fw-medium fs-5 text-decoration-none">Network latency spikes in GCP load balancer</Link>
                      <p className="text-muted small mt-1">Submitted: 2025-04-28 • Tags: 
                        <Badge bg="light" text="dark" className="ms-1 me-1">gcp</Badge>
                        <Badge bg="light" text="dark">networking</Badge>
                      </p>
                    </div>
                    <div className="text-end">
                      <Badge bg="warning" text="dark" className="mb-2">Escalated</Badge>
                      <div>
                        <Button variant="primary" size="sm">Upgrade</Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Summary */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Ticket Summary</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Total Tickets: <span className="fw-medium">12</span></li>
                  <li className="mb-2">Open: <span className="fw-medium">4</span></li>
                  <li className="mb-2">Answered: <span className="fw-medium">6</span></li>
                  <li>Escalated: <span className="fw-medium">2</span></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Upgrade CTA */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Need More Support?</h4>
                <p className="text-muted mb-3">Upgrade for AI or engineer responses.</p>
                <Link to="/pricing" className="btn btn-primary d-block">View Plans</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default MyQueries