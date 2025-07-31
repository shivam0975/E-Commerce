import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from '../context/Store';
import CartItem from '../components/CartItem';

export default function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { cartItems }
  } = state;

  const updateCartHandler = (item, qty) => {
    if(qty > item.countInStock){
      alert('Not enough stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload:{ ...item, qty } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>Your cart is empty. <Link to="/">Go Back</Link></Message>
          ) : (
            cartItems.map(item => (
              <CartItem
                key={item._id}
                item={item}
                qtyChangeHandler={updateCartHandler}
                removeItemHandler={removeItemHandler}
              />
            ))
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) items</h2>
              <h4>
                ${cartItems.reduce((a,c) => a + c.qty * c.price, 0).toFixed(2)}
              </h4>
              <Button
                type="button"
                className="w-100"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function Message({children}) {
  return (
    <div className="alert alert-info text-center">{children}</div>
  );
}