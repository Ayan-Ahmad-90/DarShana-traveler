import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const provider = new GoogleAuthProvider();

  const handleAuth = async () => {
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful 🎉");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully 🎉");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google Login Successful 🎉");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <input 
          type="email" 
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password" 
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          onClick={handleAuth}
          className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button 
          onClick={loginWithGoogle}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold mt-3"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
