const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const connectDB = require('../config/db');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: 'https://e-commerce-frontend-gray-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// 👇 Skip favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 👇 OPTIONS fix
app.options('*', cors());

app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

module.exports = serverless(app);
