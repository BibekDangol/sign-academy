import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar1 from './Navbar1';
import Footer from './Footer';
import bgi from './img/cover.jpg';
import './Home.css'; 

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [statusMsg, setStatusMsg] = useState('');

  const handleStartLearning = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/contact/', contactData);
      setStatusMsg('✅ Message sent successfully!');
      setContactData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatusMsg('❌ Failed to send message. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="home-container">
      <Navbar1 />

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${bgi})` }}>
        <div className="hero-overlay">
        <h1 style={{ color: "white" }}>SIGN Academy</h1>
        <p>Your path to mastering new skills starts here.</p>
        <button className="btn-cta" onClick={handleStartLearning}>Start Learning</button>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Courses Section */}
        <section className="courses-section" id="courses">
          <h2>Popular Courses</h2>
          <div className="cards-row">
            <div className="card">
              <img src="https://www.odro.co.uk/wp-content/uploads/2021/07/video-content-blog-header-.jpg" alt="Course 1" />
              <h3>Sign Language 101</h3>
              <p>Learn basic signs with video demonstrations.</p>
            </div>
            <div className="card">
              <img src="https://www.loc.gov/nls/wp-content/uploads/2023/09/Who-We-Serve-Deaf-Blind.jpg" alt="Course 2" />
              <h3>Tech Skills</h3>
              <p>Master technology basics for work and daily life.</p>
            </div>
            <div className="card">
              <img src="https://images.squarespace-cdn.com/content/v1/6310f29116612f02890aeae7/a401c9bf-a356-463e-b2b4-571621f8d44f/advocacy.jpg?format=1000w" alt="Course 3" />
              <h3>Deaf Advocacy</h3>
              <p>Understand rights, culture, and empowerment.</p>
            </div>
          </div>
        </section>
<hr></hr>
        {/* Categories Section */}
        <section className="categories-section">
          <h2>Categories</h2>
          <div className="cards-row">
            <div className="card">
              <h3>Language</h3>
              <p>Courses on ASL, BSL, and other sign languages.</p>
            </div>
            <div className="card">
              <h3>Technology</h3>
              <p>Learn computers, internet, and apps for work.</p>
            </div>
            <div className="card">
              <h3>Life Skills</h3>
              <p>Practical courses for everyday living success.</p>
            </div>
          </div>
        </section>
        <hr></hr>
        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>Testimonials</h2>
          <div className="cards-row">
            <div className="card">
              <p>"SIGN Academy helped me find a new career!"</p>
              <p><strong>– Alumni A</strong></p>
            </div>
            <div className="card">
              <p>"Very accessible courses with sign support."</p>
              <p><strong>– Alumni B</strong></p>
            </div>
            <div className="card">
              <p>"I loved learning visually with amazing videos."</p>
              <p><strong>– Alumni C</strong></p>
            </div>
          </div>
        </section>
      </main>
      <hr></hr>
      {/* Contact Us Section */}
      <section className="contact" id ="contact">
        <h2 style={{ textAlign: "center" }}>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={contactData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send</button>
          {statusMsg && <p className="contact-status">{statusMsg}</p>}
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
