const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    Register user
// @route   POST /api/users
// @access  Public
router.post('/', asyncHandler(async (req, res)=>{
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists){
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  if (user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Authenticate user & get token (login)
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res)=>{
  const user = await User.findById(req.user._id);
  if (user){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, asyncHandler(async (req, res)=>{
  const user = await User.findById(req.user._id);
  if (user){
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password){
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

module.exports = router;