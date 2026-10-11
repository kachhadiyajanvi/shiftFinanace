const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

// Helper to calculate available balance for user
const calculateBalance = async (userId) => {
  const transactions = await Transaction.find({ user: userId });
  const goals = await Goal.find({ user: userId });

  const netTransactions = transactions.reduce((sum, t) => {
    return t.type === 'in' ? sum + t.amt : sum - t.amt;
  }, 0);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);

  return netTransactions - totalSaved;
};

/**
 * @desc    Get all savings goals for the user
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });

    const formatted = goals.map((g) => ({
      id: g._id,
      name: g.name,
      target: g.target,
      saved: g.saved,
      date: g.date || '',
      s: g.isSample ? 1 : 0,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new savings goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res, next) => {
  try {
    const { name, target, date } = req.body;

    const cleanName = (name || '').trim();
    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Goal name is required.' });
    }
    if (cleanName.length > 40) {
      return res.status(400).json({ success: false, message: 'Custom name is too long.' });
    }

    const parsedTarget = Number(target);
    if (!parsedTarget || parsedTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Enter a target amount greater than 0.',
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (date && date <= todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Target date must be in the future.',
      });
    }

    const goal = await Goal.create({
      user: req.user.id,
      name: cleanName,
      target: parsedTarget,
      saved: 0,
      date: date || '',
      isSample: false,
    });

    res.status(201).json({
      success: true,
      data: {
        id: goal._id,
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
        date: goal.date,
        s: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a savings goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res, next) => {
  try {
    const { name, target, date } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (name !== undefined) {
      const cleanName = name.trim();
      if (!cleanName) {
        return res.status(400).json({ success: false, message: 'Goal name cannot be empty.' });
      }
      if (cleanName.length > 40) {
        return res.status(400).json({ success: false, message: 'Custom name is too long.' });
      }
      goal.name = cleanName;
    }

    if (target !== undefined) {
      const parsedTarget = Number(target);
      if (!parsedTarget || parsedTarget <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Enter a target amount greater than 0.',
        });
      }
      goal.target = parsedTarget;
    }

    if (date !== undefined) {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (date && date <= todayStr) {
        return res.status(400).json({
          success: false,
          message: 'Target date must be in the future.',
        });
      }
      goal.date = date;
    }

    await goal.save();

    res.json({
      success: true,
      data: {
        id: goal._id,
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
        date: goal.date,
        s: goal.isSample ? 1 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a savings goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add money to a goal from available balance
 * @route   POST /api/goals/:id/add
 * @access  Private
 */
const addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const parsedAmt = Number(amount);

    if (!parsedAmt || parsedAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Enter an amount greater than 0.' });
    }

    const availableBal = await calculateBalance(req.user.id);
    if (parsedAmt > availableBal) {
      return res.status(400).json({
        success: false,
        message: 'That is more than your available balance.',
      });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.saved += parsedAmt;
    await goal.save();

    res.json({
      success: true,
      message: 'Money added.',
      data: {
        id: goal._id,
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
        date: goal.date,
        s: goal.isSample ? 1 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw money from a goal back to available balance
 * @route   POST /api/goals/:id/withdraw
 * @access  Private
 */
const withdrawMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const parsedAmt = Number(amount);

    if (!parsedAmt || parsedAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Enter an amount greater than 0.' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (parsedAmt > goal.saved) {
      return res.status(400).json({
        success: false,
        message: 'You cannot withdraw more than is saved in this goal.',
      });
    }

    goal.saved -= parsedAmt;
    await goal.save();

    res.json({
      success: true,
      message: 'Withdrawn to available balance.',
      data: {
        id: goal._id,
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
        date: goal.date,
        s: goal.isSample ? 1 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMoney,
  withdrawMoney,
};
