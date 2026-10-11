const ContactMessage = require('../models/ContactMessage');

/**
 * @desc    Submit a contact inquiry message
 * @route   POST /api/contact
 * @access  Public
 */
const submitMessage = async (req, res, next) => {
  try {
    const { n, e, m, name, email, message } = req.body;

    const senderName = (name || n || '').trim();
    const senderEmail = (email || e || '').trim().toLowerCase();
    const senderMessage = (message || m || '').trim();

    if (senderName.length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(senderEmail)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    if (senderMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters.',
      });
    }

    const contact = await ContactMessage.create({
      name: senderName,
      email: senderEmail,
      message: senderMessage,
      date: new Date().toISOString().slice(0, 10),
    });

    res.status(201).json({
      success: true,
      message: 'Thanks! Your message was saved.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages (Admin/diagnostic)
 * @route   GET /api/contact
 * @access  Public
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  getMessages,
};
