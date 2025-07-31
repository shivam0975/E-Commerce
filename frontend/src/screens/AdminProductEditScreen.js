import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../context/Store';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function AdminProductEditScreen() {
  const { id: productId } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [name,setName] = useState('');
  const [price,setPrice] = useState(0);
  const [image,setImage] = useState('');
  const [brand,setBrand] = useState('');
  const [category,setCategory] = useState('');
  const [countInStock,setCountInStock] = useState(0);
  const [description,setDescription] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [loadingUpdate,setLoadingUpdate] = useState(false);
  const [errorUpdate,setErrorUpdate] = useState('');

  useEffect(() => {
    if(!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch(err){
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      await api.put(`/products/${productId}`, { name, price, image, brand, category, description, countInStock });
      setLoadingUpdate(false);
      navigate('/admin/products');
    } catch(err){
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <h1>Edit Product</h1>
      { loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={e=>setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control value={image} onChange={e=>setImage(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control value={brand} onChange={e=>setBrand(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} onChange={e=>setCategory(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control type="number" value={countInStock} onChange={e=>setCountInStock(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={e=>setDescription(e.target.value)} required />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loadingUpdate}>Update</Button>
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        </Form>
      )}
    </Container>
  );
}