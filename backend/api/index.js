const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');
const serverless = require('serverless-http');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();

// Vercel config to allow longer runtime
export const config = {
  maxDuration: 300,
};

const app = express();

// Connect DB immediately
connectDB().then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'https://e-commerce-frontend-gray-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.get('/', (req, res) => res.send('API is running...'));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Export serverless handler directly
module.exports = serverless(app);
