import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Modal, Button } from '@mui/material';
import AuthContext from '../context/AuthContext'; // Import the AuthContext
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setShowConfirmationModal(true);
  };

  const confirmLogout = () => {
    logoutUser();
    setShowConfirmationModal(false);
  };

  return (
    <nav className="navbar">
      {/* Link the logo to the home page */}
      <Link to="/" className="logo">
        Sign Academy
      </Link>

      {isMobile && (
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Close' : '☰'}
        </button>
      )}

      <ul className={`navbar-list ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/home2">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/handsign">HandSign</Link>
          <Link to="/dictionary">Dictionary</Link>
          <Link to="/about1">About</Link>
        </li>

        <li className="user-info">
          {user ? (
            <>
              <span>
                <FaUserCircle className="icon" />
                Welcome, {user.full_name}
                <button onClick={() => setShowMenu(!showMenu)} className="menu-button">
                  <FaBars />
                </button>
              </span>
              {showMenu && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <Link to="/dashboard">
                        <FaUserCircle className="icon" /> Profile
                      </Link>
                    </li>
                    <li>
                      <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <Link to="/signup" className="signup-link">
              <FaUserCircle className="icon" /> Sign Up
            </Link>
          )}
        </li>
      </ul>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <h2 id="modal-modal-title">Logout Confirmation</h2><br />
          <p id="modal-modal-description">Are you sure you want to logout?</p>
          <div className="modal-buttons">
            <Button onClick={() => setShowConfirmationModal(false)} variant="contained" className="cancel-button">Cancel</Button>
            <Button onClick={confirmLogout} variant="contained" className="logout-button">Logout</Button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;