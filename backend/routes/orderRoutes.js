const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice
  } = req.body;

  if(orderItems && orderItems.length === 0){
    res.status(400);
    throw new Error('No order items');
    return;
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if(order){
    if(order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin){
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order){
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, asyncHandler(async (req,res) => {
  const orders = await Order.find({ user:req.user._id });
  res.json(orders);
}));

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req,res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
}));

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, asyncHandler(async (req,res) => {
  const order = await Order.findById(req.params.id);
  if(order){
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.json({ message: 'Order delivered' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

module.exports = router;