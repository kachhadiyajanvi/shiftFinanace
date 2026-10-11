const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
} = require('../controllers/contactController');

router.route('/')
  .post(submitMessage)
  .get(getMessages);

module.exports = router;
