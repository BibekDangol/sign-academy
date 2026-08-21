import React from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';
import aboutBg from './img/image4.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
            <Link to="/login">Start</Link>
          </Button>
        </div>
      </main>

      <footer className="bg-[#101010] text-white py-10 px-5 md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:flex-wrap justify-between">
            <div className="w-full md:w-auto flex-1 min-w-[250px] mb-[30px]">
              <h3 className="text-[22px] mb-[15px]">Useful Links</h3>
              <ul className="list-none p-0">
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#about">About Us</a></li>
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#services">Our Services</a></li>
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="w-full md:w-auto flex-1 min-w-[250px] mb-[30px]">
              <h3 className="text-[22px] mb-[15px]">Connect with Us</h3>
              <ul className="list-none p-0">
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#">Facebook</a></li>
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#">Twitter</a></li>
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#">Instagram</a></li>
                <li className="mb-2.5"><a className="text-white no-underline text-base transition-colors duration-300 hover:text-[#0dd943]" href="#">LinkedIn</a></li>
              </ul>
            </div>
            <div className="w-full md:w-auto flex-1 min-w-[250px] mb-[30px]">
              <h3 className="text-[22px] mb-[15px]">Subscribe to Our Newsletter</h3>
              <form className="flex flex-col items-start">
                <Input type="email" placeholder="Enter your email" className="p-2.5 w-full max-w-[250px] mb-2.5 border-2 border-white bg-[#222] text-white" />
                <Button type="submit" variant="secondary" className="font-bold">Subscribe</Button>
              </form>
            </div>
          </div>
          <p className="footer-copyright text-center text-sm mt-5">
            © 2024 Sign Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
