import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }){
  return (
    <Card className="my-3 p-3 rounded shadow-sm">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" style={{ height:'200px', objectFit:'contain' }} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div"><strong>{product.name}</strong></Card.Title>
        </Link>
        <Card.Text as="div">
          <div>
            {product.rating} from {product.numReviews} reviews
          </div>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}