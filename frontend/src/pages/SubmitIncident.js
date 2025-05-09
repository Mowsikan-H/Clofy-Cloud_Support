import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function SubmitIncident() {
  const [showModal, setShowModal] = useState(false);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [type, setType] = useState('question'); // Default to question
  const [provider, setProvider] = useState('aws');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Issue form specific states
  const [timestamp, setTimestamp] = useState('');
  const [service, setService] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [components, setComponents] = useState('');
  const [category, setCategory] = useState('performance');
  const [region, setRegion] = useState('');
  
  // News form specific states
  const [newsDate, setNewsDate] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  
  // Poll form specific states
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); 
  const [duration, setDuration] = useState('7'); // Default 7 days
  
  // Step tracking for issue form
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const tagInputRef = useRef(null);
  
  // Reset form fields when type changes
  useEffect(() => {
    // Reset common fields
    setTitle('');
    setDescription('');
    setTags([]);
    setProvider('aws');
    
    // Reset form-specific fields
    if (type === 'issue') {
      setTimestamp('');
      setService('');
      setUrgency('medium');
      setComponents('');
      setCategory('performance');
      setRegion('');
      setCurrentStep(1);
    } else if (type === 'news') {
      setNewsDate('');
      setSourceUrl('');
      setExcerpt('');
    } else if (type === 'poll') {
      setQuestion('');
      setOptions(['', '']);
      setDuration('7');
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on type
    if (type === 'poll') {
      if (!question.trim()) {
        setError('Please provide a poll question');
        return;
      }
      
      // Check if at least two options are filled
      const filledOptions = options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        setError('Please provide at least two options');
        return;
      }
    } else if (type === 'issue') {
      // For issues, only validate required fields
      if (!title.trim()) {
        setError('Please provide a title');
        return;
      }
      if (currentStep === 1 && !timestamp) {
        setError('Please provide when the issue started');
        return;
      }
      if (currentStep === 1 && !service.trim()) {
        setError('Please provide the affected service');
        return;
      }
    } else if (type === 'news') {
      // For news, only validate the headline (title)
      if (!title.trim()) {
        setError('Please provide a headline');
        return;
      }
    } else if (!title.trim() || !description.trim()) {
      // For other types (question, other), require both title and description
      setError('Please provide both a title and description');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data based on type
      let data = {
        type,
        provider,
        tags
      };
      
      if (type === 'poll') {
        data = {
          ...data,
          title: question, // Map question to title for backend compatibility
          question,
          options: options.filter(opt => opt.trim()), // Filter out empty options
          duration
        };
      } else {
        data = {
          ...data,
          title,
          description
        };
        
        // Add type-specific fields
        if (type === 'issue') {
          data = {
            ...data,
            timestamp,
            service,
            urgency,
            components,
            category,
            region,
            description: description || '' // Ensure description is at least an empty string
          };
        } else if (type === 'news') {
          data = {
            ...data,
            newsDate,
            sourceUrl,
            excerpt,
            description: description || '' // Ensure description is at least an empty string
          };
        }
      }
      
      const response = await api.incidents.create(data);
      
      if (response.success) {
        navigate(`/incidents`);
      } else {
        setError(response.message || 'Failed to create incident');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Check if the modal should be shown when component mounts
  useEffect(() => {
    const hideCloudModal = localStorage.getItem('hideCloudModal');
    if (!hideCloudModal) {
      setShowReadyModal(true);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Remove these lines from the component body
  // const hideCloudModal = localStorage.getItem('hideCloudModal');
  // if (!hideCloudModal) {
  //   setShowReadyModal(true);
  // }

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (tags.length < 5 && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagsContainerClick = () => {
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };
  const handleStartPosting = () => {
    setShowReadyModal(false);
  };
  
  // Function to handle "Don't Show Again"
  const handleDontShowAgain = () => {
    localStorage.setItem('hideCloudModal', 'true');
    setShowReadyModal(false);
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };
  
  // Render different forms based on type
  const renderFormFields = () => {
    switch(type) {
      case 'question':
        return (
          <>
            {/* Brief Title */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Brief Title <span className="text-muted small">(one sentence)</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. 'AWS S3 bucket access issue'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            
            {/* Detailed Description */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Detailed Description <span className="text-muted small">(optional)</span>
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={6}
                placeholder="Provide more context, logs, error messages, links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            
            {/* Provider and Tags Row */}
            <Row className="mb-4">
              {/* Cloud Provider */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-medium">Cloud Service Provider</Form.Label>
                  <Form.Select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value="aws">AWS</option>
                    <option value="azure">Azure</option>
                    <option value="gcp">Google Cloud</option>
                    <option value="ibm">IBM Cloud</option>
                    <option value="oracle">Oracle Cloud</option>
                    <option value="ovh">OVHcloud</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {/* Tags */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-medium">
                    Tags <span className="text-muted small">(add up to 5)</span>
                  </Form.Label>
                  <div 
                    className="border rounded p-2 d-flex flex-wrap align-items-center" 
                    style={{ minHeight: '42px', cursor: 'text' }}
                    onClick={handleTagsContainerClick}
                  >
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-light rounded-pill px-2 py-1 me-1 mb-1 d-inline-flex align-items-center"
                      >
                        {tag}
                        <Button 
                          variant="link" 
                          className="p-0 ms-1 text-muted" 
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                    <Form.Control
                      ref={tagInputRef}
                      type="text"
                      className="border-0 flex-grow-1"
                      style={{ minWidth: '60px', width: 'auto' }}
                      placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </div>
                  <Form.Text className="text-muted small">
                    Use tags like 'storage', 'serverless', 'security'.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </>
        );
        
      case 'issue':
        return (
          <>
            {/* Stepper */}
            <div className="d-flex justify-content-between mb-4">
              <div className={`text-center flex-fill ${currentStep === 1 ? 'text-primary' : 'text-muted'}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep === 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '30px', height: '30px'}}>
                  1
                </div>
                <div>Core Details</div>
              </div>
              <div className={`text-center flex-fill ${currentStep === 2 ? 'text-primary' : 'text-muted'}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep === 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '30px', height: '30px'}}>
                  2
                </div>
                <div>Additional Context</div>
              </div>
            </div>
            
            {currentStep === 1 ? (
              <>
                {/* Problem Summary */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Describe the problem in one sentence</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    placeholder="e.g. 'API returns 500 on upload'"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                
                {/* When did it start */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">When did it start?</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    required
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                  />
                </Form.Group>
                
                <Row className="mb-4">
                  {/* Cloud Provider */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-medium">Cloud Provider</Form.Label>
                      <Form.Select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                      >
                        <option value="aws">Amazon Web Services (AWS)</option>
                        <option value="azure">Microsoft Azure</option>
                        <option value="gcp">Google Cloud Platform (GCP)</option>
                        <option value="ibm">IBM Cloud</option>
                        <option value="oracle">Oracle Cloud Infrastructure (OCI)</option>
                        <option value="ovh">OVHcloud</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  {/* Affected Service */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-medium">Affected Service</Form.Label>
                      <Form.Control 
                        type="text" 
                        required
                        placeholder="e.g. S3, Azure VM, Pub/Sub"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Urgency Level */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Urgency Level</Form.Label>
                  <Form.Select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Next: More Context
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Affected Components */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Affected Components <span className="text-muted small">(optional)</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. web-frontend, database"
                    value={components}
                    onChange={(e) => setComponents(e.target.value)}
                  />
                </Form.Group>
                
                {/* Issue Category */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Issue Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="performance">Performance</option>
                    <option value="availability">Availability</option>
                    <option value="security">Security</option>
                    <option value="config">Configuration</option>
                    <option value="integration">Integration</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                
                {/* Affected Region */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Affected Region <span className="text-muted small">(optional)</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. us-east-1, eu-west-2"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Form.Group>
                
                {/* Detailed Description */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Detailed Description <span className="text-muted small">(optional)</span></Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={6}
                    placeholder="Any additional details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                
                {/* Tags */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    Tags <span className="text-muted small">(add up to 5)</span>
                  </Form.Label>
                  <div 
                    className="border rounded p-2 d-flex flex-wrap align-items-center" 
                    style={{ minHeight: '42px', cursor: 'text' }}
                    onClick={handleTagsContainerClick}
                  >
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-light rounded-pill px-2 py-1 me-1 mb-1 d-inline-flex align-items-center"
                      >
                        {tag}
                        <Button 
                          variant="link" 
                          className="p-0 ms-1 text-muted" 
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                    <Form.Control
                      ref={tagInputRef}
                      type="text"
                      className="border-0 flex-grow-1"
                      style={{ minWidth: '60px', width: 'auto' }}
                      placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </div>
                  <Form.Text className="text-muted small">
                    Use tags like 'storage', 'serverless', 'security'.
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </>
        );
        
      case 'news':
        return (
          <>
            {/* Headline */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Headline <span className="text-muted small">(one sentence)</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. 'AWS launches new S3 feature'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            
            {/* Date of News */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Date of News <span className="text-muted small">(optional)</span>
              </Form.Label>
              <Form.Control 
                type="date"
                value={newsDate}
                onChange={(e) => setNewsDate(e.target.value)}
              />
            </Form.Group>
            
            {/* Source URL */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Source URL <span className="text-muted small">(optional)</span>
              </Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://example.com/article"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </Form.Group>
            
            {/* Excerpt / Summary */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Excerpt / Summary <span className="text-muted small">(optional, 1-2 sentences)</span>
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                placeholder="Provide a brief summary..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </Form.Group>
            
            {/* Cloud Provider */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Cloud Provider</Form.Label>
              <Form.Select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="all">All Providers</option>
                <option value="aws">Amazon Web Services (AWS)</option>
                <option value="azure">Microsoft Azure</option>
                <option value="gcp">Google Cloud Platform (GCP)</option>
                <option value="ibm">IBM Cloud</option>
                <option value="oracle">Oracle Cloud Infrastructure (OCI)</option>
                <option value="ovh">OVHcloud</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            {/* Tags */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Tags <span className="text-muted small">(add up to 5)</span>
              </Form.Label>
              <div 
                className="border rounded p-2 d-flex flex-wrap align-items-center" 
                style={{ minHeight: '42px', cursor: 'text' }}
                onClick={handleTagsContainerClick}
              >
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-light rounded-pill px-2 py-1 me-1 mb-1 d-inline-flex align-items-center"
                  >
                    {tag}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-muted" 
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </Button>
                  </span>
                ))}
                <Form.Control
                  ref={tagInputRef}
                  type="text"
                  className="border-0 flex-grow-1"
                  style={{ minWidth: '60px', width: 'auto' }}
                  placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
              </div>
              <Form.Text className="text-muted small">
                Use tags like 'release', 'feature', 'security'.
              </Form.Text>
            </Form.Group>
          </>
        );
        
      // In your poll case of renderFormFields function
      case 'poll':
        return (
          <>
            {/* Poll Question */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Poll Question <span className="text-muted small">(one sentence)</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. 'Which cloud provider do you prefer for serverless?'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Group>
            
            {/* Poll Options */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Poll Options <span className="text-muted small">(min 2, max 6)</span>
              </Form.Label>
              {options.map((option, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control 
                    type="text" 
                    required
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}
              {options.length < 6 && (
                <Button 
                  variant="light" 
                  size="sm" 
                  onClick={addOption}
                  className="mt-2"
                >
                  + Add another option
                </Button>
              )}
            </Form.Group>
            
            {/* Poll Duration */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Poll Duration (days)</Form.Label>
              <Form.Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
              </Form.Select>
            </Form.Group>
            
            {/* Tags */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Tags <span className="text-muted small">(add up to 5)</span>
              </Form.Label>
              <div 
                className="border rounded p-2 d-flex flex-wrap align-items-center" 
                style={{ minHeight: '42px', cursor: 'text' }}
                onClick={handleTagsContainerClick}
              >
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-light rounded-pill px-2 py-1 me-1 mb-1 d-inline-flex align-items-center"
                  >
                    {tag}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-muted" 
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </Button>
                  </span>
                ))}
                <Form.Control
                  ref={tagInputRef}
                  type="text"
                  className="border-0 flex-grow-1"
                  style={{ minWidth: '60px', width: 'auto' }}
                  placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
              </div>
              <Form.Text className="text-muted small">
                Use tags like 'opinion', 'feedback', 'community'.
              </Form.Text>
            </Form.Group>
          </>
        );

        default: // Other
        return (
          <>
            {/* Brief Title */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Brief Title <span className="text-muted small">(one sentence)</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. 'Feature request or suggestion'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            
            {/* Detailed Description */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Detailed Description <span className="text-muted small">(required)</span>
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={6}
                required
                placeholder="Provide detailed information about your submission..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            
            {/* Provider and Tags Row */}
            <Row className="mb-4">
              {/* Cloud Provider */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-medium">Related Cloud Service</Form.Label>
                  <Form.Select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value="aws">AWS</option>
                    <option value="azure">Azure</option>
                    <option value="gcp">Google Cloud</option>
                    <option value="ibm">IBM Cloud</option>
                    <option value="oracle">Oracle Cloud</option>
                    <option value="ovh">OVHcloud</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {/* Tags */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-medium">
                    Tags <span className="text-muted small">(add up to 5)</span>
                  </Form.Label>
                  <div 
                    className="border rounded p-2 d-flex flex-wrap align-items-center" 
                    style={{ minHeight: '42px', cursor: 'text' }}
                    onClick={handleTagsContainerClick}
                  >
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-light rounded-pill px-2 py-1 me-1 mb-1 d-inline-flex align-items-center"
                      >
                        {tag}
                        <Button 
                          variant="link" 
                          className="p-0 ms-1 text-muted" 
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                    <Form.Control
                      ref={tagInputRef}
                      type="text"
                      className="border-0 flex-grow-1"
                      style={{ minWidth: '60px', width: 'auto' }}
                      placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </div>
                  <Form.Text className="text-muted small">
                    Use tags like 'feature-request', 'documentation', 'improvement'.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </>
        );
    }
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="submit" />
          </Col>
          
          {/* Main Form */}
          <Col lg={7} md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h2 className="fs-3 fw-semibold mb-3">Submit Your Cloud Query or News</h2>
                <p className="text-muted small mb-4">Use this form to share cloud-related news, ask questions, report issues, or submit suggestions.</p>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  {/* Type of Submission */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Type of Submission</Form.Label>
                    <Form.Select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="question">Question</option>
                      <option value="issue">Issue</option>
                      <option value="news">News</option>
                      <option value="poll">Poll</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  
                  {renderFormFields()}
                  
                  {/* Submit Button */}
                  <div className="d-grid mt-4">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                      className="py-2"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-3">Submission Guidelines</h4>
                <ul className="small text-muted ps-3">
                  <li className="mb-2">Be specific about your cloud issue</li>
                  <li className="mb-2">Include any error messages exactly as they appear</li>
                  <li className="mb-2">Mention what you've already tried</li>
                  <li>Add relevant tags to get faster responses</li>
                </ul>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-3">Need Faster Resolution?</h4>
                <p className="small text-muted">Upgrade to get direct access to cloud engineers and AI-powered solutions.</p>
                <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>View Upgrade Options</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
      
      {/* Ready to Share Modal */}
  <Modal 
    show={showReadyModal} 
    onHide={() => setShowReadyModal(false)}
    centered
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Ready to Share Your Cloud Post?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>You're about to contribute to our Cloud Forum—let's make it as helpful as possible!</p>
      <ul>
        <li><strong>Search existing threads</strong> to avoid duplicates.</li>
        <li><strong>Summarize your cloud scenario</strong> in one sentence.</li>
        <li><strong>List what you've tried</strong>—configurations, commands, uploads.</li>
        <li><strong>Include details</strong> like provider (AWS/Azure/GCP), service, region, and any error messages.</li>
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="link" onClick={handleDontShowAgain}>Don't Show Again</Button>
      <Button variant="primary" onClick={handleStartPosting}>Start Writing</Button>
    </Modal.Footer>
  </Modal>
    </div>
  );
}

export default SubmitIncident;
