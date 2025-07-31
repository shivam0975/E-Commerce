import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import api from '../api/api';
import { Store } from '../context/Store';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post('/users', { name, email, password });
      dispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate(redirect);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h1>Register</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name} onChange={e=>setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email} onChange={e=>setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password} onChange={e=>setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 mb-3">Register</Button>
      </Form>
      <div>
        Have an Account? <Link to={`/login?redirect=${redirect}`}>Login</Link>
      </div>
    </Container>
  );
}