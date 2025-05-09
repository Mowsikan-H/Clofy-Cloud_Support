import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function IncidentDetail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const { currentUser } = useAuth();

  // Fetch the incident data
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true);
        const response = await api.incidents.getById(id);
        
        if (response.success) {
          setIncident(response.data);
          setComments(response.data.comments || []);
        } else {
          setError(response.message || 'Failed to fetch incident');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidentData();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await api.comments.create({
        incident: id,
        content: commentText,
        parentComment: replyingTo
      });
      
      if (response.success) {
        setComments([...comments, response.data]);
        setCommentText('');
        setReplyingTo(null);
      } else {
        alert(response.message || 'Failed to post comment');
      }
    } catch (err) {
      alert(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle reply form visibility
  const toggleReply = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo(commentId);
      setCommentText(''); // Clear any existing text
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      
      <div className="d-flex">
        {/* Left Sidebar */}
        <div className="d-none d-lg-block" style={{ width: '240px', background: '#2b2b2b', color: '#fff', padding: '20px', height: '100vh', boxSizing: 'border-box' }}>
          <Sidebar activePage="posts" />
        </div>
        
        {/* Main Content */}
        <div style={{ flex: '1', padding: '30px', overflowY: 'auto', background: '#fff', maxWidth: '800px', margin: 'auto' }}>
          {incident && (
            <>
              {/* Post Header */}
              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
                <h1 style={{ margin: '0', color: '#333' }}>{incident.title}</h1>
                <div style={{ color: '#777', fontSize: '0.85rem', marginTop: '5px' }}>
                  Asked by <strong>{incident.user?.name || 'Anonymous'}</strong> • 
                  {incident.provider || 'Cloud'} • 
                  {new Date(incident.createdAt).toLocaleDateString()} • 
                  {comments.length} {comments.length === 1 ? 'answer' : 'answers'}
                </div>
              </div>
              
              {/* Post Content */}
              <div style={{ marginTop: '20px', lineHeight: '1.6', color: '#444' }}>
                <p>{incident.description}</p>
                {incident.tags && incident.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {incident.tags.map((tag, index) => (
                      <Badge key={index} bg="light" text="dark" className="rounded-pill">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Comments Section */}
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Answers & Comments</h2>
                
                {comments.length === 0 ? (
                  <p className="text-muted">No answers yet. Be the first to respond!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="d-flex" style={{ marginBottom: '20px' }}>
                      {/* User Avatar */}
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', marginRight: '10px' }}>
                        {/* Avatar content */}
                      </div>
                      
                      {/* Comment Content */}
                      <div style={{ flex: '1' }}>
                        <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '10px 15px' }}>
                          <p style={{ margin: '5px 0', color: '#333' }}>{comment.content}</p>
                          <div style={{ fontSize: '0.8rem', color: '#777' }}>
                            {comment.user?.name || 'Anonymous'} • 
                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          
                          {currentUser && (
                            <button 
                              style={{ fontSize: '0.8rem', color: '#0078d4', background: 'none', border: 'none', cursor: 'pointer', marginTop: '5px' }}
                              onClick={() => toggleReply(comment._id)}
                            >
                              Reply
                            </button>
                          )}
                        </div>
                        
                        {/* Reply Form */}
                        {replyingTo === comment._id && (
                          <div style={{ marginTop: '20px' }}>
                            <Form onSubmit={handleCommentSubmit}>
                              <Form.Group className="mb-2">
                                <Form.Control
                                  as="textarea"
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', height: '80px' }}
                                  placeholder="Write your reply..."
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  disabled={submitting}
                                />
                              </Form.Group>
                              <Button 
                                style={{ marginTop: '10px', padding: '8px 16px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                type="submit"
                                disabled={submitting}
                              >
                                {submitting ? 'Posting...' : 'Submit Reply'}
                              </Button>
                            </Form>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Main Comment Form */}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Your Answer</h3>
                  <Form onSubmit={handleCommentSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', height: '80px' }}
                        placeholder="Write your answer..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={submitting}
                      />
                    </Form.Group>
                    <Button 
                      style={{ padding: '8px 16px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Posting...' : 'Post Answer'}
                    </Button>
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default IncidentDetail;