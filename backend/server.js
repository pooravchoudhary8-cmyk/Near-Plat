import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Path Resolution Best Practice for ES Modules
// This guarantees __dirname always resolves accurately to 'backend',
// regardless of where the node process was launched from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Enable gzip compression to optimize performance for static assets and API responses
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// CORS Configuration
// Optimized for Single URL deployment
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5000'
    ],
    credentials: true
  }));
}

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(morgan('dev'));

// Uploads Folder Configuration
// Serve uploads statically. __dirname is 'backend', so this perfectly targets 'backend/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
// These are processed first, before the React fallback catches requests

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// React Static Build
// Serve frontend/dist securely.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// React Router Fallback
// Uses app.use to explicitly handle only GET requests, bypassing APIs.
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }

  // Only serve React for GET requests
  if (req.method !== 'GET') {
    return next();
  }

  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error Handling Middleware (Catches unmatched /api routes and returns JSON 404)
app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);

// Socket.io Configuration
// Follows the same strict CORS policy as Express
const ioOptions = {};
if (process.env.NODE_ENV !== 'production') {
  ioOptions.cors = {
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5000'
    ],
    methods: ["GET", "POST"],
    credentials: true
  };
}
const io = new Server(httpServer, ioOptions);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
