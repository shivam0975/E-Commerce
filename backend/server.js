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

const allowedOrigins = ['https://e-commerce-frontend-gray-eight.vercel.app'];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

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
