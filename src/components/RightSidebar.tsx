import React, { useEffect } from 'react';
import { X, User, Luggage, Bell, Globe, LogOut, AlertCircle, Users, Shield, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulated API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
      onClose();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  interface MenuItem {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    path: string;
    requiresAuth?: boolean;
  }

  const handleNavigate = (path: string, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/login');
      onClose();
      return;
    }
    navigate(path);
    onClose();
  };

  const menuItems: MenuItem[] = React.useMemo(() => {
    const base: MenuItem[] = [
      { label: 'My Profile', icon: User, color: 'text-blue-600', path: '/profile', requiresAuth: true },
      { label: 'My Trips', icon: Luggage, color: 'text-orange-600', path: '/my-trips', },
      { label: 'Festival Alerts', icon: Bell, color: 'text-red-600', path: '/festival-alerts' },
      { label: 'Language', icon: Globe, color: 'text-green-600', path: '/language' },
      { label: 'Assistant', icon: Bot,  color: 'text-indigo-600', path: '/Assistant' },
      { label: 'Guide portal', icon: Users, color: 'text-indigo-600', path: '/become-guide' },
    ];

    base.push({ label: 'Admin Dashboard', icon: Shield, color: 'text-slate-700', path: '/admin' });

    return base;
  }, [isAuthenticated]);

  // Map to onClick handlers when rendering
  // (the rendering code below expects menuItems to contain icon/color/label and uses item.onClick;
  //  we attach onClick here to keep render simple)
  const menuItemsWithHandlers = menuItems.map(it => ({
    ...it,
    onClick: () => handleNavigate(it.path, it.requiresAuth),
  }));

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
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-stone-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-lg transition text-stone-600 hover:text-stone-800"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* User Profile Section */}
        {isAuthenticated && user ? (
          <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-stone-100 text-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900 text-sm">{user.name}</h3>
                <p className="text-xs text-stone-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { navigate('/profile'); onClose(); }}
              className="w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border-b border-stone-100 text-sm">
            <button
              onClick={() => { navigate('/login'); onClose(); }}
              className="w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors mb-2"
            >
              Sign In
            </button>
            <button
              onClick={() => { navigate('/register'); onClose(); }}
              className="w-full px-3 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg text-xs font-semibold transition-colors"
            >
              Register
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="p-4 space-y-1.5 text-sm">
          {menuItemsWithHandlers.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors group"
              >
                <Icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Danger Zone */}
        {isAuthenticated && user && (
          <div className="p-4 border-t border-stone-100 space-y-2 text-sm">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Logout</span>
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors group disabled:opacity-50"
            >
              <AlertCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-stone-100 bg-stone-50 text-xs">
          <p className="text-[11px] text-stone-500 text-center">
            🇮🇳 DarShana Travel Explorer v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
