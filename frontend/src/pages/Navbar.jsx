import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; // Import the AuthContext
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setShowConfirmationModal(true);
  };

  const confirmLogout = () => {
    logoutUser();
    setShowConfirmationModal(false);
  };

  return (
    <nav className="flex justify-between items-center px-5 py-[15px] bg-[#333] text-white flex-wrap">
      {/* Link the logo to the home page */}
      <Link to="/" className="text-2xl font-bold text-white no-underline">
        Sign Academy
      </Link>

      {isMobile && (
        <Button className="bg-transparent border-none text-white cursor-pointer text-xl shadow-none hover:bg-transparent" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Close' : '☰'}
        </Button>
      )}

      <ul className={`list-none flex gap-5 items-center max-md:flex-col max-md:w-full max-md:bg-[#333] max-md:pt-[10px] ${menuOpen ? 'max-md:flex' : 'max-md:hidden'}`}>
        <li className="flex items-center max-md:p-[10px] max-md:justify-center">
          <Link to="/home2" className="text-white no-underline p-[10px] text-xl">Home</Link>
          <Link to="/courses" className="text-white no-underline p-[10px] text-xl">Courses</Link>
          <Link to="/handsign" className="text-white no-underline p-[10px] text-xl">HandSign</Link>
          <Link to="/dictionary" className="text-white no-underline p-[10px] text-xl">Dictionary</Link>
          <Link to="/about1" className="text-white no-underline p-[10px] text-xl">About</Link>
        </li>

        <li className="flex items-center max-md:p-[10px] max-md:justify-center gap-[10px]">
          {user ? (
            <>
              <span>
                <FaUserCircle className="icon" />
                Welcome, {user.full_name}
                <Button onClick={() => setShowMenu(!showMenu)} className="bg-transparent border-none text-white cursor-pointer text-xl shadow-none hover:bg-transparent">
                  <FaBars />
                </Button>
              </span>
              {showMenu && (
                <div className="absolute top-[60px] right-5 bg-[#444] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.2)] w-[200px] z-[1000]">
                  <ul className="list-none p-0 m-0">
                    <li className="p-[10px] border-b border-solid border-[#555] last:border-b-0">
                      <Link to="/dashboard" className="text-white no-underline p-[10px] bg-transparent border-none w-full text-left cursor-pointer text-base">
                        <FaUserCircle className="icon" /> Profile
                      </Link>
                    </li>
                    <li className="p-[10px] border-b border-solid border-[#555] last:border-b-0">
                      <Button className="text-white bg-[#f44336] border-none w-full text-left justify-start cursor-pointer text-base px-5 py-[10px] rounded-[5px] mt-[10px] transition-colors duration-300 hover:bg-[#d32f2f]" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" /> Logout
                      </Button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <Link to="/signup" className="flex items-center gap-[10px] text-white no-underline p-[10px] text-xl">
              <FaUserCircle className="icon" /> Sign Up
            </Link>
          )}
        </li>
      </ul>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>Are you sure you want to logout?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
            <Button className="bg-[#f44336] text-white hover:bg-[#d32f2f]" onClick={confirmLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;