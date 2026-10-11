import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useData,
  clamp,
  mks,
  mon,
  today,
  SRC,
} from '../context/DataContext';
import BarChart from '../components/BarChart';
import Modal from '../components/Modal';

export default function Health() {
  const { health, f, addTransaction } = useData();
  const [modalConfig, setModalConfig] = useState(null);

  const h = health();
  const ks = mks(6);

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

  if (!h) {
    return (
      <div className="w pg">
        <h2>Financial health</h2>
        <div className="card ctr">
          <h3>No data yet</h3>
          <p>Add income and expenses to see your score.</p>
          <div className="row">
            <button className="btn" onClick={openAddIncome}>
              Add Income
            </button>
          </div>
        </div>

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

  return (
    <div className="w pg">
      <h2>Financial health</h2>

      {/* Score Summary & Recommendations */}
      <div className="g g2">
        <div className="card">
          <div className="k">Your score</div>
          <div className="v" style={{ fontSize: '3.4rem' }}>
            {h.score} <span style={{ fontSize: '1.2rem' }}>/ 100</span>
          </div>
          <div className="g g2 mt" style={{ gap: '12px' }}>
            <div>
              <div className="k">Savings rate</div>
              <b>{Math.round(h.rate * 100)}%</b>
            </div>
            <div>
              <div className="k">Expense-to-income</div>
              <b>{Math.round(h.ratio * 100)}%</b>
            </div>
            <div>
              <div className="k">Emergency cover</div>
              <b>{h.cov.toFixed(1)} months</b>
            </div>
            <div>
              <div className="k">Income consistency</div>
              <b>{Math.round(clamp(1 - h.cv) * 100)}%</b>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Recommendations</h3>
          <ul className="c">
            {h.recs.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Score Calculation Factors */}
      <div className="card mt">
        <h3>How the score is calculated</h3>
        <p style={{ marginBottom: '16px' }}>
          Four factors, 100 points, using the last 3 months of your recorded data (8 weeks for consistency).
        </p>
        {h.parts.map((p, i) => (
          <React.Fragment key={i}>
            <div className="br">
              <b>{p[0]}</b>
              <span>
                {Math.round(p[1])} / {p[2]}
              </span>
            </div>
            <div className="bar">
              <i style={{ width: `${(p[1] / p[2]) * 100}%` }}></i>
            </div>
            <small style={{ margin: '-8px 0 14px' }}>{p[3]}</small>
          </React.Fragment>
        ))}
      </div>

      {/* Spending Trend */}
      <div className="card mt">
        <h3>Spending trend</h3>
        <BarChart
          values={ks.map((k) => f('ex', k))}
          labels={ks.map(mon)}
          color="#10264A"
        />
      </div>

      <div className="row mt">
        <Link className="btn ghost" to="/ask">
          Ask SHIFT a question
        </Link>
      </div>

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
