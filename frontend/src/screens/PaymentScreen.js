import React, { useContext, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';

export default function PaymentScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart: { paymentMethod } } = state;

  const [payment, setPayment] = useState(paymentMethod || 'PayPal');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type:'SAVE_PAYMENT_METHOD', payload: payment });
    localStorage.setItem('paymentMethod', payment);
    navigate('/placeorder');
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Check
            type="radio"
            label="PayPal"
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            checked={payment === 'PayPal'}
            onChange={(e) => setPayment(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Stripe"
            id="Stripe"
            name="paymentMethod"
            value="Stripe"
            checked={payment === 'Stripe'}
            onChange={(e) => setPayment(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">Continue</Button>
      </Form>
    </Container>
  );
}