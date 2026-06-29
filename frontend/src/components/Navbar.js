import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// ==============================
// Styles
// ==============================
const styles = {
  navbar: {
    backgroundColor: '#1e3a8a',
    padding: '0 40px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    textDecoration: 'none',
    letterSpacing: '0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    listStyle: 'none',
  },
  link: {
    color: '#bfdbfe',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    color: '#ffffff',
    backgroundColor: '#2563eb',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
  },
};

// ==============================
// Navbar Component
// ==============================
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      {/* Brand */}
      <Link to="/" style={styles.brand}>
        💳 Credit Score AI
      </Link>

      {/* Navigation Links */}
      <ul style={styles.navLinks}>
        <li>
          <Link
            to="/"
            style={isActive('/') ? styles.activeLink : styles.link}
          >
            Loan Application
          </Link>
        </li>
        <li>
          <Link
            to="/history"
            style={isActive('/history') ? styles.activeLink : styles.link}
          >
            History
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;