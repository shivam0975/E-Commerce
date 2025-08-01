console.log('API function called. Request URL:', req.url);
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');
const serverless = require('serverless-http');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());

// CORS config allowing your frontend only
app.use(
  cors({
    origin: 'https://e-commerce-frontend-gray-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.get('/favicon.ico', (req, res) => res.status(204).end());

// API routes
app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

// Root endpoint to verify serverless backend is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware for 404 and general error handling
app.use(notFound);
app.use(errorHandler);

// Export handler for Vercel serverless function
module.exports.handler = serverless(app);
