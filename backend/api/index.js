import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import connectDB from '../config/db';
import { notFound, errorHandler } from '../middleware/errorMiddleware';

dotenv.config();

export const config = {
  maxDuration: 300,
};

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

// 👇 Fix for OPTIONS timeout
app.options('*', cors());

app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

module.exports = serverless(app);
