import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function KnowledgeBase() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="knowledge" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Title */}
            <h1 className="fs-3 fw-semibold mb-4">Knowledge Base</h1>
            
            {/* Category Filter */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Button 
                variant={activeCategory === 'all' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={activeCategory === 'tutorials' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('tutorials')}
              >
                Tutorials
              </Button>
              <Button 
                variant={activeCategory === 'howto' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('howto')}
              >
                How-To Guides
              </Button>
              <Button 
                variant={activeCategory === 'best' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('best')}
              >
                Best Practices
              </Button>
              <Button 
                variant={activeCategory === 'troubleshooting' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('troubleshooting')}
              >
                Troubleshooting
              </Button>
            </div>
            
            {/* Search Box */}
            <Form.Group className="mb-4">
              <Form.Control 
                type="text" 
                placeholder="Search docs..." 
                className="border rounded px-3 py-2"
              />
            </Form.Group>
            
            {/* Docs List */}
            <div className="d-flex flex-column gap-4">
              {/* Doc Card */}
              <Card className="shadow-sm hover-border-primary">
                <Card.Body className="p-4">
                  <h2 className="fs-4 fw-semibold text-primary mb-2">
                    <Link to="/knowledge-base/1" className="text-decoration-none">Configuring AWS VPC Peering</Link>
                  </h2>
                  <p className="text-muted mb-3">Learn how to set up and manage VPC peering connections between AWS accounts for secure network communication.</p>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Category: Tutorials</span>
                    <span>Updated: Apr 15, 2025</span>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm hover-border-primary">
                <Card.Body className="p-4">
                  <h2 className="fs-4 fw-semibold text-primary mb-2">
                    <Link to="/knowledge-base/2" className="text-decoration-none">Azure VM Scale Set Autoscaling</Link>
                  </h2>
                  <p className="text-muted mb-3">Step-by-step guide to configure autoscaling rules on Azure Virtual Machine Scale Sets to handle variable workloads.</p>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Category: How-To Guides</span>
                    <span>Updated: Mar 28, 2025</span>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm hover-border-primary">
                <Card.Body className="p-4">
                  <h2 className="fs-4 fw-semibold text-primary mb-2">
                    <Link to="/knowledge-base/3" className="text-decoration-none">Troubleshooting GCP IAM Permissions</Link>
                  </h2>
                  <p className="text-muted mb-3">Identify and resolve common IAM permission errors in Google Cloud Platform with example policies and CLI commands.</p>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Category: Troubleshooting</span>
                    <span>Updated: Feb 20, 2025</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* AI Related Articles */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">AI Suggested Articles</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Best practices for secure S3 bucket policies</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Optimizing Terraform for multi-cloud deployments</Link></li>
                  <li><Link to="#" className="text-primary">Setting up CloudWatch alarms for EC2</Link></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Popular Docs */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Popular Articles</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Introduction to Kubernetes on GKE</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Load Balancing Strategies on Azure</Link></li>
                  <li><Link to="#" className="text-primary">Backup & Recovery with AWS Backup</Link></li>
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

export default KnowledgeBase;