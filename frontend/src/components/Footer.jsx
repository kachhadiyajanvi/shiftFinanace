import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_FALLBACK } from './Header';

export default function Footer() {
  return (
    <footer id="f">
      <div className="w ft">
        <div>
          <img src={LOGO_FALLBACK} alt="SHIFT" />
          <p>
            SHIFT is a fictional academic concept. It is not a licensed bank. Banking,
            credit, insurance and investment services would be provided through
            regulated partners. Sample data is illustrative.
          </p>
        </div>
        <div className="fl">
          <Link to="/about">About</Link>
          <Link to="/help">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/help">Support</Link>
        </div>
      </div>
    </footer>
  );
}
