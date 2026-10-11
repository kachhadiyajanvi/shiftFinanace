import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_LIST } from './Home';
import { contactApi } from '../services/api';
import { useData } from '../context/DataContext';

export default function Help() {
  const { toast } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.trim().length < 2) {
      return setError('Please enter your name.');
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      return setError('Enter a valid email address.');
    }
    if (formData.message.trim().length < 10) {
      return setError('Message must be at least 10 characters.');
    }

    setLoading(true);
    try {
      const res = await contactApi.submit(formData);
      if (res.success) {
        toast('Thanks! Your message was saved to our database.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w pg">
      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>Help and contact</h1>
      <div className="g g2 mt">
        <div>
          <h3>FAQs</h3>
          {FAQ_LIST.map(([q, a], idx) => (
            <details key={idx}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
          <h3 className="mt">Privacy and security</h3>
          <p>
            We never ask for Aadhaar, PAN, UPI PIN or bank passwords. Read our{' '}
            <Link to="/privacy" style={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" style={{ textDecoration: 'underline' }}>
              Terms of Use
            </Link>
            .
          </p>
        </div>

        {/* Contact Form Connected to MongoDB Backend */}
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h3>Contact us</h3>
          <p style={{ marginBottom: '16px' }}>
            Support email: support@example.com (placeholder)
          </p>
          <label>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </label>
          <p className="err">{error}</p>
          <button className="btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
