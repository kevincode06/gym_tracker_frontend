import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/myred.png';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="../assets/myred.png" />  {/* Use the imported logo */}
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/exercise">Exercise</Link>
        <Link to="/gallery">Gallery</Link>
      </div>
    </nav>
  );
};

export default Navbar;
