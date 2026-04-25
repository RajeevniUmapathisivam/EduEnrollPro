import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CourseRegistrationPage from './pages/CourseRegistrationPage';
import AdminPanel from './pages/AdminPanel';
import AdminAnalytics from './pages/AdminAnalytics';
import HomePage from './pages/HomePage';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-course" element={<CourseRegistrationPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />


      </Routes>
    </Router>
  );
}

export default App;
