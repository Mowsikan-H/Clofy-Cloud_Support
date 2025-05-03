import React from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function AccountBilling() {
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="account" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <h1 className="fs-3 fw-semibold mb-4">Account & Billing</h1>
            
            {/* Subscription Management */}
            <Card className="shadow-sm mb-4" id="subscription">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Subscription Management</h2>
                <p className="text-muted">Current Plan: <span className="fw-medium">AI Premium</span></p>
                <div className="mt-3">
                  <Button variant="outline-primary" className="me-2">Change Plan</Button>
                  <Button variant="outline-danger">Cancel Subscription</Button>
                </div>
              </Card.Body>
            </Card>
            
            {/* Payment Methods */}
            <Card className="shadow-sm mb-4" id="payments">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Payment Methods</h2>
                <Table responsive className="table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>Card</th>
                      <th>Expires</th>
                      <th>Default</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Visa •••• 4242</td>
                      <td>12/25</td>
                      <td>Yes</td>
                      <td className="text-end">
                        <Button variant="link" className="text-primary p-0 small">Remove</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Mastercard •••• 1234</td>
                      <td>11/24</td>
                      <td>No</td>
                      <td className="text-end">
                        <Button variant="link" className="text-primary p-0 small">Set Default</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Button variant="primary" className="mt-3">Add Payment Method</Button>
              </Card.Body>
            </Card>
            
            {/* Invoice History */}
            <Card className="shadow-sm mb-4" id="invoices">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Invoice History</h2>
                <Table responsive className="table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-04-15</td>
                      <td>$25.00</td>
                      <td>Paid</td>
                      <td>
                        <Button variant="link" className="text-primary p-0 small">PDF</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>2025-03-15</td>
                      <td>$100.00</td>
                      <td>Paid</td>
                      <td>
                        <Button variant="link" className="text-primary p-0 small">PDF</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            
            {/* Credit Top-Ups */}
            <Card className="shadow-sm mb-4" id="credits">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Credit Top-Ups</h2>
                <Row>
                  <Col md={6} className="mb-3">
                    <Card className="border">
                      <Card.Body className="p-3">
                        <h3 className="fs-5 fw-medium">Extra AI Credits</h3>
                        <p className="text-muted small">Add more AI credits to your account.</p>
                        <div className="d-flex align-items-center mt-2">
                          <Form.Control 
                            type="number" 
                            min="0" 
                            defaultValue="50" 
                            className="me-2" 
                            style={{ width: '80px' }} 
                          /> 
                          <span>credits</span>
                        </div>
                        <Button variant="primary" className="mt-3">Buy AI Credits</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="border">
                      <Card.Body className="p-3">
                        <h3 className="fs-5 fw-medium">Extra Engineer Tickets</h3>
                        <p className="text-muted small">Purchase additional engineer support tickets.</p>
                        <div className="d-flex align-items-center mt-2">
                          <Form.Control 
                            type="number" 
                            min="0" 
                            defaultValue="1" 
                            className="me-2" 
                            style={{ width: '80px' }} 
                          /> 
                          <span>ticket(s)</span>
                        </div>
                        <Button variant="primary" className="mt-3">Buy Tickets</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Billing Info</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Next Invoice: <span className="fw-medium">2025-05-15</span></li>
                  <li className="mb-2">Billing Email: <span className="fw-medium">user@example.com</span></li>
                  <li>Auto-Renew: <span className="fw-medium">Enabled</span></li>
                </ul>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Need Help?</h4>
                <p className="text-muted mb-3">Contact billing support for assistance.</p>
                <Button variant="primary" className="w-100">Contact Billing Support</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default AccountBilling;