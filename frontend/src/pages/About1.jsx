import React from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar';
import Footer from './footer1';  // ✅ Import Footer component
import aboutBg from './img/image4.png';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 /> 

      <main className="flex-1 flex justify-center items-center py-10 px-5 bg-cover bg-center" style={{ backgroundImage: `url(${aboutBg})` }}>
        <div className="max-w-[800px] bg-white/90 p-4 md:p-10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-center">
          <h1 className="text-[30px] md:text-[36px] font-bold text-black mb-5">About Us</h1>
          <p className="text-[18px] leading-[1.6] text-[#333] mb-[15px]">
            Welcome to Sign Academy, a learning management platform designed for the Deaf community...
          </p>
          <p className="text-[18px] leading-[1.6] text-[#333] mb-[15px]">
            Whether you want to learn sign language, develop communication skills...
          </p>
          <p className="text-[18px] leading-[1.6] text-[#333] mb-[15px]">
            Join us and explore a barrier-free way of learning. Let's make education inclusive for everyone!
          </p>

          <Button asChild className="bg-[#0dd943] text-black font-bold py-[15px] px-10 text-[18px] rounded-[10px] hover:bg-[#0bbf3a]">
            <Link to="/courses">Start</Link>
          </Button>
        </div>
      </main>

      <Footer /> {/* ✅ Now using Footer component instead of writing footer code manually */}
    </div>
  );
};

export default About;
