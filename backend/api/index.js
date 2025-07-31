const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');
const serverless = require('serverless-http');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS - simpler setup for serverless, allow all origins or customize as needed
const allowedOrigins = ['https://e-commerce-frontend-gray-eight.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// API routes
app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

// (Optional) Serve frontend static in production if combined in deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export handler for serverless function on Vercel
module.exports = app;
module.exports.handler = serverless(app);
