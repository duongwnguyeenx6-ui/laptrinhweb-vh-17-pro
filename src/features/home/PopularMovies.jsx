import React from 'react';
import './PopularMovies.css';
import Icon from './Icon';

function PopularMovies({ movies, onSelectMovie }) {
  if (movies.length === 0) {
    return (
      <section className="popular-movies">
        <h2>Các Bộ Phim Phổ Biến</h2>
        <div className="empty-state">
          <p>Không tìm thấy phim phù hợp. Vui lòng chọn thể loại khác.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-movies">
      <h2>Các Bộ Phim Phổ Biến</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div
            id={`movie-card-${movie.id}`}
            key={movie.id}
            className="movie-card"
            onClick={() => onSelectMovie(movie)}
          >
            <div className="movie-image">
              <img src={movie.image_url} alt={movie.title} />
              <div className="movie-badge"><Icon name="star" size={14} animation="rotate" /> {String(movie.rating).replace('⭐','')}</div>
              <div className="movie-hover-info">
                <button className="watch-btn">XEM NGAY</button>
                <div className="quick-info">
                  <p>{movie.description}</p>
                </div>
              </div>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-meta">
                <span className="movie-duration">⏱ {movie.duration} phút</span>
              </div>
              <p className="movie-description">
                {movie.description && movie.description.substring(0, 60)}...
              </p>
              <div className="movie-footer">
                <span className="movie-views"><Icon name="users" size={14} /> {movie.viewers}</span>
                <span className="add-to-watchlist"><Icon name="heart" size={16} animation="heartbeat" /></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularMovies;
