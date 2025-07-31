import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Pagination, Form, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?keyword=${keyword}&pageNumber=${page}`);
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, keyword]);

  return (
    <Container>
      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <h1>Products</h1>
        </Col>
        <Col md={4}>
          <Form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(); }}>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <Pagination className="justify-content-center my-3">
            {[...Array(pages).keys()].map(x => (
              <Pagination.Item key={x + 1} active={x+1 === page} onClick={() => setPage(x+1)}>
                {x + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
}