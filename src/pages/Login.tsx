import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth/SignInModal.css'; // Reuse the CSS

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/travelhub');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Sign-In clicked');
    // Add Google login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Reusing the container style but removing fixed positioning/overlay since it's a page now */}
      <div className="signin-modal-container" style={{ transform: 'none', margin: '0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="signin-form-group">
              <input 
                type="text" 
                className="signin-input-field" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="signin-form-group">
              <input 
                type="password" 
                className="signin-input-field" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="signin-btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div className="signin-divider">Or</div>

          <button className="signin-btn-google" onClick={handleGoogleLogin}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="signin-google-icon" />
            Sign in with Google
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
