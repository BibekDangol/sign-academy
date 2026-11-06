import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const homePath = '/';
  const isHomePage = location.pathname === homePath;

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">

        {/* Useful Links */}
        <div className="site-footer-column">
          <h3 className="text-[1.2rem] mb-[15px] text-[#f0f0f0]">Useful Links</h3>
          <ul className="list-none p-0">
            <li className="mb-[10px]">
              {isHomePage ? (
                <a href="#courses" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Our Services</a>
              ) : (
                <Link to={`${homePath}#courses`} className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Our Services</Link>
              )}
            </li>
            <li className="mb-[10px]">
              {isHomePage ? (
                <a href="#contact" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Contact Us</a>
              ) : (
                <Link to={`${homePath}#contact`} className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">Contact Us</Link>
              )}
            </li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div className="site-footer-column">
          <h3>Connect with Us</h3>
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
        <div className="site-footer-column">
          <h3>Our Newsletter</h3>
          <form className="flex flex-col gap-[10px]" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              aria-label="Newsletter email address"
              autoComplete="email"
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
      <div className="site-footer-bottom">
        <p className="text-center mt-[30px] text-[0.9rem] text-[#aaa]">© {new Date().getFullYear()} Sign Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
