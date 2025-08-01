const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');
const serverless = require('serverless-http');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();

// Vercel max duration
export const config = {
  maxDuration: 300,
};

const app = express();

connectDB(); // Connect once and cache

app.use(express.json());
app.use(
  cors({
    origin: 'https://e-commerce-frontend-gray-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

module.exports = serverless(app);
