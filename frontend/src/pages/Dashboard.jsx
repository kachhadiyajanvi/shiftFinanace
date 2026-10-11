import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useData,
  inr,
  fmt,
  today,
  wkS,
  mks,
  mon,
  sum,
  cmp,
  grp,
  clamp,
  SRC,
  CAT,
  NE,
  GN,
} from '../context/DataContext';
import BarChart from '../components/BarChart';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    tx,
    goals,
    stats,
    f,
    health,
    loadSampleData,
    clearSampleData,
    addTransaction,
    createGoal,
  } = useData();

  const [modalConfig, setModalConfig] = useState(null);

  const s = stats();
  const h = health();
  const inc = tx.filter((x) => x.type === 'in');
  const ex = tx.filter((x) => x.type === 'ex');
  const M = s.m;
  const me2 = ex.filter((x) => x.date.startsWith(M));
  const ks = mks(6);
  const ef = goals.find((g) => /emergency/i.test(g.name));
  const hasSample = tx.some((x) => x.s) || goals.some((g) => g.s);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';

  // Modal open helpers
  const openAddIncome = () => {
    setModalConfig({
      title: 'Add income',
      okText: 'Add',
      fields: [
        { k: 'amt', l: 'Amount (₹)', t: 'number' },
        { k: 'date', l: 'Date', t: 'date', v: today() },
        { k: 'cat', l: 'Source', o: SRC },
        { k: 'desc', l: 'Description (optional)' },
      ],
      onSubmit: async (v) => {
        const a = +v.amt;
        if (!(a > 0) || a > 1e7) return 'Enter an amount greater than 0.';
        if (!v.date || v.date > today()) return 'Choose a valid date that is not in the future.';
        if ((v.desc || '').length > 60) return 'Description must be 60 characters or fewer.';
        await addTransaction({
          type: 'in',
          amt: a,
          date: v.date,
          cat: v.cat,
          desc: (v.desc || '').trim(),
        });
      },
    });
  };

  const openAddExpense = () => {
    setModalConfig({
      title: 'Add expense',
      okText: 'Add',
      fields: [
        { k: 'amt', l: 'Amount (₹)', t: 'number' },
        { k: 'date', l: 'Date', t: 'date', v: today() },
        { k: 'cat', l: 'Category', o: CAT },
        { k: 'desc', l: 'Description (optional)' },
      ],
      onSubmit: async (v) => {
        const a = +v.amt;
        if (!(a > 0) || a > 1e7) return 'Enter an amount greater than 0.';
        if (!v.date || v.date > today()) return 'Choose a valid date that is not in the future.';
        if ((v.desc || '').length > 60) return 'Description must be 60 characters or fewer.';
        await addTransaction({
          type: 'ex',
          amt: a,
          date: v.date,
          cat: v.cat,
          desc: (v.desc || '').trim(),
        });
      },
    });
  };

  const openCreateGoal = () => {
    setModalConfig({
      title: 'Create savings goal',
      okText: 'Create goal',
      fields: [
        { k: 'n', l: 'Goal type', o: GN },
        { k: 'c', l: 'Custom name (optional)' },
        { k: 't', l: 'Target amount (₹)', t: 'number' },
        { k: 'd', l: 'Target date (optional)', t: 'date' },
      ],
      onSubmit: async (v) => {
        const t = +v.t;
        if (!(t > 0)) return 'Enter a target amount greater than 0.';
        if (v.d && v.d <= today()) return 'Target date must be in the future.';
        if ((v.c || '').length > 40) return 'Custom name is too long.';
        await createGoal({
          name: (v.c || '').trim() || v.n,
          target: t,
          date: v.d || '',
        });
      },
    });
  };

  const renderBreakdown = (obj, total) => {
    const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return <p>No data yet.</p>;

    return entries.map(([k, v]) => (
      <React.Fragment key={k}>
        <div className="br">
          <span>{k}</span>
          <b>{inr(v)}</b>
        </div>
        <div className="bar">
          <i style={{ width: `${total ? (v / total) * 100 : 0}%` }}></i>
        </div>
      </React.Fragment>
    ));
  };

  // Recent transactions sorted descending
  const recentTx = [...tx]
    .sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)))
    .slice(0, 6);

  return (
    <div className="w pg">
      <h2 style={{ margin: 0 }}>Hello, {firstName}</h2>
      <p style={{ marginBottom: '28px' }}>{fmt(today())}</p>

      {/* Empty Dashboard State */}
      {!tx.length && !goals.length ? (
        <div className="card ctr">
          <h3>Your dashboard is empty</h3>
          <p>Add your first income to see balances, charts and your health score.</p>
          <div className="row">
            <button className="btn" onClick={openAddIncome}>
              Add Income
            </button>
            <button className="btn ghost" onClick={loadSampleData}>
              Load sample data
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Sample Data Notice */}
          {hasSample && (
            <div
              className="card mt-0"
              style={{ marginBottom: '24px', padding: '16px 24px' }}
            >
              <div className="row sb">
                <span>
                  <span className="tag o">Sample data</span> &nbsp;Some entries are
                  illustrative, not real balances.
                </span>
                <button className="btn ghost sm" onClick={clearSampleData}>
                  Clear sample data
                </button>
              </div>
            </div>
          )}

          {/* 4 Stat Overview Cards */}
          <div className="g g4 s">
            {[
              ['Available balance', inr(s.bal)],
              ['Earnings this month', inr(s.inc)],
              ['Expenses this month', inr(s.ex)],
              ['Total savings', inr(s.sv)],
            ].map(([a, b]) => (
              <div className="card" style={{ padding: '22px' }} key={a}>
                <div className="k">{a}</div>
                <div className="v">{b}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions Row */}
          <div className="row mt">
            <button className="btn sm" onClick={openAddIncome}>
              Add Income
            </button>
            <button className="btn sm" onClick={openAddExpense}>
              Add Expense
            </button>
            <button className="btn sm" onClick={openCreateGoal}>
              Create Savings Goal
            </button>
            <Link className="btn ghost sm" to="/money">
              View Transactions
            </Link>
            <Link className="btn ghost sm" to="/ask">
              Open Financial Assistant
            </Link>
          </div>

          {/* Income & Expense Breakdown Grids */}
          <div className="g g2 mt">
            {/* Earnings Overview */}
            <div className="card">
              <h3>Earnings overview</h3>
              <div className="g g3" style={{ gap: '12px' }}>
                <div>
                  <div className="k">Today</div>
                  <b>
                    {inr(
                      sum(
                        inc.filter((x) => x.date === today()),
                        (x) => x.amt
                      )
                    )}
                  </b>
                </div>
                <div>
                  <div className="k">This week</div>
                  <b>
                    {inr(
                      sum(
                        inc.filter((x) => x.date >= wkS()),
                        (x) => x.amt
                      )
                    )}
                  </b>
                </div>
                <div>
                  <div className="k">This month</div>
                  <b>{inr(s.inc)}</b>
                </div>
              </div>
              <small style={{ margin: '8px 0' }}>
                {cmp(s.inc, s.pinc)} month
              </small>
              <BarChart
                values={ks.map((k) => f('in', k))}
                labels={ks.map(mon)}
                color="#12B8A6"
              />
              <div className="k" style={{ margin: '8px 0' }}>
                By source (this month)
              </div>
              {renderBreakdown(
                grp(
                  inc.filter((x) => x.date.startsWith(M)),
                  'cat'
                ),
                s.inc
              )}
            </div>

            {/* Expense Overview */}
            <div className="card">
              <h3>Expense overview</h3>
              <div className="v">{inr(s.ex)}</div>
              <small>
                Essential{' '}
                {inr(
                  sum(
                    me2.filter((x) => !NE.includes(x.cat)),
                    (x) => x.amt
                  )
                )}{' '}
                · Non-essential{' '}
                {inr(
                  sum(
                    me2.filter((x) => NE.includes(x.cat)),
                    (x) => x.amt
                  )
                )}
              </small>
              <BarChart
                values={ks.map((k) => f('ex', k))}
                labels={ks.map(mon)}
                color="#10264A"
              />
              <div className="k" style={{ margin: '8px 0' }}>
                By category (this month)
              </div>
              {renderBreakdown(grp(me2, 'cat'), s.ex)}
            </div>
          </div>

          {/* Savings & Health Overview Grids */}
          <div className="g g2 mt">
            {/* Savings Overview */}
            <div className="card">
              <h3>Savings overview</h3>
              <div className="v">{inr(s.sv)}</div>
              <small>
                Suggested to save this month: {inr(s.inc * 0.15)} (15% of earnings so far)
              </small>
              <div className="mt">
                <div className="br">
                  <span>Emergency fund</span>
                  <b>
                    {ef
                      ? inr(ef.saved) + ' / ' + inr(ef.target)
                      : 'Not started'}
                  </b>
                </div>
                <div className="bar">
                  <i
                    style={{
                      width: `${
                        ef ? clamp(ef.saved / ef.target) * 100 : 0
                      }%`,
                    }}
                  ></i>
                </div>
                <small>
                  {goals.length} active goal{goals.length === 1 ? '' : 's'}
                </small>
                <Link
                  className="btn ghost sm"
                  to="/save"
                  style={{ marginTop: '12px' }}
                >
                  Manage goals
                </Link>
              </div>
            </div>

            {/* Financial Health */}
            <div className="card">
              <h3>Financial health</h3>
              {h ? (
                <>
                  <div className="v">{h.score} / 100</div>
                  <ul className="c mt">
                    {h.recs.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <Link
                    className="btn ghost sm"
                    to="/health"
                    style={{ marginTop: '12px' }}
                  >
                    See full breakdown
                  </Link>
                </>
              ) : (
                <p>Add transactions to see your score.</p>
              )}
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="card mt">
            <h3>Recent transactions</h3>
            {recentTx.length ? (
              recentTx.map((x) => (
                <div className="tr" key={x.id}>
                  <div>
                    <b>{x.desc || x.cat}</b>
                    <small>
                      {fmt(x.date)} · {x.cat}
                    </small>
                  </div>
                  <b className={x.type}>
                    {x.type === 'in' ? '+' : '−'}
                    {inr(x.amt).replace('−', '')}
                  </b>
                </div>
              ))
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>
        </>
      )}

      {/* Render Modal */}
      {modalConfig && (
        <Modal
          title={modalConfig.title}
          fields={modalConfig.fields}
          okText={modalConfig.okText}
          onSubmit={modalConfig.onSubmit}
          onClose={() => setModalConfig(null)}
        />
      )}
    </div>
  );
}
