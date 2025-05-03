import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function SLADashboard() {
  const slaChartRef = useRef(null);
  const responseChartRef = useRef(null);
  const creditChartRef = useRef(null);
  const engineerChartRef = useRef(null);
  
  useEffect(() => {
    // SLA Compliance Chart
    const slaChart = new Chart(slaChartRef.current, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [{
          label: 'SLA %',
          data: [99, 98, 97, 99, 98.5, 98, 98.5],
          fill: false,
          borderColor: '#2563eb',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        }
      }
    });
    
    // Response Time Chart
    const responseChart = new Chart(responseChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Avg Response (hrs)',
          data: [1.2, 1.5, 1.1, 1.4],
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
    
    // AI Credits Chart
    const creditChart = new Chart(creditChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [{
          data: [350, 650],
          backgroundColor: ['#2563eb', '#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
    
    // Engineer Tickets Chart
    const engineerChart = new Chart(engineerChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [{
          data: [6, 4],
          backgroundColor: ['#2563eb', '#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      slaChart.destroy();
      responseChart.destroy();
      creditChart.destroy();
      engineerChart.destroy();
    };
  }, []);
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="analytics" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <h1 className="fs-3 fw-semibold mb-4">SLA & Analytics Dashboard</h1>
            
            {/* Top Metrics */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">SLA Compliance</h4>
                    <p className="fs-1 fw-bold text-success mb-0">98.5%</p>
                    <small className="text-muted">Past 30 days</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">Avg. Response Time</h4>
                    <p className="fs-1 fw-bold mb-0">1h 24m</p>
                    <small className="text-muted">Past 30 days</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium">AI Credits Used</h4>
                    <p className="fs-1 fw-bold mb-0">350 / 1000</p>
                    <small className="text-muted">This month</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Charts Section */}
            <Row className="mb-4">
              {/* SLA Compliance Over Time */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">SLA Compliance Over Time</h4>
                    <div style={{ height: '250px' }}>
                      <canvas ref={slaChartRef}></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              {/* Response Time Trend */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">Response Time Trend</h4>
                    <div style={{ height: '250px' }}>
                      <canvas ref={responseChartRef}></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Usage Breakdown */}
            <Row>
              {/* AI Credits Usage */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">AI Credits Usage</h4>
                    <div style={{ height: '200px' }}>
                      <canvas ref={creditChartRef}></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              {/* Engineer Hours Usage */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-medium mb-3">Engineer Tickets Usage</h4>
                    <div style={{ height: '200px' }}>
                      <canvas ref={engineerChartRef}></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Insights & Tips</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Maintain SLA by reducing response time below 2h.</li>
                  <li className="mb-2">Use add-on credits if you exceed monthly AI limit.</li>
                  <li>Monitor peaks in ticket volume to allocate resources.</li>
                </ul>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-3">Export Data</h4>
                <Button variant="primary" className="w-100">Download CSV</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default SLADashboard;