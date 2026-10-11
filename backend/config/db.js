const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas via Mongoose
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shift_db';

    // Set connection options
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[Database Notice] Please configure your MongoDB Atlas connection string in backend/.env:');
    console.warn('  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shift_db?retryWrites=true&w=majority');
    // Note: Do not exit process immediately so developer can see the error in development
    return null;
  }
};

module.exports = connectDB;
