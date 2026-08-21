import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar1 from './Navbar1';
import Footer from './Footer';
import bgi from './img/cover.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="[font-family:'Segoe_UI',sans-serif] text-[#222] bg-[#eeebeb]">
      <Navbar1 />

      {/* Hero Section */}
      <section className="bg-cover bg-center h-[90vh] flex items-center justify-center relative text-center text-white" style={{ backgroundImage: `url(${bgi})` }}>
        <div className="w-[calc(100%-2rem)] max-w-[700px] p-4 md:p-12 rounded-[10px]">
        <h1 className="text-[3rem] mb-4 max-md:text-[2.5rem]" style={{ color: "white" }}>SIGN Academy</h1>
        <p className="text-[1.5rem] mb-8 max-md:text-[1.2rem]">Your path to mastering new skills starts here.</p>
        <Button size="lg" className="text-base hover:bg-brand-dark" onClick={handleStartLearning}>Start Learning</Button>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Courses Section */}
        <section className="courses-section" id="courses">
          <h2 className="text-center text-[2rem] mt-12">Popular Courses</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-center gap-8 p-8">
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://www.odro.co.uk/wp-content/uploads/2021/07/video-content-blog-header-.jpg" alt="Course 1" />
                <h3>Sign Language 101</h3>
                <p>Learn basic signs with video demonstrations.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://www.loc.gov/nls/wp-content/uploads/2023/09/Who-We-Serve-Deaf-Blind.jpg" alt="Course 2" />
                <h3>Tech Skills</h3>
                <p>Master technology basics for work and daily life.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://images.squarespace-cdn.com/content/v1/6310f29116612f02890aeae7/a401c9bf-a356-463e-b2b4-571621f8d44f/advocacy.jpg?format=1000w" alt="Course 3" />
                <h3>Deaf Advocacy</h3>
                <p>Understand rights, culture, and empowerment.</p>
              </CardContent>
            </Card>
          </div>
        </section>
<hr></hr>
        {/* Categories Section */}
        <section className="categories-section">
          <h2 className="text-center text-[2rem] mt-12">Categories</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-center gap-8 p-8">
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Language</h3>
                <p>Courses on ASL, BSL, and other sign languages.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Technology</h3>
                <p>Learn computers, internet, and apps for work.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Life Skills</h3>
                <p>Practical courses for everyday living success.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <hr></hr>
        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="text-center text-[2rem] mt-12">Testimonials</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-center gap-8 p-8">
            <Card className="bg-[#f1f8ff] italic rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <p>"SIGN Academy helped me find a new career!"</p>
                <p><strong>– Alumni A</strong></p>
              </CardContent>
            </Card>
            <Card className="bg-[#f1f8ff] italic rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <p>"Very accessible courses with sign support."</p>
                <p><strong>– Alumni B</strong></p>
              </CardContent>
            </Card>
            <Card className="bg-[#f1f8ff] italic rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <p>"I loved learning visually with amazing videos."</p>
                <p><strong>– Alumni C</strong></p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <hr></hr>
      {/* Contact Us Section */}
      <section className="contact" id ="contact">
        <h2 style={{ textAlign: "center" }}>Contact Us</h2>
        <form className="w-[calc(100%-2rem)] max-w-[600px] my-12 mx-auto p-8 bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.1)]" onSubmit={handleSubmit}>
          <Input
            className="w-full p-4 mb-4 border border-[#ccc] rounded-md"
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactData.name}
            onChange={handleChange}
            required
          />
          <Input
            className="w-full p-4 mb-4 border border-[#ccc] rounded-md"
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactData.email}
            onChange={handleChange}
            required
          />
          <Textarea
            className="w-full p-4 mb-4 border border-[#ccc] rounded-md"
            name="message"
            placeholder="Your Message"
            rows="4"
            value={contactData.message}
            onChange={handleChange}
            required
          />
          <Button className="w-full bg-brand hover:bg-brand-dark text-white p-4 rounded-md text-base" type="submit">Send</Button>
          {statusMsg && <p className="mt-4 text-center font-medium">{statusMsg}</p>}
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
