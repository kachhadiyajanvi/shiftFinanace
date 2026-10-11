const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    work: {
      type: String,
      required: [true, 'Please select your type of work'],
      enum: [
        'Delivery partner',
        'Cab or bike driver',
        'Freelancer',
        'Home-service professional',
        'Creator',
        'Other self-employed worker',
      ],
    },
    income: {
      type: String,
      required: [true, 'Please select your monthly income range'],
      enum: [
        'Below ₹15,000',
        '₹15,000 – ₹30,000',
        '₹30,000 – ₹50,000',
        'Above ₹50,000',
      ],
    },
    // Checklists for Credit readiness (a0..a4) and Insurance needs (b0..b3)
    chk: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare input password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
