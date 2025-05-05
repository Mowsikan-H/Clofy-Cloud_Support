import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function KnowledgeBaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.knowledgeBase.getById(id);
        
        if (response.success) {
          setArticle(response.data);
        } else {
          setError(response.message || 'Failed to fetch article');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <Row>
          {/* Left Sidebar */}
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activePage="knowledge" />
          </Col>
          
          {/* Main Content */}
          <Col lg={7} md={8}>
            <Button 
              as={Link} 
              to="/knowledge-base" 
              variant="outline-secondary" 
              className="mb-4"
              size="sm"
            >
              &larr; Back to Knowledge Base
            </Button>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : article ? (
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <h1 className="fs-3 fw-semibold mb-3">{article.title}</h1>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4 small text-muted">
                    <span>Category: {article.category}</span>
                    <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="article-content">
                    {article.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {currentUser?.role === 'admin' && (
                    <div className="mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/knowledge-base/edit/${article._id}`} 
                        variant="outline-primary" 
                        size="sm"
                      >
                        Edit Article
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            try {
                              const response = await api.knowledgeBase.delete(article._id);
                              if (response.success) {
                                navigate('/knowledge-base');
                              } else {
                                alert(response.message || 'Failed to delete article');
                              }
                            } catch (err) {
                              alert(err.message || 'An error occurred');
                            }
                          }
                        }}
                      >
                        Delete Article
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <div className="alert alert-warning">Article not found</div>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* Related Articles */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Related Articles</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Setting up VPC peering in AWS</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Understanding AWS networking concepts</Link></li>
                  <li><Link to="#" className="text-primary">Troubleshooting VPC connectivity issues</Link></li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default KnowledgeBaseDetail;