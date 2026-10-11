import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transactionApi, goalApi } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const SRC = ['Delivery work', 'Driving', 'Freelance project', 'Other work'];
export const CAT = [
  'Fuel',
  'Rent',
  'Food',
  'Phone recharge',
  'Vehicle maintenance',
  'Family expenses',
  'Entertainment',
  'Shopping',
  'Other',
];
export const NE = ['Entertainment', 'Shopping', 'Other'];
export const WORK = [
  'Delivery partner',
  'Cab or bike driver',
  'Freelancer',
  'Home-service professional',
  'Creator',
  'Other self-employed worker',
];
export const INC = [
  'Below ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹50,000',
  'Above ₹50,000',
];
export const GN = [
  'Emergency fund',
  'Vehicle repairs',
  'New smartphone',
  'Education',
  'Family expenses',
  'Personal goal',
];

// Helper calculations exactly matching original code
export const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
export const clamp = (x) => Math.max(0, Math.min(1, x));
export const inr = (n) =>
  (n < 0 ? '−₹' : '₹') + Math.round(Math.abs(n)).toLocaleString('en-IN');
export const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
export const dAgo = (i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return iso(d);
};
export const today = () => dAgo(0);
export const fmt = (s) =>
  new Date(s + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
export const mk = (o) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + o);
  return iso(d).slice(0, 7);
};
export const mks = (n) => [...Array(n)].map((_, i) => mk(i - n + 1));
export const mon = (k) =>
  new Date(k + '-01T00:00:00').toLocaleDateString('en-GB', { month: 'short' });
export const wkS = (o = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + o);
  return iso(d);
};
export const grp = (a, k) =>
  a.reduce((o, x) => ((o[x[k]] = (o[x[k]] || 0) + x.amt), o), {});
export const cmp = (a, b) =>
  b
    ? `${a >= b ? '▲' : '▼'} ${Math.abs(Math.round(((a - b) / b) * 100))}% vs previous`
    : 'No previous data';

export const DataProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [tx, setTx] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMsg(null);
  }, []);

  // Fetch transactions and goals for logged in user
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) {
      setTx([]);
      setGoals([]);
      return;
    }
    setLoading(true);
    try {
      const [txRes, goalRes] = await Promise.all([
        transactionApi.getAll(),
        goalApi.getAll(),
      ]);
      if (txRes.success) setTx(txRes.data || []);
      if (goalRes.success) setGoals(goalRes.data || []);
    } catch (err) {
      console.error('Failed to load user data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived financial statistics
  const f = useCallback(
    (type, k) => sum(tx.filter((x) => x.type === type && x.date.startsWith(k)), (x) => x.amt),
    [tx]
  );

  const stats = useCallback(() => {
    const m = mk(0);
    const sv = sum(goals, (g) => g.saved);
    const inc = f('in', m);
    const ex = f('ex', m);
    const pinc = f('in', mk(-1));
    const bal = sum(tx, (x) => (x.type === 'in' ? x.amt : -x.amt)) - sv;
    return { m, sv, inc, ex, pinc, bal };
  }, [tx, goals, f]);

  // Health Score Calculation
  const health = useCallback(() => {
    if (!tx.length) return null;
    const ks = [0, -1, -2].map(mk);
    const I = sum(ks, (k) => f('in', k));
    const E = sum(ks, (k) => f('ex', k));
    const ess =
      sum(
        tx.filter(
          (x) =>
            x.type === 'ex' && !NE.includes(x.cat) && ks.some((k) => x.date.startsWith(k))
        ),
        (x) => x.amt
      ) / 3;
    const rate = I > 0 ? (I - E) / I : 0;
    const ratio = I > 0 ? E / I : 1;
    const ef = sum(
      goals.filter((g) => /emergency/i.test(g.name)),
      (g) => g.saved
    );
    const cov = ess > 0 ? ef / ess : 0;
    const w = [...Array(8)].map((_, i) => {
      const a = dAgo(i * 7 + 6);
      const b = dAgo(i * 7);
      return sum(
        tx.filter((x) => x.type === 'in' && x.date >= a && x.date <= b),
        (x) => x.amt
      );
    });
    const mean = sum(w, (x) => x) / 8;
    const cv = mean ? Math.sqrt(sum(w, (x) => (x - mean) ** 2) / 8) / mean : 1;

    const parts = [
      [
        'Savings rate',
        clamp(rate / 0.2) * 30,
        30,
        `${Math.round(rate * 100)}% of income kept over 3 months (full marks at 20%)`,
      ],
      [
        'Spending vs income',
        clamp((1 - ratio) / 0.5) * 25,
        25,
        `${Math.round(ratio * 100)}% of income spent (full marks at 50% or less)`,
      ],
      [
        'Emergency fund',
        clamp(cov / 3) * 25,
        25,
        `${cov.toFixed(1)} months of essential spending covered (full marks at 3)`,
      ],
      [
        'Income consistency',
        clamp(1 - cv) * 20,
        20,
        `Weekly income varies by ${Math.round(cv * 100)}% over 8 weeks (lower is steadier)`,
      ],
    ];
    const score = Math.round(sum(parts, (p) => p[1]));
    const recs = [];
    const m = mk(0);
    const ne = grp(
      tx.filter((x) => x.type === 'ex' && NE.includes(x.cat) && x.date.startsWith(m)),
      'cat'
    );
    const top = Object.entries(ne).sort((a, b) => b[1] - a[1])[0];

    if (cov < 3)
      recs.push(
        `Build your emergency fund towards 3 months of essentials (about ${inr(
          ess * 3
        )}). You have ${inr(ef)} so far.`
      );
    if (rate < 0.1)
      recs.push(
        'Try to keep at least 10–20% of what you earn. Even a small amount per day adds up.'
      );
    if (ratio > 0.8)
      recs.push(
        `You spend ${Math.round(
          ratio * 100
        )}% of your income. Review recurring expenses such as rent, phone and fuel.`
      );
    if (top)
      recs.push(`Consider reducing ${top[0]} spending (${inr(top[1])} this month).`);
    if (cv > 0.4)
      recs.push(
        'Your weekly income varies a lot. Set aside extra in higher-income weeks to cover lower ones.'
      );
    if (!recs.length)
      recs.push('You are on track. Keep recording every transaction and keep saving consistently.');

    return { score, parts, recs, rate, ratio, cov, cv };
  }, [tx, goals, f]);

  // AI Assistant Answers Tailored to User Data
  const getAssistantAnswer = useCallback(
    (q) => {
      const qLower = q.toLowerCase();
      const w4 =
        sum(
          tx.filter((x) => x.type === 'in' && x.date > dAgo(28)),
          (x) => x.amt
        ) / 4;

      if (/week|how much.*save/.test(qLower)) {
        return w4
          ? `Your income over the last 4 weeks averaged about ${inr(
              w4
            )} a week. Setting aside 10–15% would be roughly ${inr(w4 * 0.1)}–${inr(
              w4 * 0.15
            )}. In a lean week, even 5% keeps the habit going.`
          : 'Add some income first and I can tailor this. As a general starting point, many people aim to save 10–15% of what they earn each week.';
      }
      if (/lower|less|drop|low income/.test(qLower)) {
        return 'In a low-income month: 1) cover essentials first (rent, food, fuel, phone), 2) pause non-essential spending, 3) keep a small saving, even ₹50 a day, 4) avoid high-interest borrowing. Then check the Money page for your biggest expenses.';
      }
      if (/emergency/.test(qLower)) {
        return 'An emergency fund covers essentials if you cannot work. Start with a first target of one month of essential spending, then build to three. Save a fixed share of every payment. Create an "Emergency fund" goal on the Savings page to track it.';
      }
      if (/maint|repair|service/.test(qLower)) {
        return 'A common rule of thumb is to set aside around 5–10% of vehicle-related earnings for servicing and repairs. Your own costs matter most: check past maintenance expenses and set a regular amount aside in a "Vehicle repairs" goal.';
      }
      if (/emi|loan/.test(qLower)) {
        return 'An EMI is the fixed amount you repay each month on a loan. It covers part of the amount borrowed plus interest. Try the repayment calculator on the Credit and Protection page to see the EMI and total repayment.';
      }
      if (/insur|cover/.test(qLower)) {
        return 'Accident and health cover protect you when illness or injury stops your earnings. Compare the premium, sum insured, waiting period and exclusions. See the checklist on the Credit and Protection page.';
      }
      return 'I can help with: weekly saving, lower-income months, emergency funds, vehicle maintenance, EMIs and insurance basics. Try one of the suggested questions.';
    },
    [tx]
  );

  // Transaction Actions
  const addTransaction = async (data) => {
    const res = await transactionApi.create(data);
    if (res.success && res.data) {
      setTx((prev) => [res.data, ...prev]);
      toast(data.type === 'in' ? 'Income added.' : 'Expense added.');
      return res.data;
    }
  };

  const editTransaction = async (id, data) => {
    const res = await transactionApi.update(id, data);
    if (res.success && res.data) {
      setTx((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      toast('Transaction updated.');
      return res.data;
    }
  };

  const deleteTransaction = async (id) => {
    const res = await transactionApi.delete(id);
    if (res.success) {
      setTx((prev) => prev.filter((t) => t.id !== id));
      toast('Transaction deleted.');
    }
  };

  // Goal Actions
  const createGoal = async (data) => {
    const res = await goalApi.create(data);
    if (res.success && res.data) {
      setGoals((prev) => [...prev, res.data]);
      toast('Goal saved.');
      return res.data;
    }
  };

  const editGoal = async (id, data) => {
    const res = await goalApi.update(id, data);
    if (res.success && res.data) {
      setGoals((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      toast('Goal saved.');
      return res.data;
    }
  };

  const deleteGoal = async (id) => {
    const res = await goalApi.delete(id);
    if (res.success) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      toast('Goal deleted.');
    }
  };

  const addMoneyToGoal = async (id, amount) => {
    const res = await goalApi.addMoney(id, amount);
    if (res.success && res.data) {
      setGoals((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      toast('Money added.');
      return res.data;
    }
  };

  const withdrawMoneyFromGoal = async (id, amount) => {
    const res = await goalApi.withdrawMoney(id, amount);
    if (res.success && res.data) {
      setGoals((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      toast('Withdrawn to available balance.');
      return res.data;
    }
  };

  // Sample Data Actions
  const loadSampleData = async () => {
    setLoading(true);
    try {
      const res = await transactionApi.loadSample();
      if (res.success) {
        await refreshData();
        toast('Sample data loaded. It is illustrative only.');
      }
    } catch (err) {
      toast('Failed to load sample data.');
    } finally {
      setLoading(false);
    }
  };

  const clearSampleData = async () => {
    setLoading(true);
    try {
      const res = await transactionApi.clearSample();
      if (res.success) {
        await refreshData();
        toast('Sample data cleared.');
      }
    } catch (err) {
      toast('Failed to clear sample data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        tx,
        goals,
        loading,
        toastMsg,
        toast,
        hideToast,
        stats,
        f,
        health,
        getAssistantAnswer,
        addTransaction,
        editTransaction,
        deleteTransaction,
        createGoal,
        editGoal,
        deleteGoal,
        addMoneyToGoal,
        withdrawMoneyFromGoal,
        loadSampleData,
        clearSampleData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
