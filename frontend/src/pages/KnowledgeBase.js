import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { api } from '../services/api';

function KnowledgeBase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        
        const response = await api.knowledgeBase.getAll(params);
        
        if (response.success) {
          setArticles(response.data);
        } else {
          setError(response.message || 'Failed to fetch articles');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [activeCategory]);
  
  // Add this function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            {/* Title */}
            <h1 className="fs-3 fw-semibold mb-4">Knowledge Base</h1>
            
            {/* Category Filter */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Button 
                variant={activeCategory === 'all' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={activeCategory === 'tutorials' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('tutorials')}
              >
                Tutorials
              </Button>
              <Button 
                variant={activeCategory === 'howto' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('howto')}
              >
                How-To Guides
              </Button>
              <Button 
                variant={activeCategory === 'best' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('best')}
              >
                Best Practices
              </Button>
              <Button 
                variant={activeCategory === 'troubleshooting' ? 'primary' : 'light'} 
                onClick={() => setActiveCategory('troubleshooting')}
              >
                Troubleshooting
              </Button>
            </div>
            
            {/* Search Box */}
            <Form.Group className="mb-4">
              <Form.Control 
                type="text" 
                placeholder="Search docs..." 
                className="border rounded px-3 py-2"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
            
            {/* Loading and Error States */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No articles found.</p>
              </div>
            ) : (
              /* Docs List */
              <div className="d-flex flex-column gap-4">
                {filteredArticles.map(article => (
                  <Card key={article._id} className="shadow-sm hover-border-primary">
                    <Card.Body className="p-4">
                      <h2 className="fs-4 fw-semibold text-primary mb-2">
                        <Link to={`/knowledge-base/${article._id}`} className="text-decoration-none">{article.title}</Link>
                      </h2>
                      <p className="text-muted mb-3">{article.summary || article.content.substring(0, 150)}...</p>
                      <div className="d-flex justify-content-between align-items-center small text-muted">
                        <span>Category: {article.category}</span>
                        <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
          
          {/* Right Sidebar */}
          <Col lg={3} className="d-none d-xl-block">
            {/* AI Related Articles */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">AI Suggested Articles</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Best practices for secure S3 bucket policies</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Optimizing Terraform for multi-cloud deployments</Link></li>
                  <li><Link to="#" className="text-primary">Setting up CloudWatch alarms for EC2</Link></li>
                </ul>
              </Card.Body>
            </Card>
            
            {/* Popular Docs */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fs-5 fw-semibold mb-2">Popular Articles</h4>
                <ul className="list-unstyled small">
                  <li className="mb-2"><Link to="#" className="text-primary">Introduction to Kubernetes on GKE</Link></li>
                  <li className="mb-2"><Link to="#" className="text-primary">Load Balancing Strategies on Azure</Link></li>
                  <li><Link to="#" className="text-primary">Backup & Recovery with AWS Backup</Link></li>
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

export default KnowledgeBase;