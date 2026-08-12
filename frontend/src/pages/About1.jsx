import React from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar';
import Footer from './footer1';  // ✅ Import Footer component
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

          <Link to="/courses">
            <button className="contact-button">Start</button>
          </Link>
        </div>
      </main>

      <Footer /> {/* ✅ Now using Footer component instead of writing footer code manually */}
    </div>
  );
};

export default About;
