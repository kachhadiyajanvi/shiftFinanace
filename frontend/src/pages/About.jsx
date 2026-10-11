import React from 'react';

export default function About() {
  return (
    <div className="w pg">
      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
        Financial security for people who earn differently.
      </h1>
      <p className="lead">
        “To make financial security more accessible to every worker, regardless of how or when they earn.”
      </p>

      <div className="g g2 mt">
        <div className="card">
          <h3>The problem</h3>
          <p>
            Banks are built for salaries. Gig workers face daily-changing income, credit checks that ignore
            irregular cash flow, and no cushion when illness or a breakdown stops earnings. Planning around a
            fixed monthly sum rarely works.
          </p>
        </div>
        <div className="card">
          <h3>Vision</h3>
          <p>To become India's most trusted financial platform for people who earn differently.</p>
        </div>
        <div className="card">
          <h3>Mission</h3>
          <p>
            Simplify, protect and strengthen gig workers' financial lives through cash-flow management,
            responsible credit and protection.
          </p>
        </div>
        <div className="card">
          <h3>What we offer</h3>
          <p>
            Income Hub, expense tracking, savings pots, a financial health score, credit and insurance
            guides, and a financial assistant.
          </p>
        </div>
      </div>

      <h2 className="mt" style={{ marginTop: '56px' }}>
        Our commitments
      </h2>
      <div className="g g3">
        <div className="card">
          <h3>Accessibility</h3>
          <p>Simple language, mobile first.</p>
        </div>
        <div className="card">
          <h3>Transparency</h3>
          <p>Every calculation shows its method.</p>
        </div>
        <div className="card">
          <h3>Resilience</h3>
          <p>Tools that prepare you for lean weeks.</p>
        </div>
      </div>
    </div>
  );
}
