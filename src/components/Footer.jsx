import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-text">&copy; 2026 <Link to="/">musing</Link> &mdash; all thoughts are my own</p>
        <div className="footer-links">
          <Link to="/posts">Posts</Link>
          <Link to="/about">About</Link>
          <Link to="/bookmarks">Bookmarks</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
