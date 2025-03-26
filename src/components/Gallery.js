import React from 'react';
import '../styles/Gallery.css';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const Gallery = () => {
  return (
    <div className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-images">
        <img src={image1} alt="Workout session" />
        <img src={image2} alt="Exercise routine" />
        <img src={image3} alt="Strength training" />
      </div>
    </div>
  );
};

export default Gallery;
