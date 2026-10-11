const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateChecklist,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/checklist', protect, updateChecklist);

module.exports = router;
