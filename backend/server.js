const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'../frontend/build')));
  app.get('*', (req,res) =>
    res.sendFile(path.resolve(__dirname,'../frontend','build','index.html'))
  );
}else{
  app.get('/', (req,res) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
