import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import Footer from '../components/Footer';
// Add these imports
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function AdminModeration() {
  const usageChartRef = useRef(null);
  const ticketsChartRef = useRef(null);
  const creditsChartRef = useRef(null);
  const healthChartRef = useRef(null);
  
  useEffect(() => {
    // Initialize charts
    const usageChart = new Chart(usageChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Total Tickets',
          data: [120, 150, 130, 170],
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
    
    const ticketsChart = new Chart(ticketsChartRef.current, {
      type: 'line',
      data: {
        labels: ['Week1', 'Week2', 'Week3', 'Week4'],
        datasets: [{
          label: 'Tickets',
          data: [30, 40, 20, 60],
          borderColor: '#3b82f6',
          tension: 0.1
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
    
    const creditsChart = new Chart(creditsChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [{
          data: [400, 600],
          backgroundColor: ['#3b82f6', '#e5e7eb']
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
    
    const healthChart = new Chart(healthChartRef.current, {
      type: 'line',
      data: {
        labels: ['0h', '6h', '12h', '18h', '24h'],
        datasets: [{
          label: 'Latency(ms)',
          data: [110, 120, 115, 130, 125],
          borderColor: '#3b82f6',
          tension: 0.1
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
      usageChart.destroy();
      ticketsChartRef.destroy();
      creditsChartRef.destroy();
      healthChartRef.destroy();
    };
  }, []);
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      
      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <nav className="sticky-top pt-3" style={{ top: '24px' }}>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#users" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">User Moderation</a></li>
                <li className="mb-2"><a href="#routing" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Ticket Routing Rules</a></li>
                <li className="mb-2"><a href="#reports" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">Usage Reports</a></li>
                <li><a href="#health" className="text-decoration-none px-3 py-2 d-block rounded hover-bg-light">System Health</a></li>
              </ul>
            </nav>
          </Col>
          
          {/* Main Content */}
          <Col lg={10}>
            {/* User Moderation */}
            <Card className="shadow-sm mb-4" id="users">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">User Moderation</h2>
                <Table responsive className="table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>user123</td>
                      <td>Member</td>
                      <td>Active</td>
                      <td>
                        <Button variant="link" className="text-primary p-0 me-2 small">View</Button>
                        <Button variant="link" className="text-warning p-0 me-2 small">Suspend</Button>
                        <Button variant="link" className="text-danger p-0 small">Ban</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>cloudpro</td>
                      <td>Premium</td>
                      <td>Active</td>
                      <td>
                        <Button variant="link" className="text-primary p-0 me-2 small">View</Button>
                        <Button variant="link" className="text-warning p-0 me-2 small">Suspend</Button>
                        <Button variant="link" className="text-danger p-0 small">Ban</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>admin_user</td>
                      <td>Admin</td>
                      <td>Active</td>
                      <td>
                        <Button variant="link" className="text-primary p-0 me-2 small">View</Button>
                        <Button variant="link" className="text-warning p-0 me-2 small">Suspend</Button>
                        <Button variant="link" className="text-danger p-0 small">Ban</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Button variant="primary">Load More Users</Button>
              </Card.Body>
            </Card>
            
            {/* Ticket Routing Rules */}
            <Card className="shadow-sm mb-4" id="routing">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Ticket Routing Rules</h2>
                <ul className="list-unstyled mb-3">
                  <li className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <span><strong>Rule #1:</strong> All 'Security' tickets → Security Team</span>
                    <div>
                      <Button variant="link" className="text-primary p-0 me-2 small">Edit</Button>
                      <Button variant="link" className="text-danger p-0 small">Delete</Button>
                    </div>
                  </li>
                  <li className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <span><strong>Rule #2:</strong> All 'AWS' tickets → Cloud Team</span>
                    <div>
                      <Button variant="link" className="text-primary p-0 me-2 small">Edit</Button>
                      <Button variant="link" className="text-danger p-0 small">Delete</Button>
                    </div>
                  </li>
                  <li className="d-flex justify-content-between align-items-center p-2">
                    <span><strong>Rule #3:</strong> All 'Critical' priority → Senior Engineers</span>
                    <div>
                      <Button variant="link" className="text-primary p-0 me-2 small">Edit</Button>
                      <Button variant="link" className="text-danger p-0 small">Delete</Button>
                    </div>
                  </li>
                </ul>
                <Button variant="success">Add New Rule</Button>
              </Card.Body>
            </Card>
            
            {/* Usage Reports */}
            <Card className="shadow-sm mb-4" id="reports">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Usage Reports</h2>
                <div className="mb-4" style={{ height: '250px' }}>
                  <canvas ref={usageChartRef}></canvas>
                </div>
                <Row>
                  <Col md={6} className="mb-4">
                    <h4 className="fs-5 fw-medium mb-2">Monthly Tickets</h4>
                    <div style={{ height: '200px' }}>
                      <canvas ref={ticketsChartRef}></canvas>
                    </div>
                  </Col>
                  <Col md={6} className="mb-4">
                    <h4 className="fs-5 fw-medium mb-3">AI Credits Consumption</h4>
                    <div style={{ height: '250px' }}>
                      <canvas ref={creditsChartRef}></canvas>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* System Health */}
            <Card className="shadow-sm" id="health">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-4">System Health</h2>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">API Latency: <span className="fw-medium">120ms</span></li>
                  <li className="mb-2">Service Uptime: <span className="fw-medium text-success">99.98%</span></li>
                  <li className="mb-2">Error Rate: <span className="fw-medium text-danger">0.03%</span></li>
                </ul>
                <div style={{ height: '250px' }}>
                  <canvas ref={healthChartRef}></canvas>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default AdminModeration;