import React from 'react';
import { Link } from 'react-router-dom';

export const FAQ_LIST = [
  [
    'Is SHIFT a bank?',
    'No. SHIFT is a fictional academic concept and is not a licensed bank. In the plan, regulated partners would provide banking, credit, insurance and investment services.',
  ],
  [
    'Is the data on the dashboard real?',
    'No. Balances and transactions come from what you enter, or from clearly labelled sample data. Nothing is a real bank balance.',
  ],
  [
    'Where is my data stored?',
    'Your data is stored securely in your database (MongoDB Atlas backend API) and accessible whenever you log in.',
  ],
  [
    'Do you ask for Aadhaar, PAN, UPI PIN or bank passwords?',
    'Never. Please do not enter them anywhere on SHIFT.',
  ],
  [
    'Does SHIFT give financial advice?',
    'No. SHIFT shares general educational information only. It does not approve loans or sell insurance.',
  ],
];

export default function Home() {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="w hero" style={{ paddingTop: '72px' }}>
        <div>
          <h1>Your income may change every day. Your financial future shouldn't.</h1>
          <p className="lead">
            SHIFT helps gig workers manage irregular income, save consistently and build financial security.
          </p>
          <div className="row">
            <Link className="btn" to="/signup">
              Get Started
            </Link>
            <button className="btn ghost" onClick={scrollToFeatures}>
              Explore Features
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="card">
          <span className="tag o">Sample preview</span>
          <div className="k mt">Available balance</div>
          <div className="v">₹18,420</div>
          <div className="g g2 mt" style={{ gap: '16px' }}>
            <div>
              <div className="k">Today's income</div>
              <b>₹2,840</b>
            </div>
            <div>
              <div className="k">Financial health</div>
              <b>72 / 100</b>
            </div>
          </div>
          <div className="mt">
            <div className="br">
              <span>Spendable</span>
              <b>₹10,200</b>
            </div>
            <div className="bar">
              <i style={{ width: '55%' }}></i>
            </div>
            <div className="br">
              <span>Emergency</span>
              <b>₹4,500</b>
            </div>
            <div className="bar">
              <i style={{ width: '24%' }}></i>
            </div>
            <div className="br">
              <span>Goals and reserves</span>
              <b>₹3,720</b>
            </div>
            <div className="bar">
              <i style={{ width: '20%' }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w" id="features">
        <h2>Everything you need, in one place</h2>
        <p className="lead" style={{ marginTop: 0 }}>
          Simple tools built around irregular earnings.
        </p>
        <div className="g g3">
          {[
            ['Income Hub', 'Record earnings from every source and see day, week and month totals.'],
            ['Expense tracking', 'Know where money goes: fuel, rent, food, phone and more.'],
            ['Savings pots', 'Create goals, add money and watch progress.'],
            ['Financial health score', 'A clear score out of 100, with an explained method.'],
            ['Credit and protection', 'EMI calculator and plain-language insurance guides.'],
            ['Ask SHIFT', 'Ask budgeting questions and get simple answers.'],
          ].map(([a, b]) => (
            <div className="card" key={a}>
              <h3>{a}</h3>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w">
        <h2>How SHIFT works</h2>
        <div className="g g3 mt">
          {[
            'Track your earnings|Add income from every platform and job in seconds.',
            'Organise your money|See spending by category and set aside savings.',
            'Build your financial security|Grow an emergency fund and understand credit and insurance.',
          ].map((s, i) => {
            const [a, b] = s.split('|');
            return (
              <div key={i}>
                <div className="num">{i + 1}</div>
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem Comparison */}
      <section className="w">
        <div className="g g2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Built for people who earn differently</h2>
            <p>Banks are built for salaries. Gig workers don't get one.</p>
          </div>
          <ul className="c">
            <li>Income changes daily and comes from several platforms.</li>
            <li>One illness, accident or breakdown stops earnings.</li>
            <li>Saving a fixed sum each month is unrealistic.</li>
            <li>It is hard to know what is safe to spend today.</li>
          </ul>
        </div>
      </section>

      {/* Questions / FAQs */}
      <section className="w">
        <h2>Questions</h2>
        {FAQ_LIST.map(([q, a], idx) => (
          <details key={idx}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="w ctr">
        <h2>Start with your first earning</h2>
        <div className="row">
          <Link className="btn" to="/signup">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
