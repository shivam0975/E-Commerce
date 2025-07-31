import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';

export default function ShippingScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart: { shippingAddress } } = state;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { address, city, postalCode, country }
    });
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <h1>Shipping Address</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-2" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required />
        </Form.Group>

        <Button type="submit" variant="primary">Continue</Button>
      </Form>
    </Container>
  );
}