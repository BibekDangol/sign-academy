import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex justify-between items-center bg-[#111] text-white px-[30px] py-[15px] flex-wrap">
      {/* Left - Logo */}
      <div className="flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white no-underline hover:text-[#ccc]"
        >
          Sign Academy
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden max-md:block text-[1.8rem] text-white"
        onClick={toggleMenu}
      >
        ☰
      </Button>

      {/* Right - Navigation & User Info */}
      <div
        className={`flex items-center max-md:flex-col max-md:w-full max-md:mt-[10px] ${
          isMenuOpen ? "max-md:flex" : "max-md:hidden"
        }`}
      >
        <ul className="flex list-none gap-5 max-md:flex-col max-md:w-full max-md:gap-[10px]">
          <li>
            <Link
              to="/"
              onClick={toggleMenu}
              className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#ccc] max-md:w-full max-md:text-left max-md:py-[10px] max-md:px-0"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#ccc] max-md:w-full max-md:text-left max-md:py-[10px] max-md:px-0"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              onClick={toggleMenu}
              className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#ccc] max-md:w-full max-md:text-left max-md:py-[10px] max-md:px-0"
            >
              Courses
            </Link>
          </li>
        </ul>
        <div className="ml-5 max-md:w-full max-md:mt-[10px]">
          {user ? (
            <Button
              variant="ghost"
              onClick={logoutUser}
              className="text-white text-base hover:text-[#ccc] max-md:w-full max-md:justify-start max-md:py-[10px] max-md:px-0"
            >
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="text-white bg-transparent border-none text-base cursor-pointer no-underline transition-colors duration-300 hover:text-[#ccc] max-md:w-full max-md:text-left max-md:py-[10px] max-md:px-0"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
