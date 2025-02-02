import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import  AuthContext  from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {user ? (
        <>
          <Link to="/" className="nav-brand">Buy-Sell-Rent</Link>
          <div className="nav-links">
            <Link to="/search">Search</Link>
            <Link to="/your-products">Your Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/support">Support</Link>
            <Link to="/dashboard">Profile</Link>
            <Link to="/logout">Logout</Link>
          </div>
        </>
      ) : (
        <>
          <span className="nav-brand">Buy-Sell-Rent</span>
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/manual-register">Register</Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
