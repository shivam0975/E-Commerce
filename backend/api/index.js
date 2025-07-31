// api/index.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');  // adjust path as needed
const cors = require('cors');
const serverless = require('serverless-http');

const { notFound, errorHandler } = require('../middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Enable CORS for all origins or configure as needed
app.use(cors());

// Routes
app.use('/api/users', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

// Serve static assets if in production (optional, frontend deployed separately)
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

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// EXPORT THE APP WRAPPED WITH serverless
module.exports = app;
module.exports.handler = serverless(app);
