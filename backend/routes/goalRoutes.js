const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMoney,
  withdrawMoney,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All goal routes are protected

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.post('/:id/add', addMoney);
router.post('/:id/withdraw', withdrawMoney);

module.exports = router;
