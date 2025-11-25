import React, { useEffect } from 'react';
import { X, User, Luggage, Bell, Globe, LogOut } from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const menuItems = [
    { label: 'Profile', icon: User, color: 'text-blue-600' },
    { label: 'My Trips', icon: Luggage, color: 'text-orange-600' },
    { label: 'Festival Alerts', icon: Bell, color: 'text-red-600' },
    { label: 'Language', icon: Globe, color: 'text-green-600' },
    { label: 'Logout', icon: LogOut, color: 'text-stone-600', divider: true },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition text-stone-600 hover:text-stone-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors group"
                >
                  <Icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.label}</span>
                </button>
                {item.divider && <div className="border-t border-stone-100 my-2" />}
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-100 bg-stone-50">
          <p className="text-xs text-stone-500 text-center">
            🇮🇳 DarShana Travel Explorer v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
