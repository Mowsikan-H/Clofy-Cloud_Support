import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Image, Button, Form, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

function UserProfile() {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('activity');
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  
  // Add file state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    location: '',
    website: '',
    avatar: ''
  });
  
  const avatars = [
    'OIP (1).jpeg', 'OIP (2).jpeg', 'OIP (3).jpeg', 'OIP (4).jpeg',
    'OIP (5).jpeg', 'OIP (6).jpeg', 'OIP (7).jpeg', 'OIP (8).jpeg',
    'OIP (9).jpeg', 'OIP (10).jpeg', 'OIP (11).jpeg', 'OIP (12).jpeg',
    'OIP (13).jpeg', 'OIP (14).jpeg', 'OIP (15).jpeg', 'OIP (16).jpeg',
    'OIP (27).jpeg', 'OIP.jpeg'
  ];
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        company: currentUser.company || '',
        location: currentUser.location || '',
        website: currentUser.website || '',
        avatar: currentUser.avatar || ''
      });
      
      // Fetch user posts if on relevant tabs
      if (['posts', 'activity'].includes(activeTab)) {
        fetchUserPosts();
      }
    }
  }, [currentUser, activeTab]);
  
  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      // Use the API service to fetch user posts with the correct user ID
      const response = await api.incidents.getUserIncidents(currentUser._id || currentUser.id);
      
      if (response && response.success) {
        setUserPosts(response.data || []);
      } else {
        console.error('Failed to fetch user posts');
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };
  
    // Handle avatar selection
    const handleAvatarSelect = (avatar) => {
      setSelectedAvatar(avatar);
      setFormData(prev => ({
        ...prev,
        avatar: `/Avatars/${avatar}`
      }));
      
      setAvatarPreview(`/Avatars/${avatar}`);
      setShowAvatarModal(false);
    };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Add validation
    if (!formData.avatar) {
      setError('Please select an avatar');
      return;
    }
  
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        avatar: selectedAvatar ? `/Avatars/${selectedAvatar}` : formData.avatar
      };
      
      const response = await api.users.updateProfile(updateData);
      
      if (response?.success) {
        setSuccess('Profile updated successfully');
        if (updateUserProfile) {
          updateUserProfile(response.data);
          setFormData(prev => ({
            ...prev,
            avatar: response.data.avatar
          }));
        }
        setSelectedAvatar(null);
        setAvatarPreview(null);
      } else {
        setError(response?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      // Call the API to update password
      const response = await api.users.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response && response.success) {
        setSuccess('Password updated successfully');
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response?.message || 'Failed to update password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      // Call the API to upload avatar
      const response = await api.users.uploadAvatar(formData);
      
      if (response && response.success) {
        setSuccess('Profile picture updated successfully');
        // Update the current user in context
        if (updateUserProfile && response.data) {
          console.log('Updating user profile with new avatar:', response.data.avatar);
          updateUserProfile(response.data);
          
          // Also update the local form data
          setFormData(prev => ({
            ...prev,
            avatar: response.data.avatar
          }));
        }
        // Clear the file input
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setError(response?.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'An error occurred while uploading profile picture');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== currentUser?.email) {
      setError('Email confirmation does not match');
      return;
    }
    
    try {
      setLoading(true);
      // Call the API to delete account
      const response = await api.users.deleteAccount();
      
      if (response && response.success) {
        // Log the user out
        logout();
        // Redirect to home page
        navigate('/');
      } else {
        setError(response?.message || 'Failed to delete account');
        setShowDeleteModal(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting account');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="profile" />
          </Col>
           {/* Avatar Selection Modal */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAvatar && (
            <div className="text-center mb-3">
              <Image 
                src={`/Avatars/${selectedAvatar}`} 
                alt="Selected Avatar" 
                roundedCircle 
                width={100} 
                height={100} 
                className="mb-2"
              />
              <p>Preview of selected avatar</p>
            </div>
          )}
          <div className="d-flex flex-wrap gap-3">
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={`/Avatars/${avatar}`}
                alt={`Avatar ${index + 1}`}
                roundedCircle
                width={60}
                height={60}
                className="cursor-pointer"
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={async () => {
              try {
                setLoading(true);
                const updateData = {
                  ...formData,
                  avatar: `/Avatars/${selectedAvatar}`
                };
                
                const response = await api.users.updateProfile(updateData);
                
                if (response?.success) {
                  setSuccess('Avatar updated successfully');
                  if (updateUserProfile) {
                    updateUserProfile(response.data);
                    setFormData(prev => ({
                      ...prev,
                      avatar: response.data.avatar
                    }));
                  }
                  setShowAvatarModal(false);
                } else {
                  setError(response?.message || 'Failed to update avatar');
                }
              } catch (err) {
                console.error('Avatar update error:', err);
                setError(err.message || 'Failed to update avatar');
              } finally {
                setLoading(false);
              }
            }}
            disabled={!selectedAvatar || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
          {/* Main Content */}
          <Col lg={7} md={8}>
            {!currentUser ? (
              <Card className="shadow-sm mb-4">
                <Card.Body className="p-4 text-center">
                  <h2 className="fs-4 fw-semibold mb-3">Sign In to View Your Profile</h2>
                  <p className="text-muted mb-4">Please sign in to view and manage your profile.</p>
                  <Button as={Link} to="/login" variant="primary">Sign In</Button>
                  <div className="mt-3">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/register" className="text-decoration-none small">Sign Up</Link>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              // Content for logged in users
              <>
                {/* Profile Header */}
                <Card className="shadow-sm mb-4">
                  <Card.Body className="p-4 d-flex align-items-center">
                  <Image 
                    src={currentUser.avatar || "/Avatars/default.png"}
                    alt="Avatar"
                    onError={(e) => {
                      e.target.src = "/Avatars/default.png";
                    }}
                  />
<Button 
  variant="outline-secondary" 
  size="sm" 
  onClick={() => setShowAvatarModal(true)}
>
  Change Avatar
</Button>
                    <div>
                      <h1 className="fs-3 fw-semibold mb-1">{currentUser.name || 'User'}</h1>
                      <div className="d-flex flex-wrap gap-3 mt-2">
                        <span className="text-muted">Posts: <span className="fw-medium">{userPosts.length || 0}</span></span>
                        <span className="text-muted">Recent Activity: <span className="fw-medium">{userPosts.filter(post => {
                          const postDate = new Date(post.createdAt);
                          const now = new Date();
                          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
                          return postDate >= thirtyDaysAgo;
                        }).length || 0}</span></span>
                      </div>
                      {currentUser.badges && currentUser.badges.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {currentUser.badges.map((badge, index) => (
                            <span key={index} className={`badge bg-${badge.color} bg-opacity-25 text-${badge.color} rounded-pill px-3 py-2`}>
                              {badge.name}: {badge.level}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>

                {/* Error and Success Alerts */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                    {success}
                  </Alert>
                )}

                {/* Profile Tabs */}
                <Card className="shadow-sm mb-4">
                  <Card.Body className="p-3">
                    <Nav className="gap-3">
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'activity' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('activity')}
                      >
                        Activity
                      </Nav.Link>
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'posts' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('posts')}
                      >
                        Questions
                      </Nav.Link>
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'issues' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('issues')}
                      >
                        Issues
                      </Nav.Link>
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'polls' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('polls')}
                      >
                        Polls
                      </Nav.Link>
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'news' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('news')}
                      >
                        News
                      </Nav.Link>
                      <Nav.Link 
                        as="button" 
                        className={`border-0 bg-transparent ${activeTab === 'settings' ? 'text-primary fw-medium' : 'text-muted'}`}
                        onClick={() => setActiveTab('settings')}
                      >
                        Settings
                      </Nav.Link>
                    </Nav>
                  </Card.Body>
                </Card>

                {/* Activity Section */}
                {activeTab === 'activity' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h2 className="fs-5 fw-semibold mb-3">Recent Activity</h2>
                      {loading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.length > 0 ? (
                        <ul className="list-unstyled small text-muted">
                          {userPosts.slice(0, 5).map((post, index) => (
                            <li key={index} className="mb-2">
                              <span className="fw-medium">{currentUser.name}</span> 
                              {post.type === 'question' ? ' asked ' : post.type === 'news' ? ' posted ' : ' reported '}
                              <Link to={`/incident/${post._id}`} className="text-primary">
                                {post.title}
                              </Link> • 
                              {new Date(post.createdAt).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No recent activity found.</p>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Posts Section */}
                {activeTab === 'posts' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fs-5 fw-semibold mb-0">My Questions</h2>
                        <Button as={Link} to="/submit-incident" variant="outline-primary" size="sm">
                          Ask a Question
                        </Button>
                      </div>
                      {loading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.filter(post => post.type === 'question').length > 0 ? (
                        <ul className="list-unstyled">
                          {userPosts.filter(post => post.type === 'question').map((post, index) => (
                            <li key={index} className="border-bottom pb-3 mb-3">
                              <Link to={`/incident/${post._id}`} className="text-primary fw-medium">
                                {post.title}
                              </Link>
                              <p className="text-muted small mt-1 mb-1">
                                {post.description ? post.description.substring(0, 100) + '...' : 'No description'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-muted">{new Date(post.createdAt).toLocaleString()}</span>
                                <span>
                                  <i className="bi bi-chat-left-text me-1"></i> {post.comments?.length || 0} Comments
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-3">You haven't asked any questions yet.</p>
                          <Button as={Link} to="/submit-incident" variant="primary" size="sm">
                            Ask Your First Question
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Issues Section */}
                {activeTab === 'issues' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fs-5 fw-semibold mb-0">My Issues</h2>
                        <Button as={Link} to="/submit-incident" variant="outline-primary" size="sm">
                          Report an Issue
                        </Button>
                      </div>
                      {loading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.filter(post => post.type === 'issue').length > 0 ? (
                        <ul className="list-unstyled">
                          {userPosts.filter(post => post.type === 'issue').map((post, index) => (
                            <li key={index} className="border-bottom pb-3 mb-3">
                              <Link to={`/incident/${post._id}`} className="text-primary fw-medium">
                                {post.title}
                              </Link>
                              <p className="text-muted small mt-1 mb-1">
                                {post.description ? post.description.substring(0, 100) + '...' : 'No description'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-muted">{new Date(post.createdAt).toLocaleString()}</span>
                                <span>
                                  <i className="bi bi-chat-left-text me-1"></i> {post.comments?.length || 0} Comments
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-3">You haven't reported any issues yet.</p>
                          <Button as={Link} to="/submit-incident" variant="primary" size="sm">
                            Report Your First Issue
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Polls Section */}
                {activeTab === 'polls' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fs-5 fw-semibold mb-0">My Polls</h2>
                        <Button as={Link} to="/submit-incident" variant="outline-primary" size="sm">
                          Create a Poll
                        </Button>
                      </div>
                      {loading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.filter(post => post.type === 'poll').length > 0 ? (
                        <ul className="list-unstyled">
                          {userPosts.filter(post => post.type === 'poll').map((post, index) => (
                            <li key={index} className="border-bottom pb-3 mb-3">
                              <Link to={`/incident/${post._id}`} className="text-primary fw-medium">
                                {post.title || post.question}
                              </Link>
                              <p className="text-muted small mt-1 mb-1">
                                {post.description ? post.description.substring(0, 100) + '...' : 'No description'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-muted">{new Date(post.createdAt).toLocaleString()}</span>
                                <span>
                                  <i className="bi bi-bar-chart-fill me-1"></i> {post.options?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0} Votes
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-3">You haven't created any polls yet.</p>
                          <Button as={Link} to="/submit-incident" variant="primary" size="sm">
                            Create Your First Poll
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* News Section */}
                {activeTab === 'news' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fs-5 fw-semibold mb-0">My News</h2>
                        <Button as={Link} to="/submit-incident" variant="outline-primary" size="sm">
                          Post News
                        </Button>
                      </div>
                      {loading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userPosts.filter(post => post.type === 'news').length > 0 ? (
                        <ul className="list-unstyled">
                          {userPosts.filter(post => post.type === 'news').map((post, index) => (
                            <li key={index} className="border-bottom pb-3 mb-3">
                              <Link to={`/incident/${post._id}`} className="text-primary fw-medium">
                                {post.title}
                              </Link>
                              <p className="text-muted small mt-1 mb-1">
                                {post.description ? post.description.substring(0, 100) + '...' : 'No description'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-muted">{new Date(post.createdAt).toLocaleString()}</span>
                                <span>
                                  <i className="bi bi-chat-left-text me-1"></i> {post.comments?.length || 0} Comments
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-3">You haven't posted any news yet.</p>
                          <Button as={Link} to="/submit-incident" variant="primary" size="sm">
                            Post Your First News
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Badges Section */}
                {activeTab === 'badges' && (
                  <Card className="shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h2 className="fs-5 fw-semibold mb-3">Badges</h2>
                      <Row>
                        <Col md={3} sm={6} className="mb-3">
                          <div className="bg-warning bg-opacity-10 p-3 rounded text-center">
                            <div className="fs-4 fw-bold text-warning">Gold</div>
                            <div className="small">{currentUser.badges?.filter(b => b.level === 'Gold').length || 0} earned</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                          <div className="bg-primary bg-opacity-10 p-3 rounded text-center">
                            <div className="fs-4 fw-bold text-primary">Silver</div>
                            <div className="small">{currentUser.badges?.filter(b => b.level === 'Silver').length || 0} earned</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                          <div className="bg-success bg-opacity-10 p-3 rounded text-center">
                            <div className="fs-4 fw-bold text-success">Bronze</div>
                            <div className="small">{currentUser.badges?.filter(b => b.level === 'Bronze').length || 0} earned</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                          <div className="bg-info bg-opacity-10 p-3 rounded text-center">
                            <div className="fs-4 fw-bold text-info">AI-Premium</div>
                            <div className="small">{currentUser.badges?.filter(b => b.name === 'AI-Premium').length || 0} earned</div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Settings Section */}
                {activeTab === 'settings' && (
                  <>
                    {/* Profile Settings */}
                    <Card className="shadow-sm mb-4">
                      <Card.Body className="p-4">
                        <h2 className="fs-5 fw-semibold mb-3">Profile Settings</h2>
                        <Form onSubmit={handleProfileUpdate}>
                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleInputChange} 
                                  required 
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                  type="email" 
                                  name="email" 
                                  value={formData.email} 
                                  onChange={handleInputChange} 
                                  required 
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-3" controlId="bio">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={3} 
                              name="bio" 
                              value={formData.bio} 
                              onChange={handleInputChange} 
                              placeholder="Tell us about yourself"
                            />
                          </Form.Group>
                        
                          
                          {/* Hidden file input */}
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          
                          {/* Show preview if file is selected */}
                          {avatarFile && (
                            <div className="mb-3">
                              <div className="d-flex align-items-center">
                                <Image 
                                  src={avatarPreview} 
                                  alt="Preview" 
                                  roundedCircle 
                                  width={60} 
                                  height={60} 
                                  className="me-3"
                                />
                                <div>
                                  <p className="mb-1">{avatarFile.name}</p>
                                  <div>
                                    <Button 
                                      variant="primary" 
                                      size="sm" 
                                      onClick={handleAvatarUpload}
                                      disabled={loading}
                                      className="me-2"
                                    >
                                      {loading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                    <Button 
                                      variant="outline-secondary" 
                                      size="sm" 
                                      onClick={() => {
                                        setAvatarFile(null);
                                        setAvatarPreview(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                    
                    {/* Password Settings */}
                    <Card className="shadow-sm mb-4">
                      <Card.Body className="p-4">
                        <h2 className="fs-5 fw-semibold mb-3">Change Password</h2>
                        <Form onSubmit={handlePasswordUpdate}>
                          <Form.Group className="mb-3" controlId="currentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control 
                              type="password" 
                              name="currentPassword" 
                              value={passwordData.currentPassword} 
                              onChange={handlePasswordChange} 
                              required 
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control 
                              type="password" 
                              name="newPassword" 
                              value={passwordData.newPassword} 
                              onChange={handlePasswordChange} 
                              required 
                              minLength={8}
                            />
                            <Form.Text className="text-muted">
                              Password must be at least 8 characters long.
                            </Form.Text>
                          </Form.Group>
                          
                          <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control 
                              type="password" 
                              name="confirmPassword" 
                              value={passwordData.confirmPassword} 
                              onChange={handlePasswordChange} 
                              required 
                            />
                          </Form.Group>
                          
                          <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loading}
                          >
                            {loading ? 'Updating...' : 'Update Password'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                    
                    {/* Delete Account */}
                    <Card className="shadow-sm mb-4 border-danger">
                      <Card.Body className="p-4">
                        <h2 className="fs-5 fw-semibold mb-3 text-danger">Delete Account</h2>
                        <p className="text-muted mb-3">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete Account
                        </Button>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {currentUser && (
              <>
                {/* Profile Summary */}
                <Card className="shadow-sm mb-4">
                  <Card.Body className="p-4">
                    <h4 className="fs-5 fw-semibold mb-2">Profile Summary</h4>
                    <ul className="list-unstyled small">
                      <li className="mb-2">Member since: <span className="fw-medium">
                        {new Date(currentUser.createdAt).toLocaleDateString() || 'N/A'}
                      </span></li>
                      <li className="mb-2">Total Questions: <span className="fw-medium">
                        {userPosts.filter(post => post.type === 'question').length || 0}
                      </span></li>
                      <li className="mb-2">Total Answers: <span className="fw-medium">
                        {currentUser.totalAnswers || 0}
                      </span></li>
                      <li>Tickets Submitted: <span className="fw-medium">
                        {userPosts.filter(post => post.type === 'issue').length || 0}
                      </span></li>
                    </ul>
                  </Card.Body>
                </Card>
                
               
              </>
            )}
          </Col>
        </Row>
      </Container>
      
      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">This action cannot be undone. All your data will be permanently deleted.</p>
          <p className="mb-3">Please type your email <strong>{currentUser?.email}</strong> to confirm:</p>
          <Form.Control 
            type="text" 
            value={deleteConfirmation} 
            onChange={(e) => setDeleteConfirmation(e.target.value)} 
            placeholder="Enter your email"
            className="mb-3"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount} 
            disabled={deleteConfirmation !== currentUser?.email || loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </div>
  );
}

export default UserProfile;
