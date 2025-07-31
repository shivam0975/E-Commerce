import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Store } from '../context/Store';

export default function AdminOrderListScreen() {
  const [orders, setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
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
      fetchOrders();
    }
  }, [navigate, userInfo]);

  const deliverHandler = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      fetchOrders();
    } catch (err) {
      alert(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <Container>
      <h1>Orders</h1>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Table hover responsive striped bordered className="table-sm">
          <thead>
            <tr>
              <th>ID</th><th>USER</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'No'}</td>
                <td>{order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'No'}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm me-2">Details</Button>
                  </LinkContainer>
                  {!order.isDelivered && (
                    <Button variant="success" size="sm" onClick={() => deliverHandler(order._id)}>Deliver</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}