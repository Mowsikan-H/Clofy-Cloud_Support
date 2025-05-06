import React from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Add these imports
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
const { currentUser } = useAuth();

// Add this useEffect to fetch the incident data
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

// Add this function to handle comment submission
const handleCommentSubmit = async (e) => {
  e.preventDefault();
  
  if (!commentText.trim()) {
    return;
  }
  
  try {
    setSubmitting(true);
    
    const response = await api.comments.create({
      incident: id,
      content: commentText
    });
    
    if (response.success) {
      setComments([...comments, response.data]);
      setCommentText('');
    } else {
      alert(response.message || 'Failed to post comment');
    }
  } catch (err) {
    alert(err.message || 'An error occurred');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="posts" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            {/* Question Detail */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex">
                  {/* Vote Control */}
                  <div className="text-center me-3">
                    <Button variant="link" className="text-muted p-0 fs-4">▲</Button>
                    <div className="fs-3 fw-bold my-1">3</div>
                    <Button variant="link" className="text-muted p-0 fs-4">▼</Button>
                  </div>
                  
                  {/* Question Content */}
                  <div>
                    <h1 className="fs-3 fw-semibold mb-2">How to configure AWS IAM roles for cross-account access?</h1>
                    <p className="text-muted small mb-3">Asked by <span className="fw-medium">user123</span> • 2 hours ago</p>
                    <div className="mb-3">
                      <p>I need to allow services in one AWS account to access resources in another. What's the best practice for setting up IAM roles and trust policies to enable cross-account access securely?</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg="light" text="dark" className="rounded-pill">aws</Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">iam</Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">security</Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">cross-account</Badge>
                    </div>
                    <div className="d-flex gap-3 small">
                      <Button variant="link" className="text-primary p-0">Add a comment</Button>
                      <Button variant="link" className="text-primary p-0">Share</Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            {/* Comments on Question */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-3">
                <div className="small">
                  <span className="fw-medium">commenter1</span> • 1 hour ago: <span className="text-muted">Have you tried defining the trust policy with sts:AssumeRole?</span>
                </div>
              </Card.Body>
            </Card>
            
            {/* AI Suggestions */}
            <Card className="shadow-sm mb-4 bg-primary bg-opacity-10 border-0">
              <Card.Body className="p-4">
                <h2 className="fs-5 fw-semibold mb-3">AI Suggestions</h2>
                <ul className="mb-0">
                  <li className="mb-2">Define a trust policy granting sts:AssumeRole permission from the source account.</li>
                  <li className="mb-2">Use the AWS CLI to test role assumption and retrieve temporary credentials.</li>
                  <li>Ensure correct ARN formatting in your trust relationship.</li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Community Answers */}
            <h2 className="fs-4 fw-semibold mb-3">Community Answers</h2>
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex">
                  {/* Vote Control */}
                  <div className="text-center me-3">
                    <Button variant="link" className="text-muted p-0 fs-5">▲</Button>
                    <div className="fs-4 fw-bold my-1">5</div>
                    <Button variant="link" className="text-muted p-0 fs-5">▼</Button>
                  </div>
                  
                  {/* Answer Content */}
                  <div>
                    <p className="text-muted small mb-2">Answered by <span className="fw-medium">expertDev</span> • 1 hour ago</p>
                    <div className="mb-3">
                      <p>You can create a role in the target account with a trust policy referencing the source account's root ID. For example:</p>
                      <pre className="bg-light p-3 rounded">
                        <code>{
`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::SOURCE_ACCOUNT_ID:root"},
    "Action": "sts:AssumeRole"
  }]
}`}
                        </code>
                      </pre>
                      <p>Then use aws sts assume-role from the source account.</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg="light" text="dark" className="rounded-pill">aws</Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">sts</Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">iam</Badge>
                    </div>
                    <div className="d-flex gap-3 small">
                      <Button variant="link" className="text-primary p-0">Add a comment</Button>
                      <Button variant="link" className="text-primary p-0">Share</Button>
                    </div>
                    
                    {/* Comments under answer */}
                    <div className="mt-3 pt-3 border-top small">
                      <div className="mb-2"><span className="fw-medium">commenter2</span> • 45 mins ago: <span className="text-muted">Thanks, this solved my issue!</span></div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            {/* Engineer Responses */}
            <h2 className="fs-4 fw-semibold mb-3">Engineer Responses</h2>
            <div className="border-start border-3 border-success bg-light p-4 rounded mb-4">
              <p className="text-muted small mb-2">From IT Engineer <span className="fw-medium">engJane</span> • 30 mins ago</p>
              <p className="mb-0">I've escalated this to our cloud architects. Meanwhile, verify your role's Maximum Session Duration is aligned between accounts (default is 1 hour). Increase it via the AWS console if needed.</p>
            </div>
            
            {/* Your Answer Form */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h2 className="fs-5 fw-semibold mb-3">Your Answer</h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      placeholder="Share your solution..."
                      className="border rounded px-3 py-2"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" className="px-4 py-2">Post Your Answer</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Related Questions */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Related Questions</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">AWS IAM trust policy examples</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">sts:AssumeRole error troubleshooting</Link></li>
                  <li><Link to="#" className="text-primary">Cross-account S3 access setup</Link></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Premium CTA */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Need More Help?</h4>
                <p className="text-muted mb-3">Upgrade for detailed AI insights or direct engineer support.</p>
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

export default IncidentDetail;