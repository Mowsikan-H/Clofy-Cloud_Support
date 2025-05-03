import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  
  useEffect(() => {
    // Check if notification has already been shown in this session
    const hasShownNotification = sessionStorage.getItem('dashboardNotificationShown');
    
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
      
      // Only show toast if it hasn't been shown yet in this session
      if (!hasShownNotification) {
        addToast('Dashboard data loaded successfully');
        sessionStorage.setItem('dashboardNotificationShown', 'true');
      }
    }, 1000);
    
    // Clean up function
    return () => {
      // Optional: You could clear the notification flag when component unmounts
      // if you want to show it again after a complete app refresh
      // sessionStorage.removeItem('dashboardNotificationShown');
    };
  }, [addToast]);
  
  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Header />
        <Container fluid className="py-4">
          <Row>
            <Col lg={2} className="d-none d-lg-block">
              <Sidebar activePage="dashboard" />
            </Col>
            <Col lg={10}>
              <LoadingSpinner size="lg" />
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="dashboard" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <h1 className="fs-3 fw-semibold mb-4">Dashboard</h1>
            
            {/* Overview Metrics */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">Open Tickets</h4>
                    <p className="fs-1 fw-bold mb-0">4</p>
                    <small className="text-muted">Active incidents</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">AI Credits Balance</h4>
                    <p className="fs-1 fw-bold mb-0">72</p>
                    <small className="text-muted">Available credits</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">SLA Health</h4>
                    <p className="fs-1 fw-bold text-success mb-0">98.5%</p>
                    <small className="text-muted">Past 30 days</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Rest of the component remains the same */}
            {/* Recent Activity & Community Feed */}
            <Row className="mb-4">
              {/* My Recent Tickets */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">My Recent Tickets</h4>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <Link to="/incident/1" className="text-primary fw-medium">Error provisioning Azure VM instance</Link>
                        <p className="text-muted small mt-1">Status: <Badge bg="warning" text="dark">In Progress</Badge> • 3h ago</p>
                      </li>
                      <li className="mb-3">
                        <Link to="/incident/2" className="text-primary fw-medium">S3 bucket access denied on public endpoint</Link>
                        <p className="text-muted small mt-1">Status: <Badge bg="danger">Open</Badge> • 1 day ago</p>
                      </li>
                      <li>
                        <Link to="/incident/3" className="text-primary fw-medium">Database connection timeout on RDS</Link>
                        <p className="text-muted small mt-1">Status: <Badge bg="success">Resolved</Badge> • 2 days ago</p>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              
              {/* Community Activity */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">Community Activity</h4>
                    <ul className="list-unstyled">
                      <li className="mb-3"><span className="fw-medium">user456</span> answered <Link to="/incident/4" className="text-primary">How to fix GCP network route issues?</Link></li>
                      <li className="mb-3"><span className="fw-medium">user789</span> commented on <Link to="/incident/5" className="text-primary">Deploying Docker containers on ECS</Link></li>
                      <li><span className="fw-medium">user123</span> upvoted <Link to="/incident/6" className="text-primary">Terraform module for Azure VNet</Link></li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Quick Actions */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-medium mb-3">Quick Actions</h4>
                <div className="d-flex flex-wrap gap-2">
                  <Button as={Link} to="/submit-incident" variant="primary">Submit New Ticket</Button>
                  <Button as={Link} to="/account-billing" variant="outline-primary">Buy AI Credits</Button>
                  <Button as={Link} to="/pricing" variant="outline-success">Upgrade Plan</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Usage Summary */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Usage Summary</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Tickets this month: <span className="fw-medium">8</span></li>
                  <li className="mb-2">AI credits used: <span className="fw-medium">28</span></li>
                  <li>Engineer tickets used: <span className="fw-medium">2</span></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Tips & Resources */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Tips & Resources</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="/knowledge-base/1" className="text-primary">Understanding SLA metrics</Link></li>
                  <li className="mb-2"><Link to="/knowledge-base/2" className="text-primary">Best practices for cloud security</Link></li>
                  <li><Link to="/knowledge-base/3" className="text-primary">AI query optimization tips</Link></li>
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

export default Dashboard;