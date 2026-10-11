import React, { useState } from 'react';
import {
  useData,
  inr,
  fmt,
  iso,
  today,
  clamp,
  GN,
} from '../context/DataContext';
import Modal from '../components/Modal';

export default function Savings() {
  const {
    goals,
    stats,
    createGoal,
    editGoal,
    deleteGoal,
    addMoneyToGoal,
    withdrawMoneyFromGoal,
  } = useData();

  const [modalConfig, setModalConfig] = useState(null);

  // Calculator state
  const defaultDate6m = new Date();
  defaultDate6m.setMonth(defaultDate6m.getMonth() + 6);

  const [calcTarget, setCalcTarget] = useState(12000);
  const [calcSaved, setCalcSaved] = useState(0);
  const [calcDate, setCalcDate] = useState(iso(defaultDate6m));

  const s = stats();

  // Savings Calculator Calculation
  const renderCalculatorResult = () => {
    const t = Number(calcTarget);
    const saved = Number(calcSaved) || 0;
    if (!t || t <= 0 || !calcDate) {
      return <p>Enter a target amount and date.</p>;
    }

    const diffMs =
      new Date(calcDate + 'T00:00:00') - new Date(today() + 'T00:00:00');
    const d = Math.ceil(diffMs / 864e5);

    if (d <= 0) {
      return <p className="err">Choose a future date.</p>;
    }

    const r = t - saved;
    if (r <= 0) {
      return <p>You have already reached this target.</p>;
    }

    const perWeek = r / (d / 7);
    const perDay = r / d;

    return (
      <>
        <div className="g g2 mt">
          <div>
            <div className="k">Per week</div>
            {inr(perWeek)}
          </div>
          <div>
            <div className="k">Per day</div>
            {inr(perDay)}
          </div>
        </div>
        <small style={{ marginTop: '10px' }}>
          Remaining {inr(r)} over {d} days ({(d / 7).toFixed(1)} weeks).
        </small>
      </>
    );
  };

  // Modals
  const openCreateGoal = () => {
    setModalConfig({
      title: 'Create savings goal',
      okText: 'Create goal',
      fields: [
        { k: 'n', l: 'Goal type', o: GN, v: 'Personal goal' },
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

  const openEditGoal = (g) => {
    setModalConfig({
      title: 'Edit goal',
      okText: 'Save',
      fields: [
        { k: 'n', l: 'Goal type', o: GN, v: GN.includes(g.name) ? g.name : 'Personal goal' },
        { k: 'c', l: 'Custom name (optional)', v: !GN.includes(g.name) ? g.name : '' },
        { k: 't', l: 'Target amount (₹)', t: 'number', v: g.target },
        { k: 'd', l: 'Target date (optional)', t: 'date', v: g.date },
      ],
      onSubmit: async (v) => {
        const t = +v.t;
        if (!(t > 0)) return 'Enter a target amount greater than 0.';
        if (v.d && v.d <= today()) return 'Target date must be in the future.';
        if ((v.c || '').length > 40) return 'Custom name is too long.';
        await editGoal(g.id, {
          name: (v.c || '').trim() || v.n,
          target: t,
          date: v.d || '',
        });
      },
    });
  };

  const openAddMoney = (g) => {
    setModalConfig({
      title: 'Add money to ' + g.name,
      okText: 'Add',
      fields: [{ k: 'a', l: 'Amount (₹)', t: 'number' }],
      onSubmit: async (v) => {
        const a = +v.a;
        if (!(a > 0)) return 'Enter an amount greater than 0.';
        if (a > s.bal) return 'That is more than your available balance.';
        await addMoneyToGoal(g.id, a);
      },
    });
  };

  const openWithdraw = (g) => {
    setModalConfig({
      title: 'Withdraw from ' + g.name,
      okText: 'Withdraw',
      fields: [{ k: 'a', l: 'Amount (₹)', t: 'number' }],
      onSubmit: async (v) => {
        const a = +v.a;
        if (!(a > 0)) return 'Enter an amount greater than 0.';
        if (a > g.saved) return 'You cannot withdraw more than is saved in this goal.';
        await withdrawMoneyFromGoal(g.id, a);
      },
    });
  };

  const handleDeleteGoal = (id) => {
    if (
      window.confirm(
        'Delete this goal? Its saved amount returns to your available balance.'
      )
    ) {
      deleteGoal(id);
    }
  };

  return (
    <div className="w pg">
      <div className="row sb">
        <h2 style={{ margin: 0 }}>Savings and goals</h2>
        <button className="btn sm" onClick={openCreateGoal}>
          Create Savings Goal
        </button>
      </div>
      <p style={{ marginTop: '8px' }}>
        Available to allocate: <b>{inr(s.bal)}</b>
      </p>

      {/* Goals Cards Grid */}
      <div className="g g2 mt">
        {goals.length ? (
          goals.map((g) => {
            const p = clamp(g.saved / g.target);
            return (
              <div className="card" key={g.id}>
                <div className="row sb">
                  <h3>{g.name}</h3>
                  {g.s ? <span className="tag o">Sample</span> : null}
                </div>
                <div className="br">
                  <b>{inr(g.saved)}</b>
                  <span>of {inr(g.target)}</span>
                </div>
                <div className="bar">
                  <i style={{ width: `${p * 100}%` }}></i>
                </div>
                <small>
                  {Math.round(p * 100)}% saved
                  {g.date ? ' · target ' + fmt(g.date) : ''}
                </small>
                <div className="row mt" style={{ marginTop: '16px' }}>
                  <button className="btn sm" onClick={() => openAddMoney(g)}>
                    Add money
                  </button>
                  <button className="btn ghost sm" onClick={() => openWithdraw(g)}>
                    Withdraw
                  </button>
                  <button className="btn ghost sm" onClick={() => openEditGoal(g)}>
                    Edit
                  </button>
                  <button className="btn d sm" onClick={() => handleDeleteGoal(g.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card ctr" style={{ gridColumn: '1/-1' }}>
            <h3>No goals yet</h3>
            <p>Create a pot for emergencies, repairs or something personal.</p>
          </div>
        )}
      </div>

      {/* Savings Target Calculator */}
      <div className="card mt">
        <h3>Savings calculator</h3>
        <p style={{ marginBottom: '20px' }}>
          How much to save each week or day to reach a target by a date.
        </p>
        <form className="g g3" noValidate onSubmit={(e) => e.preventDefault()}>
          <label>
            Target amount (₹)
            <input
              type="number"
              min="0"
              value={calcTarget}
              onChange={(e) => setCalcTarget(e.target.value)}
            />
          </label>
          <label>
            Already saved (₹)
            <input
              type="number"
              min="0"
              value={calcSaved}
              onChange={(e) => setCalcSaved(e.target.value)}
            />
          </label>
          <label>
            Target date
            <input
              type="date"
              value={calcDate}
              onChange={(e) => setCalcDate(e.target.value)}
            />
          </label>
        </form>
        <div className="v">{renderCalculatorResult()}</div>
      </div>

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
