import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeId: '',
    branch: 'Computer Science',
    year: 1,
    phone: '',
    bio: '',
  });
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
    if (!form.name || !form.email || !form.password || !form.collegeId) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        password: form.password,
        collegeId: form.collegeId,
        branch: form.branch,
        year: Number(form.year),
        phone: form.phone,
        bio: form.bio,
      };
      await apiService.auth.register(registrationData);
      const { data: user } = await apiService.auth.login({ email: form.email, password: form.password });
      login(user);
      navigate('/student/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout register-layout">
      <aside className="auth-aside">
        <div>
          <span className="auth-aside-mark"><UsersRound size={24} /></span>
          <h1>Bring your skills to the table.</h1>
          <p>Create your student profile and find the people who can help turn your idea into something real.</p>
        </div>
        <span className="small text-white-50"><Sparkles size={14} /> Meet your next project collaborators</span>
      </aside>
      <main className="auth-main">
        <section className="auth-card auth-card-wide">
              <span className="page-eyebrow">GET STARTED</span>
              <h2>Create your student profile</h2>
              <p className="mb-4">A few details help teammates find the right fit.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input name="name" autoComplete="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" autoComplete="email" className="form-control" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <div className="password-field">
                      <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="6" className="form-control" value={form.password} onChange={handleChange} required />
                      <button className="password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="6" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">College ID / Roll Number</label>
                    <input name="collegeId" className="form-control" value={form.collegeId} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Branch</label>
                    <select name="branch" className="form-select" value={form.branch} onChange={handleChange}>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>AI & ML</option>
                      <option>Mechanical</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Year</label>
                    <input name="year" type="number" min="1" max="5" className="form-control" value={form.year} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Short Bio</label>
                    <textarea name="bio" rows="3" className="form-control" value={form.bio} onChange={handleChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4 w-100" disabled={submitting}>
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="auth-switch mt-4 mb-0">Already have an account? <Link to="/login">Sign in</Link></p>
        </section>
      </main>
    </div>
  );
}
