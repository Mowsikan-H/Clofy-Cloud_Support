import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function PricingPlans() {
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <nav className="sticky-top pt-3" style={{ top: '24px' }}>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#pricing" className="text-decoration-none px-3 py-2 d-block rounded bg-primary bg-opacity-10 fw-medium">Pricing & Plans</a></li>
                <li className="mb-2"><a href="#features" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Features</a></li>
                <li className="mb-2"><a href="#addons" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Add‑Ons</a></li>
                <li className="mb-2"><a href="#faqs" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">FAQs</a></li>
                <li><a href="#contact" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Contact Sales</a></li>
              </ul>
            </nav>
          </Col>

          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Title */}
            <section className="mb-5">
              <h1 className="fs-2 fw-semibold mb-2">Pricing & Plans</h1>
              <p className="text-muted">Choose the plan that fits your needs. Upgrade or add extras anytime.</p>
            </section>

            {/* Plan Cards */}
            <section className="mb-5">
              <Row>
                {/* Free Plan */}
                <Col md={4} className="mb-4">
                  <Card className="shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <h2 className="fs-3 fw-semibold">Free</h2>
                      <div className="my-4">
                        <span className="fs-1 fw-bold">$0</span>
                        <span className="text-muted">/mo</span>
                      </div>
                      <ul className="list-unstyled text-start mb-4">
                        <li className="mb-2">✓ Unlimited community Q&A</li>
                        <li className="mb-2">✓ Access to public knowledge base</li>
                        <li>✓ Basic tagging & search</li>
                      </ul>
                      <Button variant="primary" className="w-100">Get Started</Button>
                    </Card.Body>
                  </Card>
                </Col>
                
                {/* AI Premium Plan */}
                <Col md={4} className="mb-4">
                  <Card className="shadow-sm h-100 text-center border-primary">
                    <Card.Body className="p-4">
                      <h2 className="fs-3 fw-semibold">AI Premium</h2>
                      <div className="my-4">
                        <span className="fs-1 fw-bold">$25</span>
                        <span className="text-muted">/mo</span>
                      </div>
                      <p className="text-muted small">Billed annually: $240/yr (save 20%)</p>
                      <ul className="list-unstyled text-start mb-4">
                        <li className="mb-2">✓ 100 AI credits/month</li>
                        <li className="mb-2">✓ Priority AI-generated solutions</li>
                        <li className="mb-2">✓ AI-powered insights & analytics</li>
                        <li>✓ Access to AI chat support</li>
                      </ul>
                      <Button variant="primary" className="w-100">Upgrade Now</Button>
                    </Card.Body>
                  </Card>
                </Col>
                
                {/* Engineer Support Plan */}
                <Col md={4} className="mb-4">
                  <Card className="shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <h2 className="fs-3 fw-semibold">Engineer Support</h2>
                      <div className="my-4">
                        <span className="fs-1 fw-bold">$100</span>
                        <span className="text-muted">/mo</span>
                      </div>
                      <p className="text-muted small">$1,080/yr (save 10%)</p>
                      <ul className="list-unstyled text-start mb-4">
                        <li className="mb-2">✓ 10 engineer tickets/month</li>
                        <li className="mb-2">✓ $10 per extra ticket</li>
                        <li className="mb-2">✓ Dedicated expert assistance</li>
                        <li>✓ Phone & email support</li>
                      </ul>
                      <Button variant="primary" className="w-100">Contact Sales</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </section>

            {/* Add‑Ons Section */}
            <section id="addons" className="mb-5">
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <h2 className="fs-4 fw-semibold mb-4">Add‑Ons</h2>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Card className="border h-100">
                        <Card.Body className="p-3">
                          <h3 className="fs-5 fw-medium">Extra AI Credits</h3>
                          <p className="text-muted small">Purchase additional AI credits anytime.</p>
                          <p className="fw-bold mt-2">$10 for 50 credits</p>
                          <Button variant="primary" className="mt-2">Buy Credits</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="border h-100">
                        <Card.Body className="p-3">
                          <h3 className="fs-5 fw-medium">Extra Engineer Tickets</h3>
                          <p className="text-muted small">Need more expert responses? Add extra tickets.</p>
                          <p className="fw-bold mt-2">$10 per ticket</p>
                          <Button variant="primary" className="mt-2">Buy Tickets</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </section>

            {/* FAQs Section */}
            <section id="faqs">
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <h2 className="fs-4 fw-semibold mb-4">FAQs</h2>
                  <div className="mb-3 pb-3 border-bottom">
                    <details>
                      <summary className="fw-medium cursor-pointer">What happens if I exceed my AI credits?</summary>
                      <p className="mt-2 text-muted">You can purchase add‑on credits or upgrade your plan at any time.</p>
                    </details>
                  </div>
                  <div className="mb-3 pb-3 border-bottom">
                    <details>
                      <summary className="fw-medium cursor-pointer">Can I switch plans mid-cycle?</summary>
                      <p className="mt-2 text-muted">Yes, you can upgrade or downgrade, and charges will adjust prorated.</p>
                    </details>
                  </div>
                  <div>
                    <details>
                      <summary className="fw-medium cursor-pointer">How do engineer tickets work?</summary>
                      <p className="mt-2 text-muted">Each ticket allows you to get a detailed response from a cloud engineering expert. Tickets are consumed when an engineer begins working on your issue.</p>
                    </details>
                  </div>
                </Card.Body>
              </Card>
            </section>
          </Col>

          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Need Help Choosing?</h4>
                <p className="text-muted mb-3">Contact our sales team for personalized recommendations.</p>
                <Button variant="primary" className="w-100">Contact Sales</Button>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Compare Plans</h4>
                <Table responsive size="sm" className="mt-3">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Free</th>
                      <th>AI Premium</th>
                      <th>Engineer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Community Q&A</td>
                      <td>✓</td>
                      <td>✓</td>
                      <td>✓</td>
                    </tr>
                    <tr>
                      <td>AI Credits</td>
                      <td>—</td>
                      <td>100/mo</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td>Engineer Tickets</td>
                      <td>—</td>
                      <td>—</td>
                      <td>10/mo</td>
                    </tr>
                    <tr>
                      <td>Annual Discount</td>
                      <td>—</td>
                      <td>20% off</td>
                      <td>10% off</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default PricingPlans;