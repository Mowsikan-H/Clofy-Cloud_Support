import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Legal() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.hash ? location.hash.substring(1) : 'privacy');
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <nav className="sticky-top pt-3" style={{ top: '24px' }}>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a 
                    href="#privacy" 
                    className={`text-decoration-none px-3 py-2 d-block rounded ${activeSection === 'privacy' ? 'bg-primary bg-opacity-10 fw-medium' : 'hover-bg-light'}`}
                    onClick={() => setActiveSection('privacy')}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#terms" 
                    className={`text-decoration-none px-3 py-2 d-block rounded ${activeSection === 'terms' ? 'bg-primary bg-opacity-10 fw-medium' : 'hover-bg-light'}`}
                    onClick={() => setActiveSection('terms')}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="#cookies" 
                    className={`text-decoration-none px-3 py-2 d-block rounded ${activeSection === 'cookies' ? 'bg-primary bg-opacity-10 fw-medium' : 'hover-bg-light'}`}
                    onClick={() => setActiveSection('cookies')}
                  >
                    Cookie Settings
                  </a>
                </li>
              </ul>
            </nav>
          </Col>

          {/* Main Content */}
          <Col lg={10}>
            {/* Privacy Policy */}
            {activeSection === 'privacy' && (
              <Card className="shadow-sm mb-4" id="privacy">
                <Card.Body className="p-4">
                  <h1 className="fs-3 fw-semibold mb-4">Privacy Policy</h1>
                  <p className="text-muted mb-3">Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights regarding your personal information.</p>
                  <ul className="mb-0">
                    <li className="mb-2">Data Collection: We collect information you provide directly (e.g., account info, support requests).</li>
                    <li className="mb-2">Usage Data: We gather usage metrics to improve our services.</li>
                    <li className="mb-2">Data Sharing: We do not sell your data. We share with service providers under strict agreements.</li>
                    <li>Your Rights: You can access, update, or delete your data via your account settings.</li>
                  </ul>
                </Card.Body>
              </Card>
            )}

            {/* Terms of Service */}
            {activeSection === 'terms' && (
              <Card className="shadow-sm mb-4" id="terms">
                <Card.Body className="p-4">
                  <h1 className="fs-3 fw-semibold mb-4">Terms of Service</h1>
                  <p className="text-muted mb-3">By using CLOFY, you agree to the following terms. Please read them carefully.</p>
                  <ol className="mb-0">
                    <li className="mb-2">Use of Service: You must comply with all applicable laws and not misuse our platform.</li>
                    <li className="mb-2">Account Security: You are responsible for maintaining the confidentiality of your credentials.</li>
                    <li className="mb-2">Payment Terms: Paid features require payment in advance; cancellations take effect next billing cycle.</li>
                    <li>Termination: We reserve the right to suspend or terminate accounts for violations.</li>
                  </ol>
                </Card.Body>
              </Card>
            )}

            {/* Cookie Settings */}
            {activeSection === 'cookies' && (
              <Card className="shadow-sm mb-4" id="cookies">
                <Card.Body className="p-4">
                  <h1 className="fs-3 fw-semibold mb-4">Cookie Settings</h1>
                  <p className="text-muted mb-4">You can control your cookie preferences below.</p>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox" 
                        id="essential" 
                        label="Essential Cookies (always active)" 
                        disabled 
                        checked 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox" 
                        id="analytics" 
                        label="Analytics Cookies" 
                        defaultChecked 
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="checkbox" 
                        id="marketing" 
                        label="Marketing Cookies" 
                      />
                    </Form.Group>
                    <div className="text-end">
                      <Button type="submit" variant="primary">Save Preferences</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Legal;