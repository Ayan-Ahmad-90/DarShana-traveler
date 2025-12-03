import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, Smile, Calendar, Plane, MoreVertical, User } from "lucide-react";
import RightSidebar from "./RightSidebar";
import { useRightSidebar } from "../hooks/useRightSidebar";
import SignInModal from "./Auth/SignInModal";
import logoImage from "../images/images-map-logo.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { isOpen: sidebarIsOpen, openSidebar, closeSidebar } = useRightSidebar();
  const location = useLocation();

  // Auto-open sign-in modal on first visit
  useEffect(() => {
    const hasSeenSignIn = sessionStorage.getItem('hasSeenSignIn');
    if (!hasSeenSignIn) {
      const timer = setTimeout(() => {
        setIsSignInOpen(true);
        sessionStorage.setItem('hasSeenSignIn', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mood AI", path: "/mood", icon: Smile },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },  // ✔️ FIXED ROUTE
    // { name: "Safety", path: "/safety-guide", icon: Shield },
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Local-Guides", path: "/guides", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="relative flex items-center justify-center select-none group"
          >
            {/* Logo Image (Background) */}
            <img 
              src={logoImage} 
              alt="DarShana Logo" 
              className="h-32 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Text (Overlay) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pt-2">
              <div className="text-3xl font-extrabold font-serif tracking-wide drop-shadow-xl">
                <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Dar
                </span>
                <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 bg-clip-text text-transparent">
                  Shana
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-full text-sm flex items-center gap-1.5 font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
                      : "text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA + Kebab Menu */}
            <div className="ml-4 flex items-center gap-3">
              <Link
                to="/booking"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
              >
                Book Trip
              </Link>
              
              {/* Kebab Menu (3-dot) */}
              <button
                onClick={openSidebar}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-100/50 rounded-full transition-all duration-300 hover:scale-110"
                title="More options"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
                      : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/60"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA button */}
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg mt-4 shadow-md font-bold"
            >
              Book Trip
            </Link>
          </div>
        </div>
      )}

      {/* Right Sidebar Drawer */}
      <RightSidebar isOpen={sidebarIsOpen} onClose={closeSidebar} />

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </nav>
  );
};

export default Navbar;
