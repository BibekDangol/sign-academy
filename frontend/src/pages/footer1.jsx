import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ Import Link and useLocation
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/home2'; // ✅ Check if user is on Home page

  return (
    <footer className="bg-[#111] text-white pt-10 px-5 pb-5 font-[Arial,sans-serif]">
      <div className="flex justify-between flex-wrap gap-[30px] max-w-[1200px] mx-auto max-md:flex-col max-md:items-start max-md:gap-10">

        {/* Useful Links */}
        <div className="flex-[1_1_250px] min-w-[200px]">
          <h3 className="text-[1.2rem] mb-[15px] text-[#f0f0f0]">Useful Links</h3>
          <ul className="list-none p-0">
            <li className="mb-[10px]">
            {isHomePage ? (
  <a href="#courses" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Our Services</a>  // ✅ if already in /home2, simple anchor jump
) : (
  <Link to="/home2#courses" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Our Services</Link> // ✅ navigate to /home2 and then jump
)}
            </li>
            <li className="mb-[10px]">
              {isHomePage ? (
                <a href="#contact" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Contact Us</a>
              ) : (
                <Link to="/home2#contact" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Contact Us</Link>
              )}
            </li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div className="flex-[1_1_250px] min-w-[200px]">
          <h3 className="text-[1.2rem] mb-[15px] text-[#f0f0f0]">Connect with Us</h3>
          <ul className="list-none p-0">
            <li className="mb-[10px]">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                <FaFacebook className="mr-2 align-middle text-base" /> Facebook
              </a>
            </li>
            <li className="mb-[10px]">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                <FaTwitter className="mr-2 align-middle text-base" /> Twitter
              </a>
            </li>
            <li className="mb-[10px]">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                <FaInstagram className="mr-2 align-middle text-base" /> Instagram
              </a>
            </li>
            <li className="mb-[10px]">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                <FaLinkedin className="mr-2 align-middle text-base" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex-[1_1_250px] min-w-[200px]">
          <h3 className="text-[1.2rem] mb-[15px] text-[#f0f0f0]">Subscribe to Our Newsletter</h3>
          <form className="flex flex-col gap-[10px]" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="p-[10px] border-none rounded w-full"
              required
            />
            <Button type="submit" variant="secondary" className="rounded">
              Subscribe
            </Button>
          </form>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="text-center mt-[30px] text-[0.9rem] text-[#aaa]">© {new Date().getFullYear()} Sign Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
