import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SignupFormProps {
  onSignup?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/signup", { email, password });
      toast.success("✅ Signup successful!");
      if (onSignup) onSignup();
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "❌ Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 animate-gradient-background"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transition-transform transform hover:scale-[1.02]">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-4xl shadow-2xl animate-pulse">
            🏥
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
          <p className="text-gray-500">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-4 focus:ring-purple-400 focus:border-purple-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-4 focus:ring-purple-400 focus:border-purple-500 outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 font-medium hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};
