import React from 'react';
import { Row, Col, Button, Image, Form } from 'react-bootstrap';

export default function CartItem({ item, qtyChangeHandler, removeItemHandler }) {
  return (
    <Row className="align-items-center py-2 border-bottom">
      <Col md={2}>
        <Image src={item.image} alt={item.name} fluid rounded />
      </Col>
      <Col md={3}>
        <span>{item.name}</span>
      </Col>
      <Col md={2}>${item.price}</Col>
      <Col md={2}>
        <Form.Control
          as="select"
          value={item.qty}
          onChange={(e) => qtyChangeHandler(item, Number(e.target.value))}
        >
          {[...Array(item.countInStock).keys()].map(x => (
            <option key={x+1} value={x+1}>{x+1}</option>
          ))}
        </Form.Control>
      </Col>
      <Col md={2}>
        <Button type="button" variant="light" onClick={() => removeItemHandler(item)}>
          <i className="fas fa-trash"></i>
        </Button>
      </Col>
    </Row>
  );
}