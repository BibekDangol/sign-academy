import React from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';
import './About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <Navbar1 /> 

      <main className="about-container">
        <div className="about-content">
          <h1 className="about-heading">About Us</h1>
          <p className="about-paragraph">
            Welcome to Sign Academy, a learning management platform designed for the Deaf community...
          </p>
          <p className="about-paragraph">
            Whether you want to learn sign language, develop communication skills...
          </p>
          <p className="about-paragraph">
            Join us and explore a barrier-free way of learning. Let's make education inclusive for everyone!
          </p>

          <Link to="/login">
            <button className="contact-button">Start</button>
          </Link>
        </div>
      </main>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-column">
              <h3>Useful Links</h3>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Connect with Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Subscribe to Our Newsletter</h3>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button type="submit" className="newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>
          <p className="footer-copyright">
            © 2024 Sign Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
