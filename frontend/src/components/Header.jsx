import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Logo from '../assests/shiftLogo.png';

export const LOGO_FALLBACK = Logo;

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast('Logged out.');
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header id="h">
      <div className="w hb">
        <Link to={isAuthenticated ? '/dash' : '/'} onClick={closeMenu}>
          <img src={LOGO_FALLBACK} alt="SHIFT" />
        </Link>

        <button
          id="mb"
          className="btn ghost sm"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          Menu
        </button>

        <nav id="nv" className={menuOpen ? 'open' : ''}>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dash"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/money"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Money
              </NavLink>
              <NavLink
                to="/save"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Savings
              </NavLink>
              <NavLink
                to="/credit"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Credit &amp; Protection
              </NavLink>
              <NavLink
                to="/health"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Health
              </NavLink>
              <NavLink
                to="/ask"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Ask SHIFT
              </NavLink>
              <button className="btn sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                About
              </NavLink>
              <NavLink
                to="/help"
                className={({ isActive }) => (isActive ? 'on' : '')}
                onClick={closeMenu}
              >
                Help
              </NavLink>
              <Link to="/login" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/signup" className="btn sm" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
