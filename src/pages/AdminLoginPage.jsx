import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await apiService.auth.login(form);
      if (data.role !== 'ADMIN') {
        await apiService.auth.logout();
        setError('This account does not have administrator access.');
        return;
      }
      login(data);
      navigate('/admin/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Admin login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <div>
          <span className="auth-aside-mark"><ShieldCheck size={24} /></span>
          <h1>Manage the workspace with clarity.</h1>
          <p>Review activity, students, projects, and team requests from the TeamFinder administration area.</p>
        </div>
        <span className="small text-white-50">TeamFinder administration</span>
      </aside>
      <main className="auth-main">
        <section className="auth-card">
              <span className="page-eyebrow">ADMINISTRATOR</span>
              <h2>Admin sign in</h2>
              <p className="mb-4">Use an account with administrator access.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" autoComplete="username" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button className="password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in to admin'}</button>
              </form>
        </section>
      </main>
    </div>
  );
}
