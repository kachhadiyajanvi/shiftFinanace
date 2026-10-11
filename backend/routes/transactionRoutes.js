const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  loadSampleData,
  clearSampleData,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All transaction routes are protected

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.post('/sample', loadSampleData);
router.post('/clear-sample', clearSampleData);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
