import React, { useState, useMemo } from 'react';
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
  SRC,
  CAT,
} from '../context/DataContext';
import BarChart from '../components/BarChart';
import Modal from '../components/Modal';

export default function Money() {
  const {
    tx,
    stats,
    f,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useData();

  const [modalConfig, setModalConfig] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const s = stats();
  const inc = tx.filter((x) => x.type === 'in');
  const ks = mks(6);
  const mv = ks.map((k) => f('in', k));
  const act = ks.filter((k, i) => mv[i] > 0);
  const av = mks(3)
    .map((k) => f('in', k))
    .filter((x) => x > 0);
  const lw = sum(
    inc.filter((x) => x.date >= wkS(-7) && x.date < wkS()),
    (x) => x.amt
  );
  const tw = sum(
    inc.filter((x) => x.date >= wkS()),
    (x) => x.amt
  );

  const hi = mv.indexOf(Math.max(...mv));
  const nonzero = mv.filter((x) => x > 0);
  const lo = nonzero.length ? mv.indexOf(Math.min(...nonzero)) : -1;

  // Filtered and sorted transactions
  const filteredTxs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return [...tx]
      .sort(
        (x, y) =>
          y.date.localeCompare(x.date) || String(y.id).localeCompare(String(x.id))
      )
      .filter((x) => {
        if (filterType && x.type !== filterType) return false;
        if (filterCat && x.cat !== filterCat) return false;
        if (fromDate && x.date < fromDate) return false;
        if (toDate && x.date > toDate) return false;
        if (q && !(x.desc + ' ' + x.cat).toLowerCase().includes(q)) return false;
        return true;
      });
  }, [tx, filterType, filterCat, fromDate, toDate, searchQuery]);

  const totalFilteredInc = sum(
    filteredTxs.filter((x) => x.type === 'in'),
    (x) => x.amt
  );
  const totalFilteredEx = sum(
    filteredTxs.filter((x) => x.type === 'ex'),
    (x) => x.amt
  );

  // Modals
  const openAdd = (type) => {
    const isIncome = type === 'in';
    setModalConfig({
      title: `Add ${isIncome ? 'income' : 'expense'}`,
      okText: 'Add',
      fields: [
        { k: 'amt', l: 'Amount (₹)', t: 'number' },
        { k: 'date', l: 'Date', t: 'date', v: today() },
        { k: 'cat', l: isIncome ? 'Source' : 'Category', o: isIncome ? SRC : CAT },
        { k: 'desc', l: 'Description (optional)' },
      ],
      onSubmit: async (v) => {
        const a = +v.amt;
        if (!(a > 0) || a > 1e7) return 'Enter an amount greater than 0.';
        if (!v.date || v.date > today()) return 'Choose a valid date that is not in the future.';
        if ((v.desc || '').length > 60) return 'Description must be 60 characters or fewer.';
        await addTransaction({
          type,
          amt: a,
          date: v.date,
          cat: v.cat,
          desc: (v.desc || '').trim(),
        });
      },
    });
  };

  const openEdit = (item) => {
    const isIncome = item.type === 'in';
    setModalConfig({
      title: `Edit ${isIncome ? 'income' : 'expense'}`,
      okText: 'Save changes',
      fields: [
        { k: 'amt', l: 'Amount (₹)', t: 'number', v: item.amt },
        { k: 'date', l: 'Date', t: 'date', v: item.date },
        { k: 'cat', l: isIncome ? 'Source' : 'Category', o: isIncome ? SRC : CAT, v: item.cat },
        { k: 'desc', l: 'Description (optional)', v: item.desc },
      ],
      onSubmit: async (v) => {
        const a = +v.amt;
        if (!(a > 0) || a > 1e7) return 'Enter an amount greater than 0.';
        if (!v.date || v.date > today()) return 'Choose a valid date that is not in the future.';
        if ((v.desc || '').length > 60) return 'Description must be 60 characters or fewer.';
        await editTransaction(item.id, {
          amt: a,
          date: v.date,
          cat: v.cat,
          desc: (v.desc || '').trim(),
        });
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="w pg">
      <div className="row sb">
        <h2 style={{ margin: 0 }}>Income Hub</h2>
        <div className="row">
          <button className="btn sm" onClick={() => openAdd('in')}>
            Add Income
          </button>
          <button className="btn ghost sm" onClick={() => openAdd('ex')}>
            Add Expense
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="g g4 s mt">
        <div className="card" style={{ padding: '22px' }}>
          <div className="k">Today</div>
          <div className="v">
            {inr(
              sum(
                inc.filter((x) => x.date === today()),
                (x) => x.amt
              )
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div className="k">This week</div>
          <div className="v">{inr(tw)}</div>
          <small>{cmp(tw, lw)} week</small>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div className="k">This month</div>
          <div className="v">{inr(s.inc)}</div>
          <small>{cmp(s.inc, s.pinc)} month</small>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div className="k">
            Estimated monthly <span className="tag o">Estimate</span>
          </div>
          <div className="v">
            {av.length ? inr(sum(av, (x) => x) / av.length) : '—'}
          </div>
          <small>Average of recent months with income. Not actual income.</small>
        </div>
      </div>

      {/* Trend & High/Low Analysis */}
      <div className="g g2 mt">
        <div className="card">
          <h3>Monthly income trend</h3>
          <BarChart values={mv} labels={ks.map(mon)} color="#12B8A6" />
        </div>

        <div className="card">
          <h3>Highest and lowest periods</h3>
          {act.length && lo !== -1 ? (
            <>
              <div className="k">Highest month</div>
              <div className="v">
                {mon(ks[hi])} · {inr(mv[hi])}
              </div>
              <div className="k mt">Lowest month</div>
              <div className="v">
                {mon(ks[lo])} · {inr(mv[lo])}
              </div>
            </>
          ) : (
            <p>Add income to compare periods.</p>
          )}
        </div>
      </div>

      {/* Transactions Section & Filters */}
      <div className="card mt">
        <h3>Transactions</h3>
        <form className="g g4 s" style={{ gap: '12px' }} onSubmit={(e) => e.preventDefault()}>
          <label>
            Type
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All</option>
              <option value="in">Income</option>
              <option value="ex">Expense</option>
            </select>
          </label>

          <label>
            Category / source
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All</option>
              {[...SRC, ...CAT].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label>
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>

          <label style={{ gridColumn: '1/-1' }}>
            Search
            <input
              placeholder="Search description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </form>

        <div className="k" style={{ margin: '8px 0' }}>
          {filteredTxs.length} entries · Income {inr(totalFilteredInc)} · Expenses {inr(totalFilteredEx)}
        </div>

        <div>
          {filteredTxs.length ? (
            filteredTxs.map((x) => (
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
                <span className="row">
                  <button
                    className="btn ghost sm"
                    onClick={() => openEdit(x)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn d sm"
                    onClick={() => handleDelete(x.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p>No transactions match. Use Add Income or Add Expense to start.</p>
          )}
        </div>
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
