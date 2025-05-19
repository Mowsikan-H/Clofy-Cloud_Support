import React from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, ProgressBar, Modal, InputGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function PostsList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('No user found in localStorage');
      // Optionally redirect to login page
      // window.location.href = '/login';
      return;
    }

    // Log user data for debugging
    console.log('Current user from localStorage:', JSON.parse(user));
  }, []);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        console.log('Fetching incidents...');
        
        // Check if api.incidents exists
        if (!api || !api.incidents || !api.incidents.getAll) {
          console.error('API service not properly configured:', api);
          throw new Error('API service not properly configured');
        }
        
        const response = await api.incidents.getAll();
        console.log('API response:', response);
        
        if (response && response.success) {
          // Process incidents to set selectedOption based on userVotedOption
          const processedIncidents = response.data.map(incident => {
            // If this is a poll and the user has voted, set the selectedOption
            if (incident.type === 'poll' && incident.userVotedOption !== undefined) {
              return {
                ...incident,
                selectedOption: incident.userVotedOption
              };
            }
            return incident;
          });
          
          setIncidents(processedIncidents || []);
        } else {
          console.error('API error:', response);
          setError((response && response.message) || 'Failed to fetch incidents');
        }
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError(err.message || 'An error occurred while connecting to the server');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidents();
  }, []);
  
  // Filter incidents by type and search term
  const filteredIncidents = incidents.filter(incident => {
    // First filter by type
    if (filter !== 'all' && incident.type !== filter) {
      return false;
    }
    
    // Then filter by search term if not empty
    if (tagFilter) {
      const searchTerm = tagFilter.toLowerCase();
      
      // Check tags
      const hasMatchingTag = incident.tags && 
        incident.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      // Check username
      const hasMatchingUsername = incident.user && 
        incident.user.name && 
        incident.user.name.toLowerCase().includes(searchTerm);
      
      // Check cloud provider
      const hasMatchingProvider = incident.provider && 
        incident.provider.toLowerCase().includes(searchTerm);
      
      // Check title
      const hasMatchingTitle = incident.title && 
        incident.title.toLowerCase().includes(searchTerm);
      
      // Check service (for issues)
      const hasMatchingService = incident.service && 
        incident.service.toLowerCase().includes(searchTerm);
      
      // Return true if any field matches
      return hasMatchingTag || hasMatchingUsername || hasMatchingProvider || 
             hasMatchingTitle || hasMatchingService;
    }
    
    return true;
  });
  
  // Handle opening comment modal and fetching comments
  // Add new state to track which posts have expanded comment sections
  const [expandedComments, setExpandedComments] = useState({});
  
  // Modify the handleOpenComments function to close any other open comments first
  const handleOpenComments = async (incidentId) => {
    // Toggle expanded state for this incident
    const newExpandedState = {}; // Reset to empty object instead of copying current state
    
    // If we're closing the comments section, just set empty state and return
    if (expandedComments[incidentId]) {
      setExpandedComments({});
      return;
    }
    
    // If we're opening comments, fetch them first
    setLoadingComments(true);
    
    try {
      const incident = incidents.find(inc => inc._id === incidentId);
      setCurrentIncident(incident);
      
      const response = await api.incidents.getComments(incidentId);
if (response && response.success) {
  console.log('Comment data received:', response.data); // Add this line
  setComments(response.data || []);
        // Now expand ONLY this comment section
        newExpandedState[incidentId] = true;
        setExpandedComments(newExpandedState);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };
  
  const handleDeleteReply = async (commentId, replyId, e) => {
    e.preventDefault(); // Prevent default link behavior

    // Find the comment and reply to check ownership
    const comment = comments.find(c => c._id === commentId);
    const reply = comment?.replies?.find(r => r._id === replyId);
    
    // Allow deletion if user is admin OR the reply owner
    if (!currentUser || (String(currentUser.id) !== String(reply?.user?._id) && currentUser.role !== 'admin')) {
      alert('You are not authorized to perform this action.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        console.log(`Attempting to delete reply with ID: ${replyId} for comment ${commentId} on incident ${currentIncident._id}`);
        const response = await api.incidents.deleteReply(currentIncident._id, commentId, replyId);

        if (response && response.success) {
          // Update the comments state to remove the deleted reply
          setComments(comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply._id !== replyId)
              };
            }
            return comment;
          }));
          alert('Reply deleted successfully.');
        } else {
          console.error('Failed to delete reply:', response);
          alert(response?.message || 'Failed to delete reply.');
        }
      } catch (err) {
        console.error('Error deleting reply:', err);
        alert(err.message || 'An error occurred while deleting the reply.');
      }
    }
  };

  const handleDeleteIncident = async (incidentId, e) => {
    e.preventDefault(); // Prevent navigation
    
    if (!currentUser || currentUser.role !== 'admin') {
      alert('You are not authorized to perform this action.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // Assuming you have an api.incidents.delete function
        // You will need to implement this function in your api service file
        const response = await api.incidents.deleteIncident(incidentId); 
        
        if (response && response.success) {
          // Remove the deleted incident from the state
          setIncidents(incidents.filter(incident => incident._id !== incidentId));
        } else {
          console.error('Failed to delete incident:', response);
          alert(response?.message || 'Failed to delete post.');
        }
      } catch (err) {
        console.error('Error deleting incident:', err);
        alert(err.message || 'An error occurred while deleting the post.');
      }
    }
  };

  const handleDeleteComment = async (commentId, e) => {
    e.preventDefault(); // Prevent default link behavior

    // Find the comment to check ownership
    const comment = comments.find(c => c._id === commentId);
    
    // Allow deletion if user is admin OR the comment owner
    if (!currentUser || (String(currentUser.id) !== String(comment?.user?._id) && currentUser.role !== 'admin')) {
      alert('You are not authorized to perform this action.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        console.log(`Attempting to delete comment with ID: ${commentId} for incident ${currentIncident._id}`);
        const response = await api.incidents.deleteComment(currentIncident._id, commentId);

        if (response && response.success) {
          // Remove the deleted comment from the state
          setComments(comments.filter(comment => comment._id !== commentId));
          alert('Comment deleted successfully.');
        } else {
          console.error('Failed to delete comment:', response);
          alert(response?.message || 'Failed to delete comment.');
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert(err.message || 'An error occurred while deleting the comment.');
      }
    }
  };
  
  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentIncident || !currentUser) {
      alert('Please enter comment');
      return;
    }
    
    try {
      const response = await api.incidents.addComment(currentIncident._id, { 
        text: commentText 
      });
      
      if (response && response.success) {
        setComments([...comments, response.data]);
        setCommentText('');
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
  
  // Handle opening poll voting modal
  const handleOpenPollVoting = (incident) => {
    setCurrentIncident(incident);
    setSelectedOption(null);
    setShowPollModal(true);
  };
  
  // Handle submitting a poll vote
  // Handle removing a poll vote
  const handleRemoveVote = async (incidentId) => {
    if (!currentUser) return;
    
    try {
      const response = await api.incidents.removeVote(incidentId);
      
      if (response && response.success) {
        // Update the incidents list to reflect the removed vote
        const updatedIncidents = incidents.map(incident => {
          if (incident._id === incidentId) {
            // Get the previously selected option
            const prevOptionIndex = incident.selectedOption;
            
            // Create a deep copy of options to update vote counts
            const updatedOptions = incident.options.map((option, index) => {
              if (index === prevOptionIndex) {
                // Decrement vote for previously selected option
                return {
                  ...option,
                  votes: Math.max(0, (option.votes || 0) - 1)
                };
              }
              return option;
            });
            
            return {
              ...incident,
              options: updatedOptions,
              selectedOption: undefined,
              userVotedOption: undefined  // Clear userVotedOption when removing vote
            };
          }
          return incident;
        });
        
        setIncidents(updatedIncidents);
      } else {
        console.error('Error removing vote:', response?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error removing vote:', err);
    }
  };
  
  const handleSubmitVote = async (incidentId, optionIndex) => {
    if (!currentUser) return;
    try {
      const response = await api.incidents.vote(incidentId, { optionIndex });
      if (response && response.success) {
        const updatedIncidents = incidents.map(incident => {
          if (incident._id === incidentId) {
            const prevOptionIndex = incident.selectedOption;
            const updatedOptions = incident.options.map((option, index) => {
              let votes = option.votes || 0;
              // Remove vote from previous option
              if (prevOptionIndex !== undefined && index === prevOptionIndex) {
                votes = Math.max(0, votes - 1);
              }
              // Add vote to newly selected option
              if (index === optionIndex) {
                votes += 1;
              }
              return {
                ...option,
                votes
              };
            });
            return {
              ...incident,
              options: updatedOptions,
              selectedOption: optionIndex,
              userVotedOption: optionIndex // update this so UI reflects immediately
            };
          }
          return incident;
        });
        setIncidents(updatedIncidents);
        setShowPollModal(false);
      } else {
        console.error('Voting failed:', response?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
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
      <div className="d-flex justify-content-between align-items-center mt-3">
  {/* Delete Button (Admin Only) */}
        {currentUser?.role === 'admin' && (
          <Button
            variant="link"
            className="text-danger p-0 small"
            onClick={(e) => handleDeleteIncident(incident._id, e)}
            title="Delete Post"
          >
            <i className="bi bi-trash"></i> Delete
          </Button>
        )}

        <Button 
          variant="link" 
          className="text-muted p-0 me-3 d-flex align-items-center"
          onClick={() => handleOpenComments(incident._id)}
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
    
    // Create the comments section component
    const commentsSection = expandedComments[incident._id] && (
      <div className="comments-section mt-3 pt-3 border-top">
        <h6 className="mb-3">Comments</h6>
        
        {loadingComments && currentIncident?._id === incident._id ? (
          <div className="text-center py-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading comments...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted small">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="comment-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment mb-3 pb-2 border-bottom">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="avatar bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                      <i className="bi bi-person"></i>
                    </div>
                  </div>
                  <div className="ms-2 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center"> {/* Added align-items-center */}
                      <div> {/* Wrap name and date in a div */}
                        <h6 className="mb-0 small">{comment.user?.name || 'Anonymous'}</h6>
                        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                      </div>
                      {/* Delete Button for Comments (Admin or Owner) */}
                      {(() => {
  console.log('Delete button check - Current User:', currentUser);
  console.log('Delete button check - Comment User:', comment.user);
  return (currentUser?.role === 'admin' || String(currentUser?.id) === String(comment.user?._id)) && (
    <Button
      variant="link"
      className="text-danger p-0 small ms-2"
      onClick={(e) => handleDeleteComment(comment._id, e)}
      title="Delete Comment"
    >
      <i className="bi bi-trash"></i>
    </Button>
  );
})()}
                    </div>
                    <p className="mb-1 small">{comment.text}</p>
                    <Button
                      variant="link"
                      className="p-0 text-muted small"
                      onClick={() => handleReply(comment._id)}
                    >
                      Reply
                    </Button>

                    {/* Replies */}
                    {comment.replies && comment.replies.map(reply => (
                      <div key={reply._id} className="d-flex mt-3 ms-4">
                        {/* Reply User Avatar */}
                        <div className="me-2">
                          <Image
                            src={reply.user.avatar || '/Avatars/OIP (1).jpeg'}
                            roundedCircle
                            width="30"
                            height="30"
                            alt={reply.user.name || 'User'}
                          />
                        </div>

                        {/* Reply Content */}
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center">
                            <strong className="me-2">{reply.user.name || 'Anonymous'}</strong>
                            <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                            {/* Delete button for replies */}
                            {(() => {
  console.log('Reply delete button check - Current User:', currentUser);
  console.log('Reply delete button check - Reply User:', reply.user);
  return (String(currentUser?.id) === String(reply.user?._id) || currentUser?.role === 'admin') ? (
    <Button
      variant="link"
      className="text-danger p-0 small ms-2"
      onClick={(e) => handleDeleteReply(comment._id, reply._id, e)}
    >
      Delete
    </Button>
  ) : null;
})()}
                          </div>
                          <p className="mb-0">{reply.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Reply form */}
                    {replyingTo === comment._id && (
                      <div className="reply-form mt-2">
                        <div className="input-group">
                          <Form.Control
                            size="sm"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <Button size="sm" variant="outline-primary" onClick={handleSubmitReply}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* New comment form */}
        <div className="new-comment-form mt-3">
          <Form.Group>
            <Form.Label className="small">Add a comment</Form.Label>
            <div className="input-group">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="primary" onClick={handleSubmitComment}>
                Comment
              </Button>
            </div>
          </Form.Group>
        </div>
      </div>
    );
    
    // Now modify each card type to include the comments section
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
                    <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                      {incident.title}
                    </Link>
                    <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 150) + '...' : 'No description available'}</p>
                    {commonElements}
                    {userInfo}
                    {interactiveElements}
                  </div>
                </div>
                {commentsSection}
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
                    <div className="d-flex align-items-center">
                      <Badge bg="danger" className="me-2">Issue</Badge>
                      <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                        {incident.title}
                      </Link>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2 small text-muted">
                      <span><i className="bi bi-clock"></i> {new Date(incident.timestamp).toLocaleString()}</span>
                      <span><i className="bi bi-hdd"></i> {incident.service}</span>
                      {incident.region && <span><i className="bi bi-geo"></i> {incident.region}</span>}
                    </div>
                    <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 120) + '...' : 'No description available'}</p>
                    {commonElements}
                    {userInfo}
                    {interactiveElements}
                  </div>
                </div>
                {commentsSection}
              </Card.Body>
            </Card>
          );
          
        case 'poll':
          const totalVotes = incident.options?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
          return (
            <Card key={incident._id} className="shadow-sm hover-border-primary border-start border-info border-3">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-2">
                  <Badge bg="info" className="me-2">Poll</Badge>
                  <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                    {incident.question || incident.title}
                  </Link>
                </div>
                
                <div className="mt-3 mb-2">
                  {incident.options?.map((option, index) => (
                    <div key={index} className="mb-2">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Form.Check
                          type="radio"
                          name={`poll-${incident._id}`}
                          id={`poll-${incident._id}-${index}`}
                          checked={incident.userVotedOption === index}
                          onChange={() => handleSubmitVote(incident._id, index)}
                          disabled={incident.hasEnded}
                        />
                        <label htmlFor={`poll-${incident._id}-${index}`} className="flex-grow-1 small mb-0">
                          {typeof option === 'object' ? option.text : String(option)}
                          <span className="text-muted ms-2">({typeof option === 'object' ? option.votes || 0 : 0} votes)</span>
                          {incident.userVotedOption === index && (
                            <span className="ms-2 text-success fw-semibold">You have voted for this option</span>
                          )}
                        </label>
                      </div>
                      {incident.userVotedOption !== undefined && (
                        <ProgressBar
                          now={totalVotes ? ((typeof option === 'object' ? option.votes || 0 : 0) / totalVotes) * 100 : 0}
                          variant="info"
                          style={{height: '8px'}}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between align-items-center small text-muted mt-3">
                  <span>{totalVotes} total votes</span>
                  <span>Ends: {incident.endDate ? new Date(incident.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                
                {incident.selectedOption !== undefined && (
                  <div className="mt-2">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveVote(incident._id)}
                    >
                      <i className="bi bi-x-circle me-1"></i> Remove Vote
                    </Button>
                  </div>
                )}
                {commonElements}
                {userInfo}
                {interactiveElements}
                {commentsSection}
              </Card.Body>
            </Card>
          );
          
        case 'news':
          return (
            <Card key={incident._id} className="shadow-sm hover-border-primary border-start border-success border-3">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-2">
                  <Badge bg="success" className="me-2">News</Badge>
                  <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                    {incident.title}
                  </Link>
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
                {commentsSection}
              </Card.Body>
            </Card>
          );
          
        default:
          // Default card for any other type
          return (
            <Card key={incident._id} className="shadow-sm hover-border-primary">
              <Card.Body className="p-3">
                <Link to={`/incident/${incident._id}`} className="text-primary fw-medium fs-5 text-decoration-none">
                  {incident.title}
                </Link>
                <p className="text-muted small mt-2">{incident.description ? incident.description.substring(0, 150) + '...' : 'No description available'}</p>
                {commonElements}
                {userInfo}
                {interactiveElements}
                {commentsSection}
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
              <Sidebar activePage="questions" />
            </Col>
            
            {/* Main Content */}
            <Col lg={7} md={8}>
              {/* Header Bar */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fs-4 fw-semibold mb-0">All Posts</h2>
                <div className="d-flex gap-2">
                  <Link to="/submit-post" className="btn btn-primary">Submit Post</Link>
                </div>
              </div>
              
              {/* Type Filter */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Posts
                </Button>
                <Button 
                  variant={filter === 'question' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setFilter('question')}
                >
                  Questions
                </Button>
                <Button 
                  variant={filter === 'issue' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setFilter('issue')}
                >
                  Issues
                </Button>
                <Button 
                  variant={filter === 'poll' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setFilter('poll')}
                >
                  Polls
                </Button>
                <Button 
                  variant={filter === 'news' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setFilter('news')}
                >
                  News
                </Button>
              </div>
              
              {/* Tag Filter */}
              {/* Enhanced Search Bar */}
              <Form.Group className="mb-4">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="Search by tags, usernames, cloud providers..." 
                    className="border px-3 py-2"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        // Apply the filter immediately on Enter
                        setTagFilter(e.target.value.trim());
                      }
                    }}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setTagFilter('')}
                    title="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                </InputGroup>
                {tagFilter && (
                  <div className="mt-2 d-flex align-items-center">
                    <span className="me-2 small">Active search:</span>
                    <Badge bg="primary" className="d-flex align-items-center">
                      {tagFilter}
                      <Button 
                        variant="link" 
                        className="p-0 ms-2 text-white" 
                        onClick={() => setTagFilter('')}
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </Button>
                    </Badge>
                  </div>
                )}
              </Form.Group>
            
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
                <p className="text-muted">No posts found. Be the first to submit a post!</p>
                <Button as={Link} to="/submit-post" variant="primary" className="mt-3">
                 
                    <div className="d-flex gap-2">
                      <Link to="/submit-post" className="btn btn-primary">Submit Post</Link>
                    </div>
                 
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredIncidents.map(incident => renderIncidentCard(incident))}
              </div>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Premium CTA */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Get Engineer Support</h4>
                <p className="text-muted mb-3">Contact our team to get direct Engineer help.</p>
                <Link to="/pricing" className="btn btn-primary d-block">Contact Support</Link>
              </Card.Body>
            </Card>
            
            {/* Top Tags */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Top Tags</h4>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="light" text="dark" className="rounded-pill">aws</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">azure</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">gcp</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">docker</Badge>
                  <Badge bg="light" text="dark" className="rounded-pill">kubernetes</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
     {/* Comments Modal */}
     <Modal show={showCommentModal} onHide={() => { setShowCommentModal(false); setReplyingTo(null); setCommentText(''); setReplyText(''); setExpandedComments({}); }}>
        {/* ... existing code ... */}
        <Modal.Body>
          {/* ... existing code ... */}
          <div className="comments-list mt-4">
            {loadingComments ? (
              <div className="text-center">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-muted">No comments yet.</div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-2">
                      {/* User Avatar Placeholder */}
                      <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                           style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="small">{comment.user?.name || 'Anonymous'}</strong>
                        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                      </div>
                      <p className="mb-1 small">{comment.text}</p>
                      <div className="d-flex gap-2 small">
                        <Button variant="link" className="p-0 text-primary" onClick={() => setReplyingTo(comment._id)}>Reply</Button>
                        {/* Add Delete Button - Visible only to Admin */}
                        {currentUser?.role === 'admin' && (
                          <Button
                            variant="link"
                            className="p-0 text-danger"
                            onClick={(e) => handleDeleteComment(comment._id, e)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      {/* Reply form */}
                      {replyingTo === comment._id && (
                        <Form className="mt-2" onSubmit={(e) => { // Change onSubmit handler
                          e.preventDefault(); // Prevent default form submission
                          handleSubmitReply(); // Call the correct function
                        }}>
                          <InputGroup size="sm">
                            <Form.Control
                              as="textarea"
                              rows={1}
                              placeholder={`Reply to ${comment.user?.name || 'this comment'}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <Button variant="primary" type="submit">Post Reply</Button>
                          </InputGroup>
                        </Form>
                      )}
                      {/* Display Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="replies mt-2 ps-3 border-start">
                          {comment.replies.map(reply => (
                            <div key={reply._id} className="reply mb-2 pb-2 border-bottom">
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2">
                                  {/* User Avatar Placeholder */}
                                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                       style={{ width: '25px', height: '25px', fontSize: '10px' }}>
                                    {reply.user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <strong className="small">{reply.user?.name || 'Anonymous'}</strong>
                                    <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                                  </div>
                                  <p className="mb-1 small">{reply.text}</p>
                                  {/* Add Delete Button for Replies - Visible only to Admin */}
                                  {currentUser?.role === 'admin' && (
                                    <Button
                                      variant="link"
                                      className="p-0 text-danger small"
                                      onClick={(e) => handleDeleteComment(reply._id, e)} // Assuming replies are also comments with their own IDs
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        {/* ... existing code ... */}
      </Modal>

      
      {/* Poll Voting Modal */}
      <Modal show={showPollModal} onHide={() => setShowPollModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vote on Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentIncident && (
            <>
              <h5>{currentIncident.question || currentIncident.title}</h5>
              <Form>
                {currentIncident.options?.map((option, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    id={`poll-option-${index}`}
                    name="pollOption"
                    label={typeof option === 'object' ? option.text : String(option)}
                    onChange={() => setSelectedOption(index)}
                    checked={selectedOption === index}
                    className="mb-2"
                  />
                ))}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPollModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitVote}
            disabled={selectedOption === null || votingLoading}
          >
            {votingLoading ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </div>
  );
}

export default PostsList;