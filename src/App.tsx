import { useState, useEffect } from "react";
import BeautifulLoader from "./components/BeautifulLoader";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/Landingpage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound404 from "./components/NotFound404";

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  if (loading) {
    return <BeautifulLoader darkMode={darkMode} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage user={user} activeTab="home" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/dashboard/event" 
          element={user ? <DashboardPage user={user} activeTab="event" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/event" 
          element={user ? <DashboardPage user={user} activeTab="event" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/dashboard/education" 
          element={user ? <DashboardPage user={user} activeTab="education" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/education" 
          element={user ? <DashboardPage user={user} activeTab="education" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/dashboard/consultation" 
          element={user ? <DashboardPage user={user} activeTab="consultation" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/consultation" 
          element={user ? <DashboardPage user={user} activeTab="consultation" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/dashboard/community" 
          element={user ? <DashboardPage user={user} activeTab="community" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/community" 
          element={user ? <DashboardPage user={user} activeTab="community" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/dashboard/profile" 
          element={user ? <DashboardPage user={user} activeTab="profile" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <DashboardPage user={user} activeTab="profile" setActiveTab={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />} 
        />
        {/* 404 Catch-all Route */}
        <Route path="*" element={<NotFound404 darkMode={darkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;