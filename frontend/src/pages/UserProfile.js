import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('activity');
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="profile" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Profile Header */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4 d-flex align-items-center">
                <Image 
                  src="https://via.placeholder.com/80" 
                  alt="Avatar" 
                  roundedCircle 
                  width={80} 
                  height={80} 
                  className="me-4"
                />
                <div>
                  <h1 className="fs-3 fw-semibold mb-1">Jane Doe</h1>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    <span className="text-muted">Reputation: <span className="fw-medium">4,200</span></span>
                    <span className="text-muted">AI Credits: <span className="fw-medium">72</span></span>
                    <span className="text-muted">Engineer Tickets: <span className="fw-medium">5 used</span></span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill px-3 py-2">Community Badge: Gold</span>
                    <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill px-3 py-2">AI-Premium Badge: Silver</span>
                    <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2">Engineer Badge: Bronze</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Profile Tabs */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-3">
                <Nav className="gap-3">
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'activity' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </Nav.Link>
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'questions' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('questions')}
                  >
                    Questions
                  </Nav.Link>
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'answers' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('answers')}
                  >
                    Answers
                  </Nav.Link>
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'tickets' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('tickets')}
                  >
                    My Tickets
                  </Nav.Link>
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'badges' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('badges')}
                  >
                    Badges
                  </Nav.Link>
                  <Nav.Link 
                    as="button" 
                    className={`border-0 bg-transparent ${activeTab === 'settings' ? 'text-primary fw-medium' : 'text-muted'}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>

            {/* Activity Section */}
            {activeTab === 'activity' && (
              <Card className="shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h2 className="fs-5 fw-semibold mb-3">Recent Activity</h2>
                  <ul className="list-unstyled small text-muted">
                    <li className="mb-2"><span className="fw-medium">Jane Doe</span> answered <Link to="/incident/1" className="text-primary">How to optimize S3 performance?</Link> • 10 mins ago</li>
                    <li className="mb-2"><span className="fw-medium">Jane Doe</span> commented on <Link to="/incident/2" className="text-primary">Azure VM scale sets issue</Link> • 1 hour ago</li>
                    <li><span className="fw-medium">Jane Doe</span> posted a new question <Link to="/incident/3" className="text-primary">GCP networking quotas</Link> • 2 days ago</li>
                  </ul>
                </Card.Body>
              </Card>
            )}

            {/* Badges Section */}
            {activeTab === 'badges' && (
              <Card className="shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h2 className="fs-5 fw-semibold mb-3">Badges</h2>
                  <Row>
                    <Col md={3} sm={6} className="mb-3">
                      <div className="bg-warning bg-opacity-10 p-3 rounded text-center">
                        <div className="fs-4 fw-bold text-warning">Gold</div>
                        <div className="small">5 earned</div>
                      </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded text-center">
                        <div className="fs-4 fw-bold text-primary">Silver</div>
                        <div className="small">12 earned</div>
                      </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <div className="bg-success bg-opacity-10 p-3 rounded text-center">
                        <div className="fs-4 fw-bold text-success">Bronze</div>
                        <div className="small">30 earned</div>
                      </div>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <div className="bg-purple bg-opacity-10 p-3 rounded text-center">
                        <div className="fs-4 fw-bold text-purple">AI-Premium</div>
                        <div className="small">3 earned</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Profile Summary */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Profile Summary</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Member since: <span className="fw-medium">Jan 2024</span></li>
                  <li className="mb-2">Total Questions: <span className="fw-medium">24</span></li>
                  <li className="mb-2">Total Answers: <span className="fw-medium">58</span></li>
                  <li>Tickets Submitted: <span className="fw-medium">15</span></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Settings Quick Links */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Quick Settings</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><a href="#" className="text-primary">Edit Profile</a></li>
                  <li className="mb-2"><a href="#" className="text-primary">Manage Subscription</a></li>
                  <li className="mb-2"><a href="#" className="text-primary">API Keys</a></li>
                  <li><a href="#" className="text-primary">Notification Preferences</a></li>
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

export default UserProfile;