import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function TagsCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="tags" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <h2 className="fs-3 fw-semibold mb-4">Tags & Categories</h2>
            
            {/* Tags Search */}
            <Form.Group className="mb-4">
              <Form.Control 
                type="text" 
                placeholder="Filter by tag name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </Form.Group>
            
            {/* Tags List */}
            <Row>
              {/* Example Tag Card */}
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">aws-s3</span>
                      <span className="text-muted small">8.4k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Questions about AWS Simple Storage Service, including bucket policies, permissions, and lifecycle rules.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">azure-vm</span>
                      <span className="text-muted small">5.2k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Issues related to Azure Virtual Machines: setup, SSH/RDP access, scaling, and networking.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">gcp-networking</span>
                      <span className="text-muted small">3.1k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Google Cloud networking services: VPC, firewall rules, Cloud Router, and interconnect.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">kubernetes</span>
                      <span className="text-muted small">7.8k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Container orchestration, deployment strategies, scaling, and management with Kubernetes.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">terraform</span>
                      <span className="text-muted small">4.5k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Infrastructure as code using Terraform, including modules, state management, and multi-cloud deployments.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4} md={6} className="mb-4">
                <Card className="shadow-sm h-100 hover-border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark px-2 py-1 rounded">serverless</span>
                      <span className="text-muted small">3.9k posts</span>
                    </div>
                    <p className="text-muted small mb-0">Serverless computing across cloud providers, including AWS Lambda, Azure Functions, and Google Cloud Functions.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Tag Categories */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Tag Categories</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Cloud Providers</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Compute & VMs</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Storage</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Networking</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Security</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">DevOps & CI/CD</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Databases</Link></li>
                  <li><Link to="#" className="text-primary">Serverless</Link></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Top Contributors */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Top Contributors</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><span className="fw-medium">cloudExpert</span> (2.3k answers)</li>
                  <li className="mb-2"><span className="fw-medium">devGuru</span> (1.9k answers)</li>
                  <li className="mb-2"><span className="fw-medium">netAdmin</span> (1.5k answers)</li>
                  <li className="mb-2"><span className="fw-medium">secPro</span> (1.2k answers)</li>
                  <li><span className="fw-medium">storageKing</span> (950 answers)</li>
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

export default TagsCategories;