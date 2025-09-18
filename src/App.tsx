import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { StudentForm } from "./components/StudentForm";

function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        {/* Signup route */}
        <Route
          path="/signup"
          element={
            <SignupForm
              onSignup={() => {
                window.location.href = "/login";
              }}
            />
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={<LoginForm onLoginSuccess={(u: any) => {
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
          }} />}
        />

        {/* Student route */}
        <Route
          path="/student"
          element={
            user ? (
              <StudentForm
                onLogout={() => {
                  setUser(null);
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
