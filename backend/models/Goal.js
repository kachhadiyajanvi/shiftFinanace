const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter a goal name'],
      trim: true,
      maxlength: [40, 'Goal name cannot exceed 40 characters'],
    },
    target: {
      type: Number,
      required: [true, 'Please enter target amount'],
      min: [1, 'Target amount must be greater than 0'],
    },
    saved: {
      type: Number,
      default: 0,
      min: [0, 'Saved amount cannot be negative'],
    },
    date: {
      type: String,
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

goalSchema.index({ user: 1 });

module.exports = mongoose.model('Goal', goalSchema);
