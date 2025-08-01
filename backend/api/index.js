import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import connectDB from '../config/db.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';

dotenv.config();

export const config = {
  maxDuration: 300,
};

const app = express();

await connectDB(); // use `await` if using ESM + top-level await

app.use(express.json());

app.use(
  cors({
    origin: 'https://e-commerce-frontend-gray-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.options('*', cors());

app.use('/api/users', (await import('../routes/authRoutes.js')).default);
app.use('/api/products', (await import('../routes/productRoutes.js')).default);
app.use('/api/orders', (await import('../routes/orderRoutes.js')).default);

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

export default serverless(app);
