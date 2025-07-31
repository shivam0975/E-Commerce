import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Store } from '../context/Store';

export default function OrderScreen() {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if(!userInfo){
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <Container style={{ marginTop: '2rem' }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : order && (
        <>
          <h1>Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p><strong>Name: </strong> {order.user.name}</p>
                  <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
                  ) : (
                    <Message variant="warning">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p><strong>Method: </strong> {order.paymentMethod}</p>
                  {order.isPaid ? (
                    <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
                  ) : (
                    <Message variant="warning">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row className="align-items-center">
                            <Col md={2}>
                              <Image src={item.image} alt={item.name} fluid rounded style={{ maxHeight: '75px', objectFit: 'contain' }} />
                            </Col>
                            <Col>{item.name}</Col>
                            <Col md={4}>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Items</Col><Col>${order.itemsPrice ? order.itemsPrice.toFixed(2) : ''}</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Shipping</Col><Col>${order.shippingPrice ? order.shippingPrice.toFixed(2) : ''}</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Tax</Col><Col>${order.taxPrice ? order.taxPrice.toFixed(2) : ''}</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Total</Col><Col>${order.totalPrice ? order.totalPrice.toFixed(2) : ''}</Col></Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}