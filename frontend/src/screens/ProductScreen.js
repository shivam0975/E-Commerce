import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Image, ListGroup, Card, Button, Form, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Store } from '../context/Store';

export default function ProductScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

 const [product, setProduct] = useState({
  reviews: []
});
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState('');
  const [successReview, setSuccessReview] = useState(false);
  const { userInfo } = state;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${params.id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, successReview]);

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.qty + qty : qty;
    if(quantity > product.countInStock){
      alert('Sorry. Product is out of stock!');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {...product, qty: quantity}
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if(rating === 0 || comment.trim() === '') {
      alert('Please enter rating and comment');
      return;
    }
    try {
      setLoadingReview(true);
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setLoadingReview(false);
      setSuccessReview(true);
      setRating(0);
      setComment('');
      alert('Review submitted');
    } catch (err) {
      setErrorReview(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingReview(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) :(
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                <ListGroup.Item>Category: {product.category}</ListGroup.Item>
                <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
                <ListGroup.Item>Rating: {product.rating} from {product.numReviews} reviews</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Price: <strong>${product.price}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Status: {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Form.Select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map(x => (
                          <option key={x+1} value={x+1}>{x+1}</option>
                        ))}
                      </Form.Select>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col md={6}>
              <h3>Reviews</h3>
              {product.reviews.length === 0 && <Message>No reviews yet</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <div>Rating: {review.rating}</div>
                    <p>{review.comment}</p>
                    <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a Customer Review</h4>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="mb-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="0">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group controlId="comment" className="mb-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write review here"
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary" disabled={loadingReview}>
                        Submit
                      </Button>
                      {loadingReview && <Loader />}
                      {errorReview && <Message variant="danger">{errorReview}</Message>}
                    </form>
                  ) : (
                    <Message>Please <a href="/login">sign in</a> to write a review</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}