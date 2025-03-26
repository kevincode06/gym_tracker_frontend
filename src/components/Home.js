import React from 'react';
import '../styles/Home.css'; 
import image5 from '../assets/image5.jpg'; 

const Home = () => {
  return (
    <div className="home-landing-page">
      {/* Background Image using inline style */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${image5})` }}
      ></div>
      
      <div className="content-container">
        <h1 className="main-heading">START YOUR FITNESS</h1>
        <p className="subheading">
          World is committed to making participation in the harassment-free experience for everyone, 
          regardless of level of experience.
        </p>
        
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">+12</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+200</div>
            <div className="stat-label">Exercise Equipments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+2000</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+20</div>
            <div className="stat-label">Expert Trainers</div>
          </div>
        </div>
        
        <div className="slider-dots">
          <div className="slider-dot"></div>
          <div className="slider-dot active"></div>
          <div className="slider-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
