'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/student/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError('Incorrect password. Please contact your teacher.');
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-logo-arabic">إدارة جعفرية</div>
        <h2>Student Portal</h2>
        <p>Idarah-e-Jafaria Melbourne Hawza</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="student-pass">Portal Password</label>
            <input
              id="student-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter portal password"
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Enter Portal'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--green-400)' }}>← Back to main site</Link>
        </p>
      </div>
    </div>
  );
}
