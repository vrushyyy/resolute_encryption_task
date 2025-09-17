import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { StudentForm } from "./components/StudentForm"; 

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <Router>
      <Routes>
        {/* if logged in -> student page, else login */}
        <Route path="/" element={user ? <Navigate to="/student" /> : <Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<LoginForm onLoginSuccess={setUser} />} />

        {/* Signup route */}
        <Route path="/signup" element={<SignupForm onSignup={() => {}} />} />
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
