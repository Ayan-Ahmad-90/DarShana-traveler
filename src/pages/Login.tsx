import { ArrowRight, Lock, Mail, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImage from "../images/image-login-desh.jpg";
import { authApi } from "../services/api";

interface LoginProps {
  onClose?: () => void;
  isModal?: boolean;
}

const Login: React.FC<LoginProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, login } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [loginStep, setLoginStep] = useState<1 | 2 | 3>(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Switch view based on URL
  useEffect(() => {
    if (
      location.pathname.toLowerCase() === "/register" ||
      location.state?.view === "signup"
    ) {
      setIsLoginView(false);
      setLoginStep(1);
    } else {
      setIsLoginView(true);
      setLoginStep(1);
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setError("Enter email or mobile number");
      return;
    }
    setError("");
    setLoginStep(2);
  };

  const handleLoginStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword) {
      setError("Enter your password");
      return;
    }
    setError("");
    setIsLoading(true);
    setOtpMessage("");

    try {
      // Admin login bypasses OTP
      if (loginEmail === 'admin@darshana.com') {
        await login(loginEmail, loginPassword);
        if (onClose) onClose();
        else navigate('/admin');
        return;
      }

      const res = await authApi.requestOtp(loginEmail, loginPassword);
      if (!res.success) throw new Error(res.error || "Failed to send OTP");
      setOtpMessage("OTP sent to your email/SMS.");
      setLoginStep(3);
      setResendTimer(45);
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Enter the OTP sent to you");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(loginEmail, otp);
      if (!res.success || !res.data) throw new Error(res.error || "Invalid OTP");
      const payload: any = res.data;
      const token = payload.token || payload.accessToken;
      const user = payload.user;
      if (token && user) {
        setAuth(token, user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (onClose) onClose();
      else navigate("/profile");
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupName || !signupEmail || !signupPassword) {
      setError("All fields are required");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({
        fullName: signupName,
        email: signupEmail,
        phone: signupEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });

      if (!res.success || !res.data) throw new Error(res.error || "Signup failed");

      const payload: any = res.data;
      const token = payload.token || payload.accessToken;
      const user = payload.user;
      if (token && user) {
        setAuth(token, user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (onClose) onClose();
      else navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  const handleClose = () => {
    if (onClose) onClose(); // Modal close
    else navigate("/"); // Full page close → go home
  };

  return (
    <div
      className={`${
        isModal
          ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          : "min-h-screen bg-orange-50/50"
      } flex items-center justify-center p-4`}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative
        ${isLoginView ? "w-[760px] h-[520px] md:flex-row" : "max-w-[430px]"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 shadow-sm"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Left Illustration */}
        <div
          className={`relative bg-orange-100 transition-all duration-500 ${
            isLoginView ? "hidden md:block w-1/2" : "w-full h-40"
          }`}
        >
          <img
            src={loginImage}
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {isLoginView ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-bold mb-4 font-serif">DarShana</h2>
              <p className="text-lg opacity-90">Discover India deeply.</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <h2 className="text-4xl font-bold font-serif text-white drop-shadow-lg">
                DarShana
              </h2>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div
          className={`flex flex-col justify-center transition-all duration-500 ${
            isLoginView ? "w-full md:w-1/2 p-8" : "w-full p-8"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 font-serif mb-1">
                {isLoginView ? "Welcome Back" : "Create an Account"}
              </h2>
              <p className="text-gray-500 text-xs">
                {isLoginView ? "Login to continue" : "Start exploring India"}
              </p>
            </div>

            {/* Toggle */}
            {isLoginView && (
              <div className="flex bg-gray-100 p-1.5 rounded-full mb-6 relative">
                <div
                  className={`absolute w-1/2 h-full rounded-full bg-white shadow-sm transition-all ${
                    isLoginView ? "left-0" : "left-1/2"
                  }`}
                ></div>

                <button
                  onClick={() => {
                    setIsLoginView(true);
                    setLoginStep(1);
                    setError("");
                  }}
                  className={`flex-1 py-3 text-sm font-medium z-10 ${
                    isLoginView ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setIsLoginView(false);
                    setError("");
                  }}
                  className={`flex-1 py-3 text-sm font-medium z-10 ${
                    !isLoginView ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLoginView && (
              <div className="space-y-4">
                {loginStep === 1 && (
                  <form onSubmit={handleLoginStep1} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email / Mobile Number
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          className="w-full pl-12 pr-3 py-3 border rounded-xl outline-none text-base"
                          placeholder="Enter Email or Mobile"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-base"
                    >
                      {isLoading ? "Checking..." : "Continue"} <ArrowRight size={16} />
                    </button>
                  </form>
                )}

                {loginStep === 2 && (
                  <form onSubmit={handleLoginStep2} className="space-y-4">
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Enter Password</label>
                      <button
                        type="button"
                        onClick={() => { setLoginStep(1); setError(""); }}
                        className="text-xs text-orange-600"
                      >
                        Change Email
                      </button>
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="password"
                        className="w-full pl-12 pr-3 py-3 border rounded-xl outline-none text-base"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-base"
                    >
                      {isLoading ? "Sending OTP..." : "Verify & Send OTP"} <ArrowRight size={16} />
                    </button>
                  </form>
                )}

                {loginStep === 3 && (
                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">
                          Enter OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => { setLoginStep(2); setOtp(""); setOtpMessage(""); }}
                          className="text-xs text-orange-600"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          className="w-full pl-12 pr-3 py-3 border rounded-xl outline-none text-base tracking-[0.3em]"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          autoFocus
                        />
                      </div>
                      {otpMessage && <p className="mt-2 text-sm text-green-600">{otpMessage}</p>}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <button
                        type="button"
                        disabled={resendTimer > 0 || isLoading}
                        className={`underline ${resendTimer > 0 ? "opacity-50" : "text-orange-600"}`}
                        onClick={handleLoginStep2}
                      >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </button>
                      <span className="text-gray-500">Secure verification</span>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all text-base"
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 text-base"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                  />
                  Sign in with Google
                </button>

                <p className="text-center text-xs mt-3">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="text-orange-600"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            )}

            {/* SIGNUP FORM */}
            {!isLoginView && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border rounded-full text-base"
                    placeholder="Full Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border rounded-full text-base"
                    placeholder="Email / Phone"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 border rounded-full text-base"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 border rounded-full text-base"
                    placeholder="Confirm Password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-full font-bold hover:bg-orange-600 transition text-base"
                >
                  {isLoading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center text-sm mt-2">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="text-orange-600"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
