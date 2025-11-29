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
    { name: "Travel Hub", path: "/travelhub", icon: Plane },  // ✔️ FIXED ROUTE
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Assistant", path: "/assistant", icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
  to="/" 
  className="text-3xl font-extrabold font-serif flex items-center gap-1 select-none"
>
  {/* Dar (Professional Blue Gradient) */}
  <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
    Dar
  </span>
  {/* Shana (Neon Purple Gradient) */}
  <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
    Shana
  </span>
</Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 font-medium transition-all ${
                    isActive(link.path)
                      ? "text-primary-700 bg-primary-100"
                      : "text-primary-700 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA + Kebab Menu */}
            <div className="ml-4 flex items-center gap-3">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow hover:scale-105"
              >
                Book Trip
              </Link>
              
              {/* Kebab Menu (3-dot) */}
              <button
                onClick={openSidebar}
                className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition hover:text-primary-700"
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
        <div className="md:hidden bg-white border-t border-primary-200">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base transition ${
                    isActive(link.path)
                      ? "text-primary-700 bg-primary-100"
                      : "text-primary-700 hover:text-primary-600 hover:bg-primary-50"
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
              className="block text-center bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-full mt-2 shadow-md"
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
