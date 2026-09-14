import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar">
      <input type="checkbox" id="hamburger" />

      <div className="nav-logo">
        <Link to="/" className="logo-link">
          <img src="/assets/icons/logo.svg" alt="Coffee Logo" />
        </Link>
        <p className="logo-text">
          Coffee<span style={{ color: 'oklch(73.229% 0.15551 25.739)' }}> @ UMD </span>
        </p>
      </div>

      <label htmlFor="hamburger" className="hamburger-bars">
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
          <rect y="30" width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
          <rect y="60" width="100" height="20" rx="10" fill="oklch(23.433% 0.01913 40.841)"></rect>
        </svg>
      </label>

      <div className="divider"></div>

      <nav className="nav-links">
        <div className="nav-page">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'current-page' : '')}>
            Home
          </NavLink>
          <a href="">About</a>
          <a href="">Resources</a>
          <a href="">Community</a>
        </div>
        <div className="nav-action">
          <a href="">Join</a>
        </div>
      </nav>
    </div>
  );
}
