import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Arvyax</h2>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {username ? (
          <>
            <Link to="/mySession" className="nav-link">Session</Link>
            <span className="welcome">{username}</span>
             <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
