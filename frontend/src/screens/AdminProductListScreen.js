import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Store } from '../context/Store';

export default function AdminProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data.products);
      setLoading(false);
    } catch(err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!userInfo || !userInfo.isAdmin){
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [navigate, userInfo]);

  const deleteHandler = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')){
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const { data } = await api.post('/products');
      navigate(`/admin/product/${data._id}/edit`);
    } catch(err){
      alert(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col><h1>Products</h1></Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}><i className="fas fa-plus"></i> Create Product</Button>
        </Col>
      </Row>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Table hover responsive striped bordered className="table-sm">
          <thead>
            <tr>
              <th>ID</th><th>NAME</th><th>PRICE</th><th>CATEGORY</th><th>BRAND</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product=>(
              <tr key={product._id}>
                <td>{product._id}</td><td>{product.name}</td><td>${product.price}</td><td>{product.category}</td><td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm me-2"><i className="fas fa-edit"></i></Button>
                  </LinkContainer>
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}><i className="fas fa-trash"></i></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}