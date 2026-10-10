import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShieldCheck, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const displayName = auth?.name || auth?.email || '';
  const initials = displayName.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');

  return (
    <nav className="tf-navbar d-flex align-items-center">
      <button className="tf-menu-button" type="button" onClick={auth ? onMenuToggle : () => setPublicMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={auth ? undefined : publicMenuOpen}>
          <Menu size={18} />
      </button>
      <div className="d-flex align-items-center w-100">
        <Link className="tf-brand" to={auth ? (auth.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard') : '/'}>
          <span className="tf-brand-mark"><UsersRound size={18} strokeWidth={2.5} /></span>
          TeamFinder
        </Link>

        {!auth && <div className="tf-nav-links">
          <NavLink className={({ isActive }) => `tf-nav-link${isActive ? ' active' : ''}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `tf-nav-link${isActive ? ' active' : ''}`} to="/about">About</NavLink>
        </div>}

        {!auth ? (
          <div className="d-flex gap-2 ms-auto">
            <Link className="btn btn-outline-primary btn-sm" to="/login">Log in</Link>
            <Link className="btn btn-primary btn-sm" to="/register">Get started</Link>
          </div>
        ) : (
          <div className="tf-user-menu">
            {auth.role === 'ADMIN' && <span className="badge bg-primary-subtle text-primary"><ShieldCheck size={12} /> Admin</span>}
            <Link className="tf-user-ident" to={auth.role === 'ADMIN' ? '/admin/dashboard' : '/student/profile'} aria-label="Open profile">
              <span className="tf-avatar">{initials || 'TF'}</span>
              <span className="tf-user-copy"><strong>{displayName}</strong><small>{auth.role === 'ADMIN' ? 'Administrator' : 'Student account'}</small></span>
            </Link>
            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleLogout}>
              <LogOut size={14} /><span className="logout-label">Log out</span>
            </button>
          </div>
        )}
      </div>
      {!auth && publicMenuOpen && (
        <div className="public-mobile-menu">
          <NavLink to="/" onClick={() => setPublicMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setPublicMenuOpen(false)}>About</NavLink>
        </div>
      )}
    </nav>
  );
}
