import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { inr } from '../context/DataContext';

export const CK1 = [
  'I have a regular record of my income',
  'I know my monthly expenses',
  'I have no missed repayments this year',
  'I have an emergency fund of at least one month',
  'I only borrow what my income can comfortably repay',
];

export const CK2 = [
  'I have accident cover',
  'I have health cover for myself',
  'I know how I would replace income if I could not work',
  'My vehicle or phone is protected, if I rely on it',
];

export default function Credit() {
  const { user, updateChecklist } = useAuth();
  const chk = user?.chk || {};

  // Loan calculator state
  const [loanP, setLoanP] = useState(50000);
  const [loanR, setLoanR] = useState(18);
  const [loanN, setLoanN] = useState(12);

  const handleCheck = (key, checked) => {
    updateChecklist(key, checked);
  };

  // Render Loan EMI Calculation
  const renderEmiResult = () => {
    const p = Number(loanP);
    const a = Number(loanR);
    const n = Math.round(Number(loanN));
    const r = a / 1200;

    if (!(p > 0) || !(n > 0) || a < 0 || a > 100) {
      return (
        <p className="err mt">
          Enter a loan amount, a rate between 0 and 100, and a tenure of at least 1 month.
        </p>
      );
    }

    const e = r ? (p * r * (1 + r) ** n) / ((1 + r) ** n - 1) : p / n;
    const t = e * n;

    return (
      <>
        <div className="g g2 mt">
          <div>
            <div className="k">Estimated EMI</div>
            <div className="v">{inr(e)}</div>
          </div>
          <div>
            <div className="k">Total repayment</div>
            <div className="v">{inr(t)}</div>
          </div>
        </div>
        <small style={{ marginTop: '10px' }}>
          Total interest {inr(t - p)}. Assumptions: fixed rate, monthly reducing balance, equal
          monthly payments, no fees or taxes. Illustrative only, not an offer.
        </small>
      </>
    );
  };

  return (
    <div className="w pg">
      <h2>Credit and protection</h2>
      <p className="lead" style={{ marginTop: 0 }}>
        Credit would be offered through authorised lending partners and insurance through
        authorised insurers. Nothing here is an approval, offer or guaranteed rate.
      </p>

      {/* Credit Readiness & EMI Calculator */}
      <div className="g g2">
        <div className="card">
          <h3>Credit readiness</h3>
          <p style={{ marginBottom: '16px' }}>
            Lenders look for steady records and the ability to repay. Tick what is true for you.
          </p>
          {CK1.map((item, i) => {
            const key = 'a' + i;
            return (
              <label key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={Boolean(chk[key])}
                  onChange={(e) => handleCheck(key, e.target.checked)}
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>

        <div className="card">
          <h3>Loan repayment calculator</h3>
          <form className="g" style={{ gap: 0 }} onSubmit={(e) => e.preventDefault()} noValidate>
            <label>
              Loan amount (₹)
              <input
                type="number"
                min="0"
                value={loanP}
                onChange={(e) => setLoanP(e.target.value)}
              />
            </label>
            <label>
              Interest rate (% per year)
              <input
                type="number"
                min="0"
                step="any"
                value={loanR}
                onChange={(e) => setLoanR(e.target.value)}
              />
            </label>
            <label>
              Tenure (months)
              <input
                type="number"
                min="1"
                value={loanN}
                onChange={(e) => setLoanN(e.target.value)}
              />
            </label>
          </form>
          <div id="eo">{renderEmiResult()}</div>
        </div>
      </div>

      {/* Insurance Needs & Coverage Types */}
      <div className="g g2 mt">
        <div className="card">
          <h3>Insurance needs checklist</h3>
          <p style={{ marginBottom: '16px' }}>
            Insurance helps when one bad week could stop your earnings.
          </p>
          {CK2.map((item, i) => {
            const key = 'b' + i;
            return (
              <label key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={Boolean(chk[key])}
                  onChange={(e) => handleCheck(key, e.target.checked)}
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>

        <div className="card">
          <h3>Coverage types</h3>
          <ul className="c">
            <li>
              <b>Accident:</b> pays if you are injured and cannot work.
            </li>
            <li>
              <b>Health:</b> covers hospital bills.
            </li>
            <li>
              <b>Income protection:</b> replaces part of earnings if you cannot work.
            </li>
          </ul>
        </div>
      </div>

      {/* Terms Guide */}
      <div className="card mt">
        <h3>Terms to understand before choosing a policy</h3>
        <ul className="c">
          <li>
            <b>Premium:</b> what you pay for the cover.
          </li>
          <li>
            <b>Sum insured:</b> the most the insurer will pay.
          </li>
          <li>
            <b>Waiting period:</b> time before some claims are allowed.
          </li>
          <li>
            <b>Exclusions:</b> situations the policy does not cover.
          </li>
          <li>
            <b>Deductible / co-pay:</b> the part you pay yourself.
          </li>
        </ul>
      </div>
    </div>
  );
}
