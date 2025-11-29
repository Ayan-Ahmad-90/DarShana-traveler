import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, Smile, Bot, Calendar, Plane, MoreVertical } from "lucide-react";
import RightSidebar from "./RightSidebar";
import { useRightSidebar } from "../hooks/useRightSidebar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: sidebarIsOpen, openSidebar, closeSidebar } = useRightSidebar();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mood AI", path: "/mood", icon: Smile },
    { name: "Trip Planner", path: "/trip-planner-new", icon: Plane },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },  // ✔️ FIXED ROUTE
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Assistant", path: "/assistant", icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl shadow-lg z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="text-3xl font-extrabold font-serif flex items-center gap-1 select-none group"
          >
            {/* Dar – Dark Orange to Amber Gradient with Glow */}
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-orange-400 group-hover:to-amber-300 transition-all duration-300">
              Dar
            </span>

            {/* Shana – Deep Emerald to Light Green Gradient with Glow */}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-400 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-emerald-500 group-hover:to-green-300 transition-all duration-300">
              Shana
            </span>
          </Link>



          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
                      : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/60"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA + Kebab Menu */}
            <div className="ml-6 flex items-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Book Trip
              </Link>
              
              {/* Kebab Menu (3-dot) */}
              <button
                onClick={openSidebar}
                className="p-2.5 text-slate-600 hover:text-orange-600 hover:bg-orange-100/40 rounded-lg transition-all duration-300 hover:scale-110"
                title="More options"
              >
                <MoreVertical size={22} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
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
              to="/register"
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
    </nav>
  );
};

export default Navbar;
