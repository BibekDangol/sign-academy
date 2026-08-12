import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ Import Link and useLocation
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // ✅ Check if user is on Home page

  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Useful Links */}
        <div className="footer-column">
          <h3>Useful Links</h3>
          <ul>
            <li>
              {isHomePage ? (
                <a href="#courses">Our Services</a> // ✅ Simple anchor if already on Home
              ) : (
                <Link to="/#courses">Our Services</Link> // ✅ Navigate if not Home
              )}
            </li>
            <li>
              {isHomePage ? (
                <a href="#contact">Contact Us</a>
              ) : (
                <Link to="/#contact">Contact Us</Link>
              )}
            </li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div className="footer-column">
          <h3>Connect with Us</h3>
          <ul>
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter /> Twitter
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-column">
          <h3>Subscribe to Our Newsletter</h3>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sign Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
