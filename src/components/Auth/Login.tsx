import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import type { LoginData } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-fill email if coming from signup or remembered
  useEffect(() => {
    // From signup redirect
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
    // From remember me
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [location.state]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginData) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      // Store auth data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        
        // Store user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Remember email if checked
        if (rememberMe) {
          localStorage.setItem('rememberEmail', formData.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        // Update auth context (use safe any-cast to handle contexts that may not expose setAuth)
        if ((auth as any)?.setAuth) {
          (auth as any).setAuth(data.token, data.user);
        } else {
          // Backwards-compatible fallbacks if the context exposes different setters
          if ((auth as any)?.setToken) (auth as any).setToken(data.token);
          if ((auth as any)?.setUser) (auth as any).setUser(data.user);
        }
      }

      // Redirect based on role
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Login failed',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">DarShana Travel</h1>
        <p className="text-gray-600 mb-6">Welcome back! Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
