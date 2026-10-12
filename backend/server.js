const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB Atlas (Mongoose)
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "https://shift-finanace.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'SHIFT Backend API',
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (MVC Architecture)
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SHIFT Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
