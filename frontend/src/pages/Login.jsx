import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ e: '', p: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = formData.e.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Enter a valid email address.');
    }
    if (!formData.p) {
      return setError('Enter your password.');
    }

    setLoading(true);
    try {
      await login({ email, password: formData.p });
      toast('Logged in.');
      navigate('/dash');
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w pg au">
      <div className="card">
        <h2 style={{ fontSize: '2rem' }}>Welcome back</h2>
        <p style={{ marginBottom: '24px' }}>
          Log in with your SHIFT account to manage your irregular income and savings.
        </p>
        <form onSubmit={handleSubmit} noValidate>
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
                autoComplete="current-password"
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
          <p className="err">{error}</p>
          <button className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt" style={{ marginTop: '20px' }}>
          New here?{' '}
          <Link to="/signup" style={{ textDecoration: 'underline' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
