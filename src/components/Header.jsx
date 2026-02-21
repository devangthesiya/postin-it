import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      let hours = ist.getHours();
      const mins = String(ist.getMinutes()).padStart(2, '0');
      const secs = String(ist.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setClock(`${String(hours).padStart(2, '0')}:${mins}:${secs} ${ampm}`);
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  function toggleMenu() {
    setMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  }

  function closeMenu() {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }

  const themeLabel = theme === 'dark' ? 'LIGHT' : 'DARK';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/about', label: 'About' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-location">
            <Link to="/" className="header-home" aria-label="Home">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8.5L10 3l7 5.5V16a1 1 0 01-1 1h-3.5v-4.5a1 1 0 00-1-1h-3a1 1 0 00-1 1V17H4a1 1 0 01-1-1V8.5z" fill="currentColor"/>
              </svg>
            </Link>
            <span className="header-city">Bengaluru</span>
            <span className="header-arrow">&rarr;</span>
            <span className="header-clock">{clock}</span>
          </div>

          <nav className="nav-links">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
            <button className="theme-toggle-text" onClick={toggleTheme} aria-label="Toggle dark mode">
              {themeLabel}
            </button>
          </nav>

          <div className="hamburger-wrapper">
            <button className="theme-toggle-text" onClick={toggleTheme} aria-label="Toggle dark mode">
              {themeLabel}
            </button>
            <button
              className={`hamburger${menuOpen ? ' active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={closeMenu}>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
