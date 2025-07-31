const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Fetch all products or with search & pagination
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options:'i' } }
    : {};

  const count = await Product.countDocuments({...keyword});
  const products = await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count/pageSize) });
}));

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(product){
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(product){
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);
  if(product){
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if(product){
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if(alreadyReviewed){
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

module.exports = router;