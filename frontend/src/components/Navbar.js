import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎵</span>
        <span className="brand-name">Velvets</span>
      </div>
      <div className="navbar-links">
  <Link to="/mood" className={location.pathname === '/mood' ? 'nav-link active' : 'nav-link'}>
    Moods
  </Link>
  <Link to="/books" className={location.pathname.includes('/books') ? 'nav-link active' : 'nav-link'}>
    Books
  </Link>
  <Link to="/library" className={location.pathname === '/library' ? 'nav-link active' : 'nav-link'}>
    My Library
  </Link>
</div>
    </nav>
  );
};

export default Navbar;
