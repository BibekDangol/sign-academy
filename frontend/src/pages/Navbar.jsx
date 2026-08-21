import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignLanguage, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const linkClass =
  "text-slate-300 no-underline px-3 py-2 text-[0.95rem] font-medium rounded-md transition-colors duration-150 " +
  "hover:text-white hover:bg-white/5 " +
  "max-md:w-full max-md:text-left max-md:py-3";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const confirmLogout = () => {
    logoutUser();
    setShowLogoutDialog(false);
    setDropdownOpen(false);
  };

  const links = user
    ? [
        { to: "/home2", label: "Home" },
        { to: "/courses", label: "Courses" },
        { to: "/handsign", label: "HandSign" },
        { to: "/dictionary", label: "Dictionary" },
        { to: "/about1", label: "About" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/login", label: "Courses" },
      ];

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-slate-800 bg-slate-900">
      <div className="relative flex justify-between items-center px-5 md:px-8 py-3 flex-wrap">
        {/* Logo */}
        <Link
          to={user ? "/home2" : "/"}
          className="flex items-center gap-2 text-white no-underline"
          onClick={() => setMobileOpen(false)}
        >
          <FaSignLanguage className="text-xl text-slate-300" />
          <span className="text-lg  tracking-tight">
            Sign Academy
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
          className="hidden max-md:flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-md border border-slate-700 hover:bg-white/5 transition-colors duration-150"
        >
          <span
            className={`block h-[2px] w-5 bg-slate-200 transition-transform duration-200 ${
              mobileOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-slate-200 transition-opacity duration-150 ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-slate-200 transition-transform duration-200 ${
              mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Nav content */}
        <div
          className={`items-center gap-1 max-md:absolute max-md:left-0 max-md:right-0 max-md:top-full max-md:border-t max-md:border-slate-800 max-md:bg-slate-900 max-md:flex-col max-md:items-stretch max-md:p-3 ${
            mobileOpen ? "max-md:flex" : "max-md:hidden"
          } flex`}
        >
          <ul className="list-none flex items-center gap-1 max-md:flex-col max-md:items-stretch max-md:gap-0 m-0 p-0">
            {links.map((link) => (
              <li key={link.to + link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="w-px h-5 bg-slate-800 mx-2 max-md:hidden" />

          <div className="relative flex items-center max-md:mt-2 max-md:pt-2 max-md:border-t max-md:border-slate-800">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors duration-150 max-md:w-full max-md:justify-start"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-slate-100 text-xs font-semibold">
                    {getInitials(user.full_name) || <FaUserCircle />}
                  </span>
                  <span className="text-sm text-slate-300">
                    {user.full_name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] rounded-md border border-slate-800 bg-slate-800 shadow-lg overflow-hidden max-md:static max-md:mt-2 max-md:w-full">
                    <ul className="list-none p-1 m-0 flex flex-col gap-0.5">
                      <li>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 text-slate-200 no-underline text-sm px-3 py-2 rounded transition-colors duration-150 hover:bg-white/10"
                        >
                          <FaUserCircle /> Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setShowLogoutDialog(true);
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded text-red-400 transition-colors duration-150 hover:bg-white/10"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 max-md:flex-col max-md:w-full max-md:items-stretch">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={linkClass}
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-slate-100 text-slate-900 font-medium hover:bg-white max-md:w-full"
                >
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-[460px] bg-slate-900 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white">
              Logout Confirmation
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-700 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;