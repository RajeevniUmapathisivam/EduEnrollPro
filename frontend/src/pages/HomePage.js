import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* HEADER */}
     <header className="home-header">
  <img src="/logo.png" alt="Logo" className="home-header-logo" />
  <h1 className="system-name">EduEnroll Pro</h1>
</header>

      {/* MAIN CONTENT */}
      <div className="home-content">
        <h1 className="home-title">
          Welcome to the Course Registration System
        </h1>

        <p className="home-subtext">
          Register for your courses quickly, securely, and efficiently.
        </p>

        <button 
          className="home-button" 
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        © {new Date().getFullYear()} EduEnroll Pro. All rights reserved.
      </footer>

    </div>
  );
};

export default HomePage;