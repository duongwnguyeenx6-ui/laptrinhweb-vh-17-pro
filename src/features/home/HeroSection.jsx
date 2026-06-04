import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import Icon from './Icon';
import defaultDatabase from '../../data/database';

function HeroSection({ movies = [], onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideMovies = (movies.length > 0 ? movies : defaultDatabase.movies).slice(0, 4);
  const slides = slideMovies.map(movie => ({
    title: movie.title,
    subtitle: movie.description || 'Phim bom tấn được lựa chọn cho bạn',
    image: movie.image_url,
    genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'Phim Hay',
    rating: String(movie.rating || '4.8/5 ⭐').replace('⭐', '').trim()
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <div className="slide-info">
                <span className="slide-genre">{slide.genre}</span>
                <span className="slide-rating"><Icon name="star" size={14} animation="rotate" /> {slide.rating}</span>
              </div>
              <div className="slide-actions">
                <button className="btn-watch" onClick={() => onNavigate('movies')}>
                  <Icon name="play" size={16} animation="pulse" /> Xem Ngay
                </button>
                <button className="btn-details" onClick={() => onNavigate('genres')}>
                  <Icon name="plus" size={16} /> Thông Tin
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="slider-arrow prev"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
      >
        ❮
      </button>
      <button
        className="slider-arrow next"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      >
        ❯
      </button>
    </section>
  );
}

export default HeroSection;
