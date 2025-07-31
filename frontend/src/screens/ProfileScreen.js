import React, { useContext, useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Store } from '../context/Store';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProfileScreen() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [name,setName] = useState(userInfo.name);
  const [email,setEmail] = useState(userInfo.email);
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');

  useEffect(() => {
    // Could fetch fresh user data if needed here
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', { name, email, password: password || undefined });
      dispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      setSuccess('Profile updated successfully');
      setError('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
      setSuccess('');
    }
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <h1>User Profile</h1>
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={e=>setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password (leave blank to keep current)</Form.Label>
          <Form.Control type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        </Form.Group>
        <Button type="submit" variant="primary">Update</Button>
      </Form>
    </Container>
  );
}