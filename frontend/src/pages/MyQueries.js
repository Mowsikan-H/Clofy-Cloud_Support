import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Modal, InputGroup, Form } from 'react-bootstrap';
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
  
  // Add comment-related state variables
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  useEffect(() => {
    // Only fetch user incidents if the user is logged in
    if (currentUser._id || currentUser.id) { // Ensure currentUser and id are defined
      const fetchUserIncidents = async () => {
        try {
          setLoading(true);
          const response = await api.incidents.getUserIncidents(currentUser._id || currentUser.id);
          if (response && response.success) {
            setIncidents(response.data || []);
          } else {
            setError((response && response.message) || 'Failed to fetch incidents');
          }
        } catch (err) {
          setError(err.message || 'An error occurred while connecting to the server');
        } finally {
          setLoading(false);
        }
      };
      fetchUserIncidents();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const filteredIncidents = incidents.filter(incident => {
    if (activeFilter === 'all') return true;
    return incident.status === activeFilter;
  });
  
  // Handle upvoting an incident
  const handleUpvote = async (incidentId, e) => {
    e.preventDefault(); // Prevent navigation
    
    if (!currentUser) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      const response = await api.incidents.upvote(incidentId);
      
      if (response && response.success) {
        // Update the incidents list with the new vote count
        const updatedIncidents = incidents.map(incident => {
          if (incident._id === incidentId) {
            return {
              ...incident,
              votes: (incident.votes || 0) + 1,
              hasVoted: true
            };
          }
          return incident;
        });
        
        setIncidents(updatedIncidents);
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };
  
  // Add the renderStatusBadge function
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <Badge bg="primary">Open</Badge>;
      case 'in-progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      case 'closed':
        return <Badge bg="secondary">Closed</Badge>;
      case 'answered':
        return <Badge bg="info">Answered</Badge>;
      case 'escalated':
        return <Badge bg="danger">Escalated</Badge>;
      default:
        return null;
    }
  };
  
  // Add comment-related functions
  // Handle opening comment modal and fetching comments
  const handleOpenComments = async (incident) => {
    setCurrentIncident(incident);
    setShowCommentModal(true);
    setLoadingComments(true);
    
    try {
      const response = await api.incidents.getComments(incident._id);
      if (response && response.success) {
        setComments(response.data || []);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentIncident) return;
    
    try {
      const response = await api.incidents.addComment(currentIncident._id, { text: commentText });
      
      if (response && response.success) {
        // Add the new comment to the list
        setComments([...comments, response.data]);
        setCommentText(''); // Clear the input
      } else {
        console.error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle replying to a comment
  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  // Handle submitting a reply
  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo || !currentIncident) return;
    
    try {
      const response = await api.incidents.addReply(currentIncident._id, replyingTo, { text: replyText });
      
      if (response && response.success) {
        // Update the comments list with the new reply
        const updatedComments = comments.map(comment => {
          if (comment._id === replyingTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data]
            };
          }
          return comment;
        });
        
        setComments(updatedComments);
        setReplyText(''); // Clear the input
        setReplyingTo(null); // Reset replying state
      } else {
        console.error('Failed to add reply');
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };
  
  // Render different card layouts based on incident type
  const renderIncidentCard = (incident) => {
    const commonElements = (
      <div className="mt-2 d-flex flex-wrap gap-2">
        {incident.tags && Array.isArray(incident.tags) ? incident.tags.map(tag => (
          <Badge key={tag} bg="light" text="dark" className="rounded-pill">{tag}</Badge>
        )) : null}
      </div>
    );
    
    const userInfo = (
      <p className="mt-2 text-muted small">
        {incident.type === 'news' ? 'posted' : 'asked'} by <span className="fw-medium">{incident.user?.name || 'Anonymous'}</span> • 
        {new Date(incident.createdAt).toLocaleString()}
      </p>
    );
    
    // Interactive elements for all card types
    const interactiveElements = (
      <div className="d-flex mt-3 pt-2 border-top">
        <Button 
          variant="link" 
          className="text-muted p-0 me-3 d-flex align-items-center"
          onClick={(e) => handleUpvote(incident._id, e)}
          disabled={incident.hasVoted}
        >
          <i className={`bi bi-hand-thumbs-up${incident.hasVoted ? '-fill' : ''} me-1`}></i>
          <span>{typeof incident.votes === 'object' ? JSON.stringify(incident.votes) : incident.votes || 0} Upvotes</span>
        </Button>
        
        <Button 
          variant="link" 
          className="text-muted p-0 me-3 d-flex align-items-center"
          onClick={() => handleOpenComments(incident)}
        >
          <i className="bi bi-chat-left-text me-1"></i>
          <span>{incident.comments?.length || 0} Comments</span>
        </Button>
        
        <Button 
          as={Link}
          to={`/incident/${incident._id}`}
          variant="link" 
          className="text-muted p-0 d-flex align-items-center ms-auto"
        >
          
        </Button>
      </div>
    );
   
    switch(incident.type) {
      case 'question':
        return (
          <Card key={incident._id} className="shadow-sm hover-border-primary">
            <Card.Body className="p-3">
              <div className="d-flex">
                <div className="text-center me-3" style={{ width: '80px' }}>
                  <div className="fw-bold fs-5 text-primary">{incident.comments?.length || 0}</div>
                  <div className="small text-muted">answers</div>
                </div>
                <div className="text-center me-3" style={{ width: '80px' }}>
                  <div className="fw-bold fs-5">{incident.votes || 0}</div>
                  <div className="small text-muted">votes</div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                      {incident.title}
                    </Link>
                    <div>{renderStatusBadge(incident.status)}</div>
                  </div>
                  <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 150) + '...' : 'No description available'}</p>
                  {commonElements}
                  {userInfo}
                  {interactiveElements}
                </div>
              </div>
            </Card.Body>
          </Card>
        );
        
      case 'issue':
        return (
          <Card key={incident._id} className="shadow-sm hover-border-primary border-start border-danger border-3">
            <Card.Body className="p-3">
              <div className="d-flex">
                <div className="text-center me-3" style={{ width: '80px' }}>
                  <div className="fw-bold fs-5 text-danger">{incident.urgency || 'medium'}</div>
                  <div className="small text-muted">priority</div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Badge bg="danger" className="me-2">Issue</Badge>
                      <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                        {incident.title}
                      </Link>
                    </div>
                    <div>{renderStatusBadge(incident.status)}</div>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2 small text-muted">
                    <span><i className="bi bi-clock"></i> {new Date(incident.timestamp || incident.createdAt).toLocaleString()}</span>
                    {incident.service && <span><i className="bi bi-hdd"></i> {incident.service}</span>}
                    {incident.region && <span><i className="bi bi-geo"></i> {incident.region}</span>}
                  </div>
                  <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 120) + '...' : 'No description available'}</p>
                  {commonElements}
                  {userInfo}
                  {interactiveElements}
                </div>
              </div>
            </Card.Body>
          </Card>
        );
        
      case 'poll':
        // Calculate total votes for percentage
        const totalVotes = incident.options?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
        
        return (
          <Card key={incident._id} className="shadow-sm hover-border-primary border-start border-info border-3">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <Badge bg="info" className="me-2">Poll</Badge>
                  <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                    {incident.question || incident.title}
                  </Link>
                </div>
                <div>{renderStatusBadge(incident.status)}</div>
              </div>
              
              <div className="mt-3 mb-2">
                {incident.options?.slice(0, 3).map((option, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{typeof option === 'object' ? option.text : String(option)}</span>
                     
                    </div>
                    <ProgressBar 
                      now={totalVotes ? ((typeof option === 'object' ? option.votes || 0 : 0) / totalVotes) * 100 : 0} 
                      variant="info" 
                      style={{height: '8px'}}
                    />
                  </div>
                ))}
                {incident.options?.length > 3 && (
                  <div className="text-center small text-muted mt-2">
                    +{incident.options.length - 3} more options
                  </div>
                )}
              </div>
              
              <div className="d-flex justify-content-between align-items-center small text-muted mt-3">
                <span>{totalVotes} total votes</span>
                <span>Ends: {incident.endDate ? new Date(incident.endDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              
              {commonElements}
              {userInfo}
              {interactiveElements}
            </Card.Body>
          </Card>
        );
        
      case 'news':
        return (
          <Card key={incident._id} className="shadow-sm hover-border-primary border-start border-success border-3">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <Badge bg="success" className="me-2">News</Badge>
                  <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                    {incident.title}
                  </Link>
                </div>
                <div>{renderStatusBadge(incident.status)}</div>
              </div>
              
              {incident.excerpt && (
                <div className="bg-light p-2 border-start border-success border-2 my-2 fst-italic">
                  <p className="small mb-0">{incident.excerpt}</p>
                </div>
              )}
              
              <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 120) + '...' : 'No description available'}</p>
              
              <div className="d-flex justify-content-between align-items-center small text-muted">
                <span>
                  {incident.newsDate ? new Date(incident.newsDate).toLocaleDateString() : new Date(incident.createdAt).toLocaleDateString()}
                </span>
                {incident.sourceUrl && (
                  <a href={incident.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-muted">
                    Source <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                )}
              </div>
              
              {commonElements}
              {userInfo}
              {interactiveElements}
            </Card.Body>
          </Card>
        );
        
      default:
        // Default card for any other type
        return (
          <Card key={incident._id} className="shadow-sm hover-border-primary">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-start">
                <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                  {incident.title}
                </Link>
                <div>{renderStatusBadge(incident.status)}</div>
              </div>
              <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 150) + '...' : 'No description available'}</p>
              {commonElements}
              {userInfo}
              {interactiveElements}
            </Card.Body>
          </Card>
        );
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
                {filteredIncidents.map(incident => renderIncidentCard(incident))}
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
      
      {/* Comment Modal */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingComments ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {comments.map(comment => (
                <Card key={comment._id} className="border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-light rounded-circle p-2">
                          <i className="bi bi-person fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{comment.user?.name || 'Anonymous'}</h6>
                          <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                        </div>
                        <p className="mb-2">{comment.text}</p>
                        <Button 
                          variant="link" 
                          className="p-0 text-primary" 
                          onClick={() => handleReply(comment._id)}
                        >
                          Reply
                        </Button>
                        
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ms-4 mt-3 d-flex flex-column gap-3">
                            {comment.replies.map(reply => (
                              <div key={reply._id} className="border-start border-2 ps-3">
                                <div className="d-flex justify-content-between">
                                  <h6 className="mb-1 fs-6">{reply.user?.name || 'Anonymous'}</h6>
                                  <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                                </div>
                                <p className="mb-0 small">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Reply form */}
                        {replyingTo === comment._id && (
                          <div className="mt-3">
                            <InputGroup>
                              <Form.Control
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <Button variant="primary" onClick={handleSubmitReply}>
                                Send
                              </Button>
                            </InputGroup>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
          
          {/* Comment input */}
          <div className="mt-4">
            <InputGroup>
              <Form.Control
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="primary" onClick={handleSubmitComment}>
                Comment
              </Button>
            </InputGroup>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MyQueries;