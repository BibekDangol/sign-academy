import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar1.css';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="nav-left">
        <Link to="/" className="logo-text">Sign Academy</Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Right - Navigation & User Info */}
      <div className={`nav-right ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Courses</Link></li>
        </ul>
        <div className="user-info">
          {user ? (
            <button onClick={logoutUser}>Logout</button>
          ) : (
            <Link to="/login" onClick={toggleMenu}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
