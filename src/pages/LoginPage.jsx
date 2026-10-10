import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data: user } = await apiService.auth.login(form);
      login(user);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <div>
          <span className="auth-aside-mark"><UsersRound size={24} /></span>
          <h1>Your next great project starts with a team.</h1>
          <p>Sign in to find collaborators, manage your projects, and keep your team moving forward.</p>
        </div>
        <span className="small text-white-50"><Sparkles size={14} /> A shared space for student builders</span>
      </aside>
      <main className="auth-main">
        <section className="auth-card">
              <span className="page-eyebrow">WELCOME BACK</span>
              <h2>Sign in to TeamFinder</h2>
              <p className="mb-4">Use your college account to continue.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" autoComplete="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="password-field">
                    <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="form-control" value={form.password} onChange={handleChange} required />
                    <button className="password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              <p className="auth-switch mt-4 mb-0">New to TeamFinder? <Link to="/register">Create an account</Link></p>
        </section>
      </main>
    </div>
  );
}
