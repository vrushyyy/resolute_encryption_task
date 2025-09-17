import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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
            alert("Signup successful!");
            if (onSignup) onSignup();
            navigate("/login");
        } catch (err: any) {
            alert(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="signup-page flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-3xl shadow-md">
                        ✨
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500">Sign up to get started</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-purple hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};
