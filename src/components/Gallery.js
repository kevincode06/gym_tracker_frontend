import React, { useState, useEffect } from 'react';
import '../styles/Gallery.css';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import about from '../assets/about.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import gym1 from '../assets/gym1.jpg';
import gym2 from '../assets/gym2.jpg';
import gym3 from '../assets/gym3.jpg';
import gym4 from '../assets/gym4.jpg';
import gym5 from '../assets/gym5.jpg';


const Gallery = () => {
  const images = [image1, image2, image3, image4, image5, about, pic2, pic3, image1, image2, image3, image4, image5, about, pic2, pic3, gym1, gym2, gym3, gym4, gym5];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Slide every 1 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-slider">
        <button className="prev-btn" onClick={prevSlide}>❮</button>
        <div className="gallery-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Slide ${index + 1}`} />
          ))}
        </div>
        <button className="next-btn" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

export default Gallery;
