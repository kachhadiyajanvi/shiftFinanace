const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shift_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, work, income } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }
    if (!password || password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include a number.',
      });
    }
    if (!work) {
      return res.status(400).json({ success: false, message: 'Please select your type of work.' });
    }
    if (!income) {
      return res.status(400).json({ success: false, message: 'Please select your monthly income range.' });
    }

    // Check existing
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      work,
      income,
      chk: {},
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        work: user.work,
        income: user.income,
        chk: Object.fromEntries(user.chk || []),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        work: user.work,
        income: user.income,
        chk: Object.fromEntries(user.chk || []),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        work: user.work,
        income: user.income,
        chk: Object.fromEntries(user.chk || []),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update checklist status (Credit & Insurance items)
 * @route   PUT /api/auth/checklist
 * @access  Private
 */
const updateChecklist = async (req, res, next) => {
  try {
    const { key, checked } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Checklist key is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.chk) {
      user.chk = new Map();
    }
    user.chk.set(key, Boolean(checked));
    await user.save();

    res.json({
      success: true,
      chk: Object.fromEntries(user.chk),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateChecklist,
};
