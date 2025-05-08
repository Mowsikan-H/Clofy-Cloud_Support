import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function MyQueries() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchUserIncidents = async () => {
      try {
        setLoading(true);
        console.log('Fetching user incidents...');
        
        // Check if api.incidents exists
        if (!api || !api.incidents || !api.incidents.getAll) {
          console.error('API service not properly configured:', api);
          throw new Error('API service not properly configured');
        }
        
        // Check if the getUserIncidents method exists, otherwise fall back to getAll with filtering
        if (api.incidents.getUserIncidents) {
          // Use dedicated endpoint to fetch only user's incidents
          const response = await api.incidents.getUserIncidents(currentUser?.id);
          console.log('API response:', response);
          
          if (response && response.success) {
            setIncidents(response.data || []);
          } else {
            console.error('API error:', response);
            setError((response && response.message) || 'Failed to fetch incidents');
          }
        } else {
          // Fallback to the current approach if getUserIncidents is not available
          const response = await api.incidents.getAll();
          console.log('API response:', response);
          
          if (response && response.success) {
            // Filter incidents to only show those created by the current user
            const userIncidents = response.data.filter(incident => 
              incident.userId === currentUser?.id || incident.createdBy === currentUser?.id
            );
            setIncidents(userIncidents || []);
          } else {
            console.error('API error:', response);
            setError((response && response.message) || 'Failed to fetch incidents');
          }
        }
      } catch (err) {
        console.error('Error fetching user incidents:', err);
        setError(err.message || 'An error occurred while connecting to the server');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserIncidents();
  }, [currentUser]);
  
  // Filter incidents by status if activeFilter is not 'all'
  const filteredIncidents = incidents.filter(incident => {
    if (activeFilter === 'all') return true;
    return incident.status === activeFilter;
  });
  
  // Function to render the appropriate status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <Badge bg="danger">Open</Badge>;
      case 'answered':
        return <Badge bg="success">Answered</Badge>;
      case 'escalated':
        return <Badge bg="warning" text="dark">Escalated</Badge>;
      default:
        return <Badge bg="secondary">Processing</Badge>;
    }
  };
  
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
            <h2 className="fs-3 fw-semibold mb-4">My Posts</h2>
            
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

            {/* Loading and Error States */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : filteredIncidents.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No posts found.</p>
                <Link to="/submit-incident" className="btn btn-primary mt-2">Create a New Post</Link>
              </div>
            ) : (
              /* Posts List */
              <div className="d-flex flex-column gap-3">
                {filteredIncidents.map(incident => (
                  <Card key={incident._id} className="shadow-sm">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between">
                        <div>
                          <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                            {incident.title}
                          </Link>
                          <p className="text-muted small mt-1">
                            Submitted: {new Date(incident.createdAt).toLocaleDateString()} • Tags: 
                            {incident.tags && incident.tags.map(tag => (
                              <Badge key={tag} bg="light" text="dark" className="ms-1 me-1">{tag}</Badge>
                            ))}
                          </p>
                        </div>
                        <div className="text-end">
                          {renderStatusBadge(incident.status)}
                          <div className="mt-2">
                            {incident.status !== 'answered' && (
                              <Button variant="primary" size="sm">Upgrade</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Summary */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Post Summary</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2">Total Posts: <span className="fw-medium">{incidents.length}</span></li>
                  <li className="mb-2">Open: <span className="fw-medium">
                    {incidents.filter(incident => incident.status === 'open').length}
                  </span></li>
                  <li className="mb-2">Answered: <span className="fw-medium">
                    {incidents.filter(incident => incident.status === 'answered').length}
                  </span></li>
                  <li>Escalated: <span className="fw-medium">
                    {incidents.filter(incident => incident.status === 'escalated').length}
                  </span></li>
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

export default MyQueries;