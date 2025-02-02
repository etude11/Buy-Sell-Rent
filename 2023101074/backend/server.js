import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import session from 'express-session';
import CAS from 'cas-authentication';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import User from './models/User.js';    
import session from 'express-session';
import { generateToken } from './utils/generateToken.js';  // Add this import at the top

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Secret key for session encryption
    resave: false, // Do not resave unchanged sessions
    saveUninitialized: true, // Save new sessions
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();



// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Session setup (required for CAS)

// CAS configuration
const cas = new CAS({
  cas_url: process.env.CAS_URL || 'https://login.iiit.ac.in/cas', // CAS server URL
  service_url: process.env.SERVICE_URL || 'http://localhost:5000', // Your app's backend URL
  cas_version: '3.0', // CAS protocol version
});

// Add CAS middleware to the app
app.use((req, res, next) => {
  req.cas = cas;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);

// CAS Login Route
app.get('/api/auth/cas/login', cas.bounce, async (req, res) => {
  const username = req.session.cas_user;
  const email = `${username}`;
  
  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      const token = generateToken(existingUser._id);
      // Use hash fragment instead of query parameter for better security
      res.redirect(`${process.env.FRONTEND_URL}/#token=${token}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/register?email=${email}`);
    }
  } catch (error) {
    console.error('CAS login error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
});

// CAS Logout Route
app.get('/api/auth/cas/logout', cas.logout);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});