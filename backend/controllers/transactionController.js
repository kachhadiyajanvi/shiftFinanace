const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

const dAgo = (i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return isoDate(d);
};

const todayStr = () => dAgo(0);

/**
 * @desc    Get all transactions for the user
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
      createdAt: -1,
    });

    const formatted = transactions.map((t) => ({
      id: t._id,
      type: t.type,
      amt: t.amt,
      date: t.date,
      cat: t.cat,
      desc: t.desc || '',
      s: t.isSample ? 1 : 0,
      createdAt: t.createdAt,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new transaction (Income or Expense)
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res, next) => {
  try {
    const { type, amt, date, cat, desc } = req.body;

    const parsedAmt = Number(amt);
    if (!parsedAmt || parsedAmt <= 0 || parsedAmt > 1e7) {
      return res.status(400).json({ success: false, message: 'Enter an amount greater than 0.' });
    }

    const today = todayStr();
    if (!date || date > today) {
      return res.status(400).json({
        success: false,
        message: 'Choose a valid date that is not in the future.',
      });
    }

    if (!type || !['in', 'ex'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction type.' });
    }

    if (!cat) {
      return res.status(400).json({ success: false, message: 'Category or source is required.' });
    }

    const cleanDesc = (desc || '').trim();
    if (cleanDesc.length > 60) {
      return res.status(400).json({
        success: false,
        message: 'Description must be 60 characters or fewer.',
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amt: parsedAmt,
      date,
      cat,
      desc: cleanDesc,
      isSample: false,
    });

    res.status(201).json({
      success: true,
      data: {
        id: transaction._id,
        type: transaction.type,
        amt: transaction.amt,
        date: transaction.date,
        cat: transaction.cat,
        desc: transaction.desc,
        s: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { amt, date, cat, desc, type } = req.body;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (amt !== undefined) {
      const parsedAmt = Number(amt);
      if (!parsedAmt || parsedAmt <= 0 || parsedAmt > 1e7) {
        return res.status(400).json({ success: false, message: 'Enter an amount greater than 0.' });
      }
      transaction.amt = parsedAmt;
    }

    if (date !== undefined) {
      if (!date || date > todayStr()) {
        return res.status(400).json({
          success: false,
          message: 'Choose a valid date that is not in the future.',
        });
      }
      transaction.date = date;
    }

    if (cat !== undefined) transaction.cat = cat;
    if (type !== undefined && ['in', 'ex'].includes(type)) transaction.type = type;
    if (desc !== undefined) {
      const cleanDesc = (desc || '').trim();
      if (cleanDesc.length > 60) {
        return res.status(400).json({
          success: false,
          message: 'Description must be 60 characters or fewer.',
        });
      }
      transaction.desc = cleanDesc;
    }

    await transaction.save();

    res.json({
      success: true,
      data: {
        id: transaction._id,
        type: transaction.type,
        amt: transaction.amt,
        date: transaction.date,
        cat: transaction.cat,
        desc: transaction.desc,
        s: transaction.isSample ? 1 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Load 60-day illustrative sample data for the user
 * @route   POST /api/transactions/sample
 * @access  Private
 */
const loadSampleData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sampleTxs = [];

    for (let i = 0; i < 60; i++) {
      const d = dAgo(i);

      // Income
      sampleTxs.push({
        user: userId,
        type: 'in',
        amt: 600 + ((i * 137) % 700),
        date: d,
        cat: 'Delivery work',
        desc: 'Delivery earnings',
        isSample: true,
      });

      if (i % 2 === 0) {
        sampleTxs.push({
          user: userId,
          type: 'in',
          amt: 900 + ((i * 91) % 600),
          date: d,
          cat: 'Driving',
          desc: 'Driving earnings',
          isSample: true,
        });
      }

      if (i % 9 === 0) {
        sampleTxs.push({
          user: userId,
          type: 'in',
          amt: 2500 + ((i * 53) % 1500),
          date: d,
          cat: 'Freelance project',
          desc: 'Freelance payment',
          isSample: true,
        });
      }

      // Expenses
      sampleTxs.push({
        user: userId,
        type: 'ex',
        amt: 150 + ((i * 53) % 100),
        date: d,
        cat: 'Food',
        desc: 'Food',
        isSample: true,
      });

      if (i % 3 === 0) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 200 + ((i * 37) % 150),
          date: d,
          cat: 'Fuel',
          desc: 'Fuel',
          isSample: true,
        });
      }

      if (i % 11 === 0) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 300 + ((i * 29) % 400),
          date: d,
          cat: 'Entertainment',
          desc: 'Movies and outings',
          isSample: true,
        });
      }

      if (d.endsWith('-01')) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 6000,
          date: d,
          cat: 'Rent',
          desc: 'Room rent',
          isSample: true,
        });
      }

      if (d.endsWith('-05')) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 3000,
          date: d,
          cat: 'Family expenses',
          desc: 'Sent to family',
          isSample: true,
        });
      }

      if (d.endsWith('-10')) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 299,
          date: d,
          cat: 'Phone recharge',
          desc: 'Phone recharge',
          isSample: true,
        });
      }

      if (i === 20) {
        sampleTxs.push({
          user: userId,
          type: 'ex',
          amt: 1500,
          date: d,
          cat: 'Vehicle maintenance',
          desc: 'Bike service',
          isSample: true,
        });
      }
    }

    await Transaction.insertMany(sampleTxs);

    // Also add sample goals
    const sampleGoals = [
      {
        user: userId,
        name: 'Emergency fund',
        target: 20000,
        saved: 4500,
        date: '',
        isSample: true,
      },
      {
        user: userId,
        name: 'Vehicle repairs',
        target: 8000,
        saved: 1200,
        date: '',
        isSample: true,
      },
    ];

    await Goal.insertMany(sampleGoals);

    res.json({
      success: true,
      message: 'Sample data loaded. It is illustrative only.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all sample data for the user
 * @route   POST /api/transactions/clear-sample
 * @access  Private
 */
const clearSampleData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Transaction.deleteMany({ user: userId, isSample: true });
    await Goal.deleteMany({ user: userId, isSample: true });

    res.json({
      success: true,
      message: 'Sample data cleared.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  loadSampleData,
  clearSampleData,
};
