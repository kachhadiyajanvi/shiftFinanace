const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['in', 'ex'],
      required: [true, 'Transaction type must be "in" (income) or "ex" (expense)'],
    },
    amt: {
      type: Number,
      required: [true, 'Please enter transaction amount'],
      min: [1, 'Amount must be greater than 0'],
      max: [10000000, 'Amount cannot exceed ₹1,00,00,000'],
    },
    date: {
      type: String,
      required: [true, 'Please provide transaction date (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'],
    },
    cat: {
      type: String,
      required: [true, 'Please provide transaction source or category'],
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
      maxlength: [60, 'Description cannot exceed 60 characters'],
      default: '',
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index to query by user and date efficiently
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
