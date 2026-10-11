import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData, WORK, INC } from '../context/DataContext';

export default function Signup() {
  const { register } = useAuth();
  const { toast } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    n: '',
    e: '',
    p: '',
    w: '',
    i: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.n.trim().length < 2) {
      return setError('Please enter your full name.');
    }
    const email = formData.e.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Enter a valid email address.');
    }
    if (formData.p.length < 8 || !/\d/.test(formData.p)) {
      return setError('Password must be at least 8 characters and include a number.');
    }
    if (!formData.w) {
      return setError('Please select your type of work.');
    }
    if (!formData.i) {
      return setError('Please select your monthly income range.');
    }

    setLoading(true);
    try {
      await register({
        name: formData.n.trim(),
        email,
        password: formData.p,
        work: formData.w,
        income: formData.i,
      });
      toast('Account created. Welcome to SHIFT!');
      navigate('/dash');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w pg au">
      <div className="card">
        <h2 style={{ fontSize: '2rem' }}>Create your account</h2>
        <p style={{ marginBottom: '24px' }}>
          Accounts and cash flows are securely stored in MongoDB Atlas.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input
              name="n"
              autoComplete="name"
              value={formData.n}
              onChange={(e) => setFormData({ ...formData, n: e.target.value })}
            />
          </label>
          <label>
            Email address
            <input
              name="e"
              type="email"
              autoComplete="email"
              value={formData.e}
              onChange={(e) => setFormData({ ...formData, e: e.target.value })}
            />
          </label>
          <label>
            Password
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <input
                name="p"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.p}
                onChange={(e) => setFormData({ ...formData, p: e.target.value })}
              />
              <button
                type="button"
                className="btn ghost sm"
                style={{ marginTop: '6px' }}
                onClick={() => setShowPw((prev) => !prev)}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label>
            Type of work
            <select
              name="w"
              value={formData.w}
              onChange={(e) => setFormData({ ...formData, w: e.target.value })}
            >
              <option value="">Select…</option>
              {WORK.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label>
            Monthly income range
            <select
              name="i"
              value={formData.i}
              onChange={(e) => setFormData({ ...formData, i: e.target.value })}
            >
              <option value="">Select…</option>
              {INC.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <p className="err">{error}</p>
          <button className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt" style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'underline' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
