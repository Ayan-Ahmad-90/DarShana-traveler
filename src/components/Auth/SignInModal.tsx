import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './SignInModal.css';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      console.log('Login attempt with:', inputRef.current.value);
      // Add actual login logic here
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Sign-In clicked');
    // Add Google login logic here
  };

  if (!isVisible && !isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className={`signin-modal-overlay ${isOpen ? 'active' : ''}`} 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="signin-modal-container">
        <button className="signin-close-btn" onClick={onClose}>&times;</button>
        
        {/* Left Side: Illustration */}
        <div className="signin-modal-left">
          <img 
            src="/images/hero.png" 
            alt="Travel Illustration" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.backgroundColor = '#FFE0B2';
              }
            }} 
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="signin-modal-right">
          <h2 className="signin-modal-title">Darshana</h2>
          <p className="signin-modal-subtitle">Login or Create Account</p>

          <form onSubmit={handleLogin}>
            <div className="signin-form-group">
              <input 
                type="text" 
                className="signin-input-field" 
                placeholder="Mobile number / Email" 
                required 
                ref={inputRef}
              />
            </div>

            <button type="submit" className="signin-btn-primary">Continue</button>
          </form>

          <div className="signin-divider">Or</div>

          <button className="signin-btn-google" onClick={handleGoogleLogin}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="signin-google-icon" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignInModal;
